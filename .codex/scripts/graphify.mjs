import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
const layers=['shared','shared-app','entities','features','widgets','pages','app'];
const slash=s=>s.replaceAll('\\','/');
const isTest=s=>/(?:\.(?:test|spec)\.[cm]?[jt]sx?$|\/__tests__\/)/.test(s);
export function buildGraph(root){
 root=path.resolve(root); const rel=f=>slash(path.relative(root,f));
 const cfg=ts.findConfigFile(root,ts.sys.fileExists,'tsconfig.json'); if(!cfg) throw Error('tsconfig.json is required');
 const raw=ts.readConfigFile(cfg,ts.sys.readFile); const parsed=ts.parseJsonConfigFileContent(raw.config,ts.sys,path.dirname(cfg));
 const paths=[]; const walk=d=>{if(!fs.existsSync(d))return; for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory())walk(p); else if(/\.[cm]?[jt]sx?$/.test(e.name))paths.push(p)}}; walk(path.join(root,'src'));
 const files={}; for(const f of paths){const id=rel(f), p=id.split('/'), layer=layers.includes(p[1])?p[1]:'unknown'; files[id]={layer,slice:['app','shared','shared-app','unknown'].includes(layer)?null:p[2],test:isTest(id),imports:[],dependencies:[],dependents:[]}}
 const edges=[],external=[],unresolved=[],violations=[],cache=ts.createModuleResolutionCache(root,x=>x,parsed.options);
 for(const f of paths){const id=rel(f), source=ts.createSourceFile(f,fs.readFileSync(f,'utf8'),ts.ScriptTarget.Latest,true), specs=[];
  const visit=n=>{if((ts.isImportDeclaration(n)||ts.isExportDeclaration(n))&&n.moduleSpecifier&&ts.isStringLiteralLike(n.moduleSpecifier))specs.push({node:n.moduleSpecifier,kind:ts.isExportDeclaration(n)?'export':'import'}); else if(ts.isCallExpression(n)&&n.expression.kind===ts.SyntaxKind.ImportKeyword&&n.arguments[0]&&ts.isStringLiteralLike(n.arguments[0]))specs.push({node:n.arguments[0],kind:'dynamic'}); ts.forEachChild(n,visit)}; visit(source);
  for(const {node,kind} of specs){const spec=node.text,line=source.getLineAndCharacterOfPosition(node.getStart(source)).line+1; files[id].imports.push(spec); const res=ts.resolveModuleName(spec,f,parsed.options,ts.sys,cache).resolvedModule, target=res&&rel(res.resolvedFileName), local=spec.startsWith('.')||spec.startsWith('@/');
   if(target&&files[target]){const edge={from:id,to:target,specifier:spec,kind,line}; edges.push(edge); files[id].dependencies.push(target); files[target].dependents.push(id); const a=files[id],b=files[target],rank=l=>['shared','shared-app'].includes(l)?0:layers.indexOf(l); if(a.layer!=='unknown'&&b.layer!=='unknown'){if(rank(b.layer)>rank(a.layer))violations.push({...edge,rule:'upward-layer-import'}); else if(a.layer===b.layer&&a.slice&&b.slice&&a.slice!==b.slice)violations.push({...edge,rule:'cross-slice-import'})}}
   else if(local&&!res&&!spec.match(/\.(css|scss|sass|less|svg|png|jpg|jpeg|webp)$/))unresolved.push({from:id,specifier:spec,line}); else if(!local)external.push({from:id,specifier:spec,line,resolved:Boolean(res)});
  }}
 for(const n of Object.values(files)){n.dependencies=[...new Set(n.dependencies)].sort();n.dependents=[...new Set(n.dependents)].sort()}
 return {schemaVersion:2,generatedAt:new Date().toISOString(),root:'src',aliases:parsed.options.paths||{},layers:Object.fromEntries(layers.map(l=>[l,Object.keys(files).filter(f=>files[f].layer===l)])),files,edges,external,unresolved,violations};
}
export function impact(g,seeds){for(const f of seeds)if(!g.files[f])throw Error('Unknown graph path: '+f);const out=new Set(seeds),q=[...seeds];while(q.length){for(const f of g.files[q.shift()].dependents)if(!out.has(f)){out.add(f);q.push(f)}}return {affected:[...out].sort(),tests:[...out].filter(f=>g.files[f].test).sort()}}
function main(){const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),[cmd='build',...args]=process.argv.slice(2),g=buildGraph(root);if(cmd==='build'){fs.mkdirSync(path.join(root,'.codex/graphify'),{recursive:true});fs.writeFileSync(path.join(root,'.codex/graphify/graph.json'),JSON.stringify(g,null,2)+'\n');console.log(JSON.stringify({files:Object.keys(g.files).length,edges:g.edges.length,violations:g.violations.length,unresolved:g.unresolved.length}))}else if(cmd==='find')console.log(JSON.stringify(Object.keys(g.files).filter(f=>f.toLowerCase().includes((args[0]||'').toLowerCase())),null,2));else if(cmd==='impact')console.log(JSON.stringify(impact(g,args.map(slash)),null,2));else if(cmd==='check'){console.log(JSON.stringify({violations:g.violations,unresolved:g.unresolved},null,2));if(g.violations.length||g.unresolved.length)process.exitCode=1}else throw Error('Unknown command: '+cmd)}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{main()}catch(e){console.error(e.message);process.exitCode=1}}

