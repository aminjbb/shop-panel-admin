---
name: performance
description: >-
  Frontend performance debugging and optimization for Dynova. Covers re-render
  detection, bundle analysis, lazy loading, memoization, TanStack Query tuning,
  and Core Web Vitals. Use when UI is slow, bundle is large, or React DevTools
  Profiler shows excessive re-renders.
---

# Performance Skill

> **Stack:** React 18 + Vite + TanStack Query v5
> **Version:** 1.0.0 | **Updated:** 2026-06-30

---

## When to use this skill

- UI feels sluggish or unresponsive
- Page takes too long to load initially
- React DevTools Profiler shows excessive re-renders
- Bundle size is larger than expected
- `pnpm build` output shows large chunks

---

## Step 1 — Profile Before Optimizing

**Never optimize without measuring.** Always profile first.

### React DevTools Profiler

1. Install React DevTools browser extension
2. Open DevTools → Profiler tab
3. Click "Record" → interact with the slow UI → stop recording
4. Look for:
   - Components rendering too often (high render count)
   - Components with long render duration (> 16ms = drops a frame)
   - Renders triggered by parent when child didn't need to re-render

### Vite Bundle Analysis

```bash
pnpm add -D rollup-plugin-visualizer
```

In `vite.config.ts`:
```typescript
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true, gzipSize: true, brotliSize: true }),
  ],
});
```

Run: `pnpm build` → opens `stats.html` in browser showing bundle composition.

---

## Step 2 — Fix Re-renders

### Pattern: Parent re-render triggers unnecessary child re-render

```tsx
// ❌ New object created on every parent render → child always re-renders
<PersonCard person={{ id: 1, name: "Ali" }} />

// ✅ Stable reference
const person = useMemo(() => ({ id: 1, name: "Ali" }), []);
<PersonCard person={person} />
```

### Pattern: Memoize expensive components

```tsx
import { memo } from "react";

// ❌ Re-renders on every parent render even when props didn't change
const PersonRow = (props: PersonRowProps) => { ... };

// ✅ Only re-renders when props change
const PersonRow = memo((props: PersonRowProps) => { ... });
```

### Pattern: Memoize expensive calculations

```tsx
// ❌ Recalculated on every render
const sorted = persons.sort((a, b) => a.name.localeCompare(b.name));

// ✅ Only recalculated when persons changes
const sorted = useMemo(
  () => [...persons].sort((a, b) => a.name.localeCompare(b.name)),
  [persons]
);
```

### Pattern: Stable callback references

```tsx
// ❌ New function on every render → breaks memo on children
const handleDelete = (id: string) => deleteApi(id);

// ✅ Stable reference
const handleDelete = useCallback((id: string) => deleteApi(id), [deleteApi]);
```

> **Warning:** Do not blindly add `useMemo`/`useCallback` everywhere. They have overhead. Add only when profiler confirms it's needed.

---

## Step 3 — Code Splitting / Lazy Loading

All page components in this project should be lazy-loaded via the router.

Check `src/app/router.tsx`:
```tsx
// ✅ Correct — lazy loaded pages
const PersonList = lazy(() => import("@/pages/personList"));
const PersonSingle = lazy(() => import("@/pages/personSingle"));

// ❌ Eagerly imported — increases initial bundle
import PersonList from "@/pages/personList";
```

For heavy feature components inside a page:
```tsx
const HeavyChart = lazy(() => import("@/features/analytics/ui/HeavyChart"));

// Wrap with Suspense
<Suspense fallback={<Skeleton />}>
  <HeavyChart />
</Suspense>
```

---

## Step 4 — TanStack Query Performance Tuning

### Reduce unnecessary refetches

```typescript
useQuery({
  queryKey: ["person", "list"],
  queryFn: personApi.getAll,
  staleTime: 60_000,           // data is "fresh" for 1 minute — no refetch
  refetchOnWindowFocus: false,  // don't refetch when user returns to tab
  refetchOnReconnect: false,    // don't refetch on network reconnect (for static data)
});
```

### Prefetch for anticipated navigation

```typescript
// In the list page model — prefetch detail before user clicks
const queryClient = useQueryClient();

const handleRowHover = (id: string) => {
  queryClient.prefetchQuery({
    queryKey: ["person", "detail", id],
    queryFn: () => personApi.getById(id),
    staleTime: 30_000,
  });
};
```

### Select to avoid unnecessary re-renders

```typescript
// ❌ Component re-renders when ANY field changes
const { data } = useQuery({ queryKey: ["person", "list"], queryFn: personApi.getAll });
const names = data?.map(p => p.name);

// ✅ Component only re-renders when names change (select transforms before comparison)
const { data: names } = useQuery({
  queryKey: ["person", "list"],
  queryFn: personApi.getAll,
  select: (data) => data.map(p => p.name),
});
```

---

## Step 5 — Image and Asset Optimization

```tsx
// ❌ Unoptimized large image
<img src="/images/hero.png" />

// ✅ With width/height to prevent layout shift (CLS)
<img src="/images/hero.png" width={800} height={400} loading="lazy" />
```

For SVG icons — import as React components (Vite handles this):
```tsx
import { ReactComponent as Logo } from "@/assets/logo.svg";
// Or with vite-plugin-svgr:
import Logo from "@/assets/logo.svg?react";
```

---

## Step 6 — Large Dependency Detection

In bundle visualizer, watch for:
- `moment.js` → replace with `date-fns` (tree-shakeable)
- `lodash` → use `lodash-es` for tree-shaking, or replace with native JS
- Duplicate packages (two versions of same lib)
- Entire icon libraries imported (import only used icons)

```typescript
// ❌ Imports entire icon library
import * as Icons from "lucide-react";

// ✅ Import only what you use
import { ChevronDown, Search, X } from "lucide-react";
```

---

## Performance Checklist

```
Re-renders
[ ] React DevTools Profiler run — slow components identified
[ ] memo() applied to components that re-render without prop changes
[ ] useMemo() applied to expensive computations (with profiler evidence)
[ ] useCallback() applied to handlers passed as props to memoized children
[ ] No new object/array literals created in JSX render (use useMemo)

Bundle Size
[ ] pnpm build output checked — no chunk > 500KB (warning)
[ ] All pages lazy-loaded via React.lazy() in router.tsx
[ ] No eager page imports in router
[ ] Heavy features wrapped in Suspense + lazy()
[ ] Lucide/icon imports are named (not namespace)

TanStack Query
[ ] staleTime set for stable/slow-changing data
[ ] refetchOnWindowFocus disabled for non-realtime screens
[ ] select() used where only partial data is needed
[ ] prefetchQuery used for anticipated navigation

Assets
[ ] Images have width/height set
[ ] Images use loading="lazy" where above-fold is not needed
[ ] SVGs imported as React components (not as <img>)
```
