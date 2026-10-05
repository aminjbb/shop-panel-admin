# Graphify

Graphify is the repository-local source graph for FSD agents. It resolves TypeScript path aliases with the project's `tsconfig.json`, records dependencies and reverse dependents, identifies impacted tests, and reports upward-layer or cross-slice imports.

```sh
node .codex/scripts/graphify.mjs build
node .codex/scripts/graphify.mjs find products
node .codex/scripts/graphify.mjs impact src/features/products/hooks/useProducts.ts
node .codex/scripts/graphify.mjs check
```

The generated artifact is `.codex/graphify/graph.json`. `check` reports existing findings and exits non-zero when violations or unresolved local modules exist; it does not silently hide repository debt.
