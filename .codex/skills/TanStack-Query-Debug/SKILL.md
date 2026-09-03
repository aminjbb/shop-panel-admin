---
name: tanstack-query-debug
description: >-
  Diagnoses and fixes TanStack Query v5 issues: stale data, wrong queryKeys,
  missing invalidation, race conditions, DevTools setup. Use when data is not
  loading, not refreshing, or mutations are not reflecting in the UI.
---

# TanStack Query Debug Skill

> **Stack:** TanStack Query v5 + React
> **Version:** 1.0.0 | **Updated:** 2026-06-30

---

## When to use this skill

- Data is not loading (infinite loading state)
- Data is stale — not refreshing after mutation
- `useQuery` returns `undefined` unexpectedly
- `useMutation` succeeds but UI doesn't update
- Duplicate or conflicting queryKeys
- `enabled` guard not working
- DevTools not showing queries

---

## Step 1 — Enable ReactQueryDevtools

Before debugging any query issue, verify DevTools are active.

Check `src/app/providers/` or main `App.tsx`:

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Inside the QueryClientProvider tree:
<ReactQueryDevtools initialIsOpen={false} />
```

If not present, add it. DevTools show:
- All active queryKeys
- Fetch status (fetching / stale / fresh / paused)
- Last fetch time and data snapshot
- Error details

---

## Step 2 — Diagnose by Symptom

### Symptom: Infinite loading, `isLoading` never becomes false

**Checklist:**
```
[ ] Is queryFn returning a Promise? (must be async or return Promise)
[ ] Does the API file method use get/post from @/config/api?
[ ] Is there a network error? (check Network tab)
[ ] Is `enabled` set to false accidentally? (e.g. enabled: !!id where id is always falsy)
[ ] Is the QueryClient configured with staleTime: Infinity?
```

**Common fix:**
```typescript
// ❌ queryFn not returning a promise
queryFn: () => { personApi.getById(id) } // missing return

// ✅
queryFn: () => personApi.getById(id)
```

---

### Symptom: Data not updating after mutation

**Root cause:** queryKey mismatch between query registration and invalidation.

```typescript
// Query registered with:
queryKey: ["person", "list", filters]

// ❌ Invalidation targeting wrong key
queryClient.invalidateQueries({ queryKey: ["persons"] }); // typo
queryClient.invalidateQueries({ queryKey: ["person", "list", filters] }); // too specific

// ✅ Invalidate the slice prefix — covers all "person" queries
queryClient.invalidateQueries({ queryKey: ["person"] });
```

**Checklist:**
```
[ ] Does invalidateQueries use only the slice prefix?
[ ] Is invalidateQueries called inside onSuccess?
[ ] Is the QueryClient the same instance? (not a new one per component)
[ ] Is the mutation using useMutation from @tanstack/react-query (v5)?
```

---

### Symptom: `useQuery` runs but `enabled` guard doesn't work

```typescript
// ❌ enabled check is wrong type
const id = ""; // empty string — truthy? No, falsy
enabled: !!id  // ✅ converts to boolean correctly

// ❌ enabled depends on object that is always defined
const filters = {}; // always truthy
enabled: !!filters  // always true — never guarded

// ✅ Guard on the actual required field
enabled: !!filters.personId
```

---

### Symptom: Same data fetched multiple times (duplicate requests)

**Cause:** Multiple components sharing the same queryKey each mount and trigger a fetch.

**Fix options:**
```typescript
// Option 1: Increase staleTime so data is reused
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000 }, // 30 seconds fresh
  },
});

// Option 2: Use select to transform data without extra fetch
useQuery({
  queryKey: ["person", "list"],
  queryFn: personApi.getAll,
  select: (data) => data.filter((p) => p.isActive),
});
```

---

### Symptom: Query works in dev but fails after hard refresh

**Cause:** Query depends on auth token that hasn't loaded yet.

```typescript
// ❌ No guard — runs before token is available
useQuery({
  queryKey: ["person", "list"],
  queryFn: personApi.getAll,
});

// ✅ Guard with auth state
const { isAuthenticated } = useAuth();
useQuery({
  queryKey: ["person", "list"],
  queryFn: personApi.getAll,
  enabled: isAuthenticated,
});
```

---

### Symptom: `useMutation` `onSuccess` not called

**Checklist:**
```
[ ] Is mutationFn returning a Promise?
[ ] Does the API call throw on error? (ApiError from @/config/api does this automatically)
[ ] Is there a try/catch inside mutationFn that swallows the error?
```

```typescript
// ❌ mutationFn catches error and returns undefined — onSuccess fires with undefined
mutationFn: async (data) => {
  try {
    return await personApi.create(data);
  } catch (e) {
    console.error(e); // swallowed — onSuccess fires but data is undefined
  }
}

// ✅ Let errors propagate — useMutation handles them via onError
mutationFn: (data) => personApi.create(data),
onError: (error) => { /* handle */ },
```

---

## queryKey Convention Reference

| Query | queryKey |
|-------|----------|
| All persons | `["person", "list"]` |
| Persons with filters | `["person", "list", filters]` |
| Single person | `["person", "detail", id]` |
| Invalidate all person queries | `{ queryKey: ["person"] }` |

Always use **slice prefix only** for invalidation.

---

## Query Config Cheat Sheet

```typescript
useQuery({
  queryKey: ["entity", "list", filters],
  queryFn: () => entityApi.getAll(filters),
  enabled: !!filters.required,        // conditional guard
  staleTime: 30_000,                  // 30s before refetch
  gcTime: 5 * 60 * 1000,             // 5min cache after unmount (v5: gcTime not cacheTime)
  retry: 1,                           // retry once on failure
  refetchOnWindowFocus: false,        // disable for forms/detail pages
});
```

---

## Audit Checklist

```
TanStack Query v5 Compliance
[ ] Object signature used (not array/positional — v4 pattern is forbidden)
[ ] queryFn calls api/ file method — not get()/post() directly
[ ] enabled guard present when id or param can be undefined
[ ] All 4 UI states handled (isLoading, error, empty, data)
[ ] Mutation invalidates queryKey on onSuccess
[ ] invalidateQueries uses slice prefix only
[ ] No shared mutable QueryClient across components
[ ] gcTime used (not deprecated cacheTime)
[ ] ReactQueryDevtools present in app providers
```

---

## Forbidden Patterns

```typescript
// ❌ v4 array signature
useQuery(["users"], fetchUsers);
useQuery(["users", id], () => fetchUser(id), { enabled: !!id });

// ❌ Separate queryFn argument
useMutation(entityApi.create, { onSuccess: ... });

// ❌ Direct API call inside queryFn (not via api/ file)
useQuery({
  queryKey: ["user"],
  queryFn: () => get("/users"), // must be userApi.getAll()
});

// ❌ Over-specific invalidation
queryClient.invalidateQueries({ queryKey: ["person", "list", { page: 1 }] });

// ❌ Missing enabled guard
useQuery({ queryKey: ["person", id], queryFn: () => personApi.getById(id) });
// id could be undefined — will call API with undefined
```
