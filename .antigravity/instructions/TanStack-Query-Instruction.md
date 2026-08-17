# TanStack Query Strategy Instruction

> **Version:** 1.0.0 | **Updated:** 2026-05-10
> **Library:** @tanstack/react-query v5

---

## Core Rule

> **Always use object signature for `useQuery`, `useMutation`, and `useInfiniteQuery`.**
> The positional/array signature is a v4 pattern and is forbidden.

---

## useQuery Pattern

```typescript
// features/<featureName>/models/use<FeatureName>.ts
import { useQuery } from "@tanstack/react-query";
import { entityApi } from "../api/entityApi";

// List query
export const useEntityList = (filters?: EntityFilters) =>
  useQuery({
    queryKey: ["entity", "list", filters],
    queryFn: () => entityApi.getAll(filters),
  });

// Single item query
export const useEntityById = (id: string) =>
  useQuery({
    queryKey: ["entity", "detail", id],
    queryFn: () => entityApi.getById(id),
    enabled: !!id,
  });
```

---

## useMutation Pattern

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { entityApi } from "../api/entityApi";

export const useCreateEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: entityApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entity"] });
    },
  });
};

export const useUpdateEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateEntityDto }) =>
      entityApi.update(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["entity"] });
      queryClient.invalidateQueries({ queryKey: ["entity", "detail", id] });
    },
  });
};

export const useDeleteEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => entityApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entity"] });
    },
  });
};
```

---

## queryKey Conventions

### Format

```
[slice, operation, ...params]
```

### Examples

| Query | queryKey |
|-------|----------|
| All users | `["user", "list"]` |
| Users with filters | `["user", "list", filters]` |
| Single user | `["user", "detail", id]` |
| User profile | `["user", "profile"]` |
| All roles | `["role", "list"]` |

### Invalidation Strategy

```typescript
// Invalidate all queries for a slice
queryClient.invalidateQueries({ queryKey: ["entity"] });

// Invalidate only list queries
queryClient.invalidateQueries({ queryKey: ["entity", "list"] });

// Invalidate a specific item
queryClient.invalidateQueries({ queryKey: ["entity", "detail", id] });
```

---

## Required UI States

Every component that consumes a query must handle all 4 states:

```tsx
const { data, isLoading, error, refetch } = useEntityList();

if (isLoading) return <Skeleton />;
if (error) return <ErrorPanel onRetry={refetch} />;
if (!data?.length) return <EmptyState />;
return <ActualContent data={data} />;
```

---

## Mutation in UI (via model)

```tsx
// UI file — no direct mutation logic
const { mutate: createEntity, isPending } = useCreateEntity();

const handleSubmit = () => {
  createEntity(formData, {
    onSuccess: () => onClose(),
    onError: (err) => showToast(err.message),
  });
};
```

---

## File Placement

| Layer | Path |
|-------|------|
| Widget model | `widgets/<pageName>/models/use<PageName>Model.ts` |
| Feature model | `features/<featureName>/models/use<FeatureName>.ts` |
| Entity model | `entities/<entityName>/models/use<EntityName>.ts` |

---

## Error Handling

```typescript
import { useQuery } from "@tanstack/react-query";

export const useEntityList = () =>
  useQuery({
    queryKey: ["entity", "list"],
    queryFn: () => entityApi.getAll(),
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
```

---

## Forbidden Patterns

```typescript
// ❌ v4 array signature
useQuery(["users"], fetchUsers);

// ❌ Separate queryFn argument
useQuery(["users", id], () => fetchUser(id), { enabled: !!id });

// ❌ Old mutation signature
useMutation(entityApi.create, { onSuccess: ... });

// ❌ Direct API call in queryFn without going through api/ file
useQuery({
  queryKey: ["users"],
  queryFn: () => get("/users"), // must use entityApi.getAll()
});

// ❌ queryFn in UI component
const MyComponent = () => {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: entityApi.getAll, // must be in models/ file
  });
};
```

---

## Summary Checklist

- [ ] Object signature used for all hooks
- [ ] queryKey format: `[slice, operation, ...params]`
- [ ] queryFn calls api/ file method (not direct get/post)
- [ ] All 4 UI states handled (loading, error, empty, data)
- [ ] Mutations invalidate correct queryKeys on success
- [ ] Model hook is in `models/` file — not inline in UI
- [ ] `enabled` used for conditional queries (`enabled: !!id`)
