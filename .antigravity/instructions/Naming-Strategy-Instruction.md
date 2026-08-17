# Naming Strategy Instruction

> **Version:** 1.0.0 | **Updated:** 2026-05-09

---

## General Naming Rule

> **All variables, files, and folders must use `camelCase` unless a specific exception applies below.**

---

## Variables & Constants

| Type | Convention | Example |
|------|------------|---------|
| Variables | `camelCase` | `userName`, `totalCount` |
| Functions | `camelCase` | `fetchUserData`, `handleSubmit` |
| Constants (non-exported) | `camelCase` | `maxRetries`, `defaultTimeout` |
| Exported constants | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `API_BASE_URL` |
| Boolean variables | `camelCase` with `is/has/can` prefix | `isLoading`, `hasError`, `canEdit` |
| Event handlers | `camelCase` with `handle` prefix | `handleClick`, `handleFormSubmit` |
| Async functions | `camelCase` | `fetchUsers`, `loadProfile` |

---

## TypeScript Types & Interfaces

| Type | Convention | Example |
|------|------------|---------|
| Interfaces | `PascalCase` | `UserProfile`, `ApiResponse` |
| Type aliases | `PascalCase` | `UserId`, `FilterOptions` |
| Enum names | `PascalCase` | `UserRole`, `Status` |
| Enum values | `UPPER_SNAKE_CASE` | `ADMIN`, `ACTIVE`, `NOT_FOUND` |
| Generic type params | Single `PascalCase` letter or word | `T`, `TData`, `TError` |

---

## Files

| File type | Convention | Example |
|-----------|------------|---------|
| All files (default) | `camelCase` | `userProfile.ts`, `apiClient.ts` |
| React components | `PascalCase` | `UserCard.tsx`, `LoginForm.tsx` |
| Hook files | `camelCase` with `use` prefix | `useUserModel.ts`, `useAuthStore.ts` |
| Store files | `camelCase` with `Store` suffix | `userStore.ts`, `authStore.ts` |
| API files | `camelCase` with `Api` suffix | `userApi.ts`, `authApi.ts` |
| Type files | `index.ts` (always) | `types/index.ts` |
| Utility/helper files | `camelCase` | `formatDate.ts`, `containsRichText.ts` |
| Config files | `camelCase` | `queryClient.ts`, `routeConfig.ts` |

---

## Folders

| Folder type | Convention | Example |
|-------------|------------|---------|
| All folders (default) | `camelCase` | `userProfile/`, `authFlow/` |
| FSD layer folders | `camelCase` | `pages/`, `widgets/`, `features/`, `entities/`, `shared-app/` |
| Slice folders | `camelCase` | `widgets/organizationalUnit/`, `features/userAuth/` |
| Sub-folders | `camelCase` | `ui/`, `models/`, `types/`, `api/`, `store/`, `logics/` |

---

## React Components

| Type | Convention | Example |
|------|------------|---------|
| Component name | `PascalCase` | `UserCard`, `LoginForm` |
| Component file | `PascalCase.tsx` | `UserCard.tsx`, `LoginForm.tsx` |
| Props interface | `PascalCase` + `Props` suffix | `UserCardProps`, `LoginFormProps` |

---

## Exceptions (Non-camelCase)

These are the **only** allowed deviations from camelCase:

| Case | Convention | Reason |
|------|------------|--------|
| React component files | `PascalCase` | JSX/React convention |
| React component names | `PascalCase` | JSX/React convention |
| Type & interface names | `PascalCase` | TypeScript convention |
| Exported constants | `UPPER_SNAKE_CASE` | Distinguish from variables |
| Enum values | `UPPER_SNAKE_CASE` | Distinguish from variables |

---

## Strict Rules (Never Violate)

| Rule | Description |
|------|-------------|
| No `snake_case` | Never use underscores in variable or file names (except `UPPER_SNAKE_CASE` constants) |
| No `kebab-case` | Never use hyphens in variable names or folder names |
| No `PascalCase` for folders | Folders must always be `camelCase` |
| No `PascalCase` for non-component files | Only `.tsx` React component files use `PascalCase` |
| No mixed casing | Never mix conventions within the same context |
| Boolean prefix required | All boolean variables must start with `is`, `has`, or `can` |
| Handler prefix required | All event handler functions must start with `handle` |
