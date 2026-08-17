# API Layer Skill

> **Source of truth:** `src/config/api.ts`
> **Version:** 1.0.0 | **Updated:** 2026-05-10

---

## Core Rule

> **All API calls must use only the methods exported from `src/config/api.ts`.**
> Never use `fetch`, `axios`, or any other HTTP client directly.

---

## Available Methods

| Method | Signature | Use for |
|--------|-----------|---------|
| `get` | `get<T>(path, options?)` | Fetch / read data |
| `post` | `post<T, B>(path, body?, options?)` | Create a resource |
| `put` | `put<T, B>(path, body?, options?)` | Full update |
| `patch` | `patch<T, B>(path, body?, options?)` | Partial update |
| `del` | `del<T>(path, options?)` | Delete a resource |
| `apiRequest` | `apiRequest<T>(path, options)` | Custom / advanced calls |

All methods:
- Automatically attach `Authorization: Bearer <token>` header (skip with `withAuth: false`)
- Accept optional `query` object for URL query parameters
- Accept optional `signal` for request cancellation (`AbortController`)
- Throw a structured `ApiError` on non-2xx responses

---

## Import

```typescript
import { get, post, put, patch, del } from "@/config/api";
```

---

## File Placement

API files must live only in the `api/` sub-folder of the corresponding FSD slice:

```
features/<featureName>/api/<featureName>Api.ts
entities/<entityName>/api/<entityName>Api.ts
```

### Naming Rule
- File name: `<sliceName>Api.ts` (camelCase + `Api` suffix)
- Export: a single named object `<sliceName>Api`

---

## Entity API Template

```typescript
// entities/<entityName>/api/<entityName>Api.ts
import { get, post, put, del } from "@/config/api";
import type { <Entity>, Create<Entity>Dto, Update<Entity>Dto } from "../types";

const BASE = "/<entity-path>";

export const <entityName>Api = {
  getAll: (query?: { page?: number; size?: number }) =>
    get<<Entity>[]>(BASE, { query }),

  getById: (id: string) =>
    get<<Entity>>(`${BASE}/${id}`),

  create: (body: Create<Entity>Dto) =>
    post<<Entity>, Create<Entity>Dto>(BASE, body),

  update: (id: string, body: Update<Entity>Dto) =>
    put<<Entity>, Update<Entity>Dto>(`${BASE}/${id}`, body),

  remove: (id: string) =>
    del<void>(`${BASE}/${id}`),
};
```

---

## Feature API Template

```typescript
// features/<featureName>/api/<featureName>Api.ts
import { post, get } from "@/config/api";
import type { <RequestDto>, <ResponseType> } from "../types";

const BASE = "/<feature-path>";

export const <featureName>Api = {
  action: (body: <RequestDto>) =>
    post<<ResponseType>, <RequestDto>>(`${BASE}/action`, body),

  getData: () =>
    get<<ResponseType>>(BASE),
};
```

---

## Query Parameters

```typescript
export const productApi = {
  search: (filters: { keyword?: string; page?: number }) =>
    get<Product[]>("/products", {
      query: {
        keyword: filters.keyword,
        page: filters.page,
      },
    }),
};
```

---

## Request Cancellation

```typescript
export const reportApi = {
  generate: (id: string, signal: AbortSignal) =>
    get<Report>(`/reports/${id}`, { signal }),
};
```

---

## Skip Auth (Public Endpoints)

```typescript
export const publicApi = {
  getCountries: () =>
    get<Country[]>("/countries", { withAuth: false }),
};
```

---

## File Upload

```typescript
export const mediaApi = {
  upload: (formData: FormData) =>
    post<UploadedFile, FormData>("/media/upload", formData),
};
```

---

## Wiring to TanStack Query v5 (in `models/`)

```typescript
// features/<featureName>/models/use<FeatureName>.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { <featureName>Api } from "../api/<featureName>Api";

export const use<FeatureName>List = () =>
  useQuery({
    queryKey: ["<featureName>", "list"],
    queryFn: () => <featureName>Api.getAll(),
  });

export const useCreate<FeatureName> = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: <featureName>Api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["<featureName>"] });
    },
  });
};
```

> **TanStack Query v5 Rule:** Always use object signature. Never use the old array/positional signature.

---

## Audit Checklist

When reviewing API code, check:

- [ ] Import is from `@/config/api` only
- [ ] API file is inside `api/` sub-folder of the slice
- [ ] File is named `<sliceName>Api.ts`
- [ ] Exports a single named object `<sliceName>Api`
- [ ] No API calls in `ui/` files
- [ ] No API calls in `models/` files
- [ ] No API calls in `store/` files
- [ ] Types for request/response are in `types/index.ts`
- [ ] Query params passed via `query` option (not string interpolation)
- [ ] TanStack Query uses object signature (v5 pattern)

---

## Forbidden Patterns

```typescript
// ❌ Direct fetch
const res = await fetch("/api/users");

// ❌ Axios
const res = await axios.get("/users");

// ❌ API call inside UI component
const MyComponent = () => {
  useEffect(() => { get("/users"); }, []);
};

// ❌ API call inside models/
export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: () => get("/users"), // ← must be in api/ file
  });

// ❌ Old TanStack Query v4 pattern
useQuery(["users"], fetchUsers);
```
