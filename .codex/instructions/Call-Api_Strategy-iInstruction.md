# Call API Strategy Instruction

> **Version:** 1.0.0 | **Updated:** 2026-05-10

---

## Core Rule

> **All API calls must use only the methods exported from `src/config/api.ts`.**
> Never use `fetch`, `axios`, or any other HTTP client directly in feature/entity/widget code.

---

## Available Methods (`src/config/api.ts`)

| Method | Signature | Use for |
|--------|-----------|---------|
| `get` | `get<T>(path, options?)` | Fetch / read data |
| `post` | `post<T, B>(path, body?, options?)` | Create a resource |
| `put` | `put<T, B>(path, body?, options?)` | Full update |
| `patch` | `patch<T, B>(path, body?, options?)` | Partial update |
| `del` | `del<T>(path, options?)` | Delete a resource |
| `apiRequest` | `apiRequest<T>(path, options)` | Custom / advanced calls |

All methods:
- Automatically attach the `Authorization: Bearer <token>` header (set `withAuth: false` to skip).
- Accept an optional `query` object for URL query parameters.
- Accept an optional `signal` for request cancellation (AbortController).
- Throw a structured `ApiError` on non-2xx responses.

---

## Import

Always import from the config path:

```typescript
import { get, post, put, patch, del } from "@/config/api";
```

---

## File Placement Rules

API files must be placed **only** in the `api/` sub-folder of the corresponding FSD layer slice.

```
features/
└── <featureName>/
    └── api/
        └── <featureName>Api.ts      ← All API calls for this feature

entities/
└── <entityName>/
    └── api/
        └── <entityName>Api.ts       ← All API calls for this entity
```

### Strict Rules
- No API calls in `ui/` files.
- No API calls in `models/` files.
- No API calls in `store/` files.
- All API calls for a slice live in a **single** `api/` file.

---

## Entity API Example

**Path:** `entities/user/api/userApi.ts`

```typescript
import { get, post, put, del } from "@/config/api";
import type { User, CreateUserDto, UpdateUserDto } from "../types";

const BASE = "/users";

export const userApi = {
  getAll: (query?: { page?: number; size?: number }) =>
    get<User[]>(BASE, { query }),

  getById: (id: string) =>
    get<User>(`${BASE}/${id}`),

  create: (body: CreateUserDto) =>
    post<User, CreateUserDto>(BASE, body),

  update: (id: string, body: UpdateUserDto) =>
    put<User, UpdateUserDto>(`${BASE}/${id}`, body),

  remove: (id: string) =>
    del<void>(`${BASE}/${id}`),
};
```

---

## Feature API Example

**Path:** `features/userAuth/api/userAuthApi.ts`

```typescript
import { post, get } from "@/config/api";
import type { LoginDto, AuthTokens, RefreshDto } from "../types";

const BASE = "/auth";

export const userAuthApi = {
  login: (body: LoginDto) =>
    post<AuthTokens, LoginDto>(`${BASE}/login`, body),

  logout: () =>
    post<void>(`${BASE}/logout`),

  refreshToken: (body: RefreshDto) =>
    post<AuthTokens, RefreshDto>(`${BASE}/refresh`, body),

  getProfile: () =>
    get<AuthTokens>(`${BASE}/profile`),
};
```

---

## Query Parameters Example

Use the `query` option to pass URL search params:

```typescript
export const productApi = {
  search: (filters: { keyword?: string; category?: string; page?: number }) =>
    get<Product[]>("/products", {
      query: {
        keyword: filters.keyword,
        category: filters.category,
        page: filters.page,
      },
    }),
};
```

This produces: `GET /products?keyword=...&category=...&page=...`

---

## Request Cancellation Example

Use `AbortController` with the `signal` option:

```typescript
export const reportApi = {
  generate: (id: string, signal: AbortSignal) =>
    get<Report>(`/reports/${id}`, { signal }),
};
```

---

## Skipping Auth Example

For public endpoints that do not need a Bearer token:

```typescript
export const publicApi = {
  getCountries: () =>
    get<Country[]>("/countries", { withAuth: false }),
};
```

---

## File Upload Example

Pass a `FormData` body — `Content-Type` is set automatically (not `application/json`):

```typescript
export const mediaApi = {
  upload: (formData: FormData) =>
    post<UploadedFile, FormData>("/media/upload", formData),
};
```

---

## Using API in Models (TanStack Query v5)

Import the API object inside the `models/` file and wire it to TanStack Query:

```typescript
// features/userAuth/models/useUserAuth.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userAuthApi } from "../api/userAuthApi";

export const useUserProfile = () =>
  useQuery({
    queryKey: ["auth", "profile"],
    queryFn: () => userAuthApi.getProfile(),
  });

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userAuthApi.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};
```

---

## Forbidden Patterns

```typescript
// ❌ Direct fetch — forbidden
const res = await fetch("/api/users");

// ❌ Axios — forbidden
const res = await axios.get("/users");

// ❌ API call inside UI component — forbidden
const MyComponent = () => {
  useEffect(() => { get("/users"); }, []);
};

// ❌ API call inside models/ — forbidden
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => get("/users"), // move this to api/ file
  });
};
```

---

## Summary Checklist

- [ ] Import only from `@/config/api`
- [ ] API file is inside `api/` sub-folder of the slice
- [ ] File named `<sliceName>Api.ts` (camelCase)
- [ ] No API calls in UI, models, or store
- [ ] Types for request/response bodies are in `types/index.ts`
- [ ] Query params passed via `query` option (not string interpolation)
- [ ] Mutations wired in `models/` via TanStack Query `useMutation`
