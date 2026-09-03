# Debug Strategy Instruction

> **Version:** 1.0.0 | **Updated:** 2026-06-30

## Purpose

This document defines the systematic debugging strategy for the Dynova Frontend. Always follow this order to avoid wasted time and wrong fixes.

---

## The Five-Layer Debug Model

Every bug in this project lives in exactly one FSD layer. Identify the layer first.

```
pages/         ← routing or page composition bug
widgets/       ← wrong model-to-UI wiring
  ├── ui/      ← rendering bug (check: is logic leaking into UI?)
  └── models/  ← wrong hook logic, queryKey, or state
features/      ← feature-specific logic bug
entities/      ← domain data mapping bug
shared-app/    ← reusable component or utility bug
config/        ← API base URL, auth, env vars
```

---

## Step-by-Step Debug Flow

### 1. Read the Error

```
Console error   → JS runtime → trace the stack to the source file
Network error   → API layer  → check status code + URL in DevTools
White screen    → React render crash → check Error Boundary + console
Missing data    → Query layer → check queryKey + API response
Wrong value     → State layer → check model/hook return values
Build error     → TypeScript → fix types first, everything else second
```

### 2. Identify the Layer

Ask: **"Where does the wrong value originate?"**

Follow data flow **downward**:
```
API response → api/<name>Api.ts → useQuery (model) → UI props → UI render
```

Stop at the first layer where the value is wrong. That is the root cause layer.

### 3. Read the Actual File

Never diagnose without reading the file. Read:
- The file at the identified layer
- Its imports (wrong import direction = FSD violation = common bug source)
- The types it uses (from `types/index.ts`)

### 4. Apply the Targeted Fix

Fix only the root cause layer. Do not cascade fixes unless the bug spans multiple layers.

---

## Common Bug Patterns in This Project

### A. FSD Import Violation (very common)
```typescript
// ❌ Feature importing from widget — forbidden cross-layer import
import { usePersonModel } from "@/widgets/person/models/usePersonModel";

// ✅ Fix: move shared logic to entities/ or shared-app/
import { usePersonModel } from "@/entities/person/models/usePersonModel";
```

### B. Logic in UI File
```tsx
// ❌ useState/useEffect directly in ui/*.tsx
const [isOpen, setIsOpen] = useState(false); // inside UI component

// ✅ Fix: move to models/, pass as prop
```

### C. queryKey Mismatch
```typescript
// Query registered with:
queryKey: ["person", "list"]

// Invalidation targeting:
queryClient.invalidateQueries({ queryKey: ["persons"] }); // ❌ typo → no invalidation

// ✅ Fix: match exactly
queryClient.invalidateQueries({ queryKey: ["person"] });
```

### D. Missing `enabled` Guard
```typescript
// ❌ Query runs even when id is undefined
useQuery({ queryKey: ["person", "detail", id], queryFn: () => personApi.getById(id) });

// ✅ Fix
useQuery({ queryKey: ["person", "detail", id], queryFn: () => personApi.getById(id!), enabled: !!id });
```

### E. Hardcoded Base URL instead of env var
```typescript
// ❌ Will break in staging/production
const BASE_URL = "http://localhost:8080/api";

// ✅ Fix: use getEnv()
import { getEnv } from "@/config/env";
const BASE_URL = getEnv("VITE_API_BASE_URL");
```

### F. Missing Error / Loading / Empty States
```tsx
// ❌ Only handles success — crashes on loading or error
return <Table data={data.items} />;

// ✅ Fix: handle all 4 states
if (isLoading) return <Skeleton />;
if (error) return <ErrorPanel onRetry={refetch} />;
if (!data?.items?.length) return <EmptyState />;
return <Table data={data.items} />;
```

### G. i18n Key Missing
```
Translation key "person.form.fields.nationalCode.label" not found.
→ Check src/lib/i18n/locales/fa/translation.json
→ Add missing key under correct namespace
→ Verify useTranslation is called in model, not UI
```

---

## DevTools Cheat Sheet

| Tool | Where | Use for |
|------|--------|---------|
| React DevTools → Components | Browser extension | Props/state inspection, re-render detection |
| React DevTools → Profiler | Browser extension | Re-render count and timing |
| TanStack Query DevTools | `<ReactQueryDevtools />` in app | queryKey state, stale/fresh, fetch status |
| Network tab | Browser DevTools | API request URL, headers, status code, response body |
| Console | Browser DevTools | JS runtime errors, stack traces |
| Sources → Breakpoints | Browser DevTools | Step-through debugging |
| `pnpm typecheck` | Terminal | TypeScript errors without building |
| `pnpm build` | Terminal | Full build errors including unused imports |

---

## Severity Triage

| Severity | Symptom | First action |
|----------|---------|-------------|
| Critical | Blank screen / crash | Check console, find Error Boundary |
| High | Wrong data displayed | Trace API → query → props |
| High | API 401/403 | Check auth header + env vars |
| Medium | Stale data | Check queryKey + invalidation |
| Medium | Missing translation | Check translation.json + key path |
| Low | Layout broken | Check RTL properties + tokens |
| Low | Slow render | Check React Profiler + memoization |

---

## Forbidden Debug Practices

- Never add `console.log` and leave it — remove after diagnosis.
- Never use `// @ts-ignore` as a fix — it hides the real bug.
- Never fix a symptom without finding the root cause.
- Never change the API contract (`api/<name>Api.ts` exports) to work around a bug.
