# Doc-Writer Skill

> **Version:** 1.0.0 | **Updated:** 2026-05-10

---

## Core Rule

> When the user says "Document this" or equivalent:
> **NEVER guess.** Always read all relevant files first, then generate documentation that strictly reflects the actual code.

---

## Trigger Phrases

This skill activates when the user says:

- "Document this"
- "Document `<path>`"
- "Write docs"
- "Add JSDoc"
- "Generate documentation"

---

## Required Workflow (always follow this order)

### Step 1: Identify the Target Scope

Determine what the user wants documented:

| User Intent | Scope |
|-------------|-------|
| A single file path | **File-level** — JSDoc only for that file |
| A feature/widget/entity name | **Slice-level** — JSDoc + `README.md` for the whole slice |
| "the project" / "everything" | **Project-level** — top-level `docs/PROJECT.md` |

---

### Step 2: Read ALL Relevant Files

**For File-level:**
- Read the target file only.

**For Slice-level:**
- Read every file in the slice folder:
  - `ui/<Name>.tsx` (root composer) **and every other `ui/*.tsx` sub-component file** in the same folder
  - `models/use<Name>Model.ts` (or `use<Name>.ts`)
  - `api/<name>Api.ts`
  - `types/index.ts`
  - `store/<name>Store.ts` (if exists)

**For Project-level:**
- Read `src/config/api.ts`
- Read `src/lib/i18n/locales/fa/translation.json`
- Read `src/index.css` (for available tokens)
- Glob all `pages/*.tsx` to list routes
- Glob all `widgets/*/`, `features/*/`, `entities/*/` to list slices

---

### Step 3: Generate Documentation by Type

---

## Output A: JSDoc for TypeScript Files

### Types (`types/index.ts`)

Add a JSDoc block above **every** exported interface and type:

```ts
/**
 * Represents a user in the system.
 */
export interface User {
  /** Unique identifier */
  id: string;
  /** Full display name */
  name: string;
  /** Whether the user account is active */
  isActive: boolean;
}

/**
 * Payload required to create a new user.
 */
export interface CreateUserDto {
  name: string;
  email: string;
}
```

Rules:
- Write descriptions in **English**.
- Each property must have an inline `/** ... */` comment.
- Describe **purpose**, not type — do NOT repeat the TypeScript type.

---

### API File (`api/<name>Api.ts`)

Add a JSDoc block above **every** method:

```ts
export const userApi = {
  /**
   * Fetches the full list of users.
   * @param query - Optional filters (page, size)
   * @returns Promise<User[]>
   */
  getAll: (query?: { page?: number; size?: number }) =>
    get<User[]>(BASE, { query }),

  /**
   * Fetches a single user by ID.
   * @param id - Unique user identifier
   * @returns Promise<User>
   */
  getById: (id: string) => get<User>(`${BASE}/${id}`),

  /**
   * Creates a new user.
   * @param body - User creation payload
   * @returns Promise<User>
   * @throws {ApiError} on non-2xx response
   */
  create: (body: CreateUserDto) =>
    post<User, CreateUserDto>(BASE, body),

  /**
   * Deletes a user by ID.
   * @param id - Unique user identifier
   * @returns Promise<void>
   */
  remove: (id: string) => del<void>(`${BASE}/${id}`),
};
```

Rules:
- Always include `@param` for every parameter.
- Always include `@returns` with the resolved type.
- Add `@throws {ApiError}` on mutation methods.

---

### Model Hook (`models/use<Name>Model.ts`)

Add a JSDoc block above the exported hook function:

```ts
/**
 * Model hook for the User Management page.
 *
 * Responsibilities:
 * - Fetches the user list from the API
 * - Manages search and filter state
 * - Provides translated labels to the UI component
 *
 * queryKey: ["user", "list", filters]
 *
 * @returns Data, loading states, and handlers consumed by the UI component
 */
export const useUserModel = () => {
  // ...
};
```

Add brief inline comments for complex logic only — do NOT comment obvious lines.

Rules:
- The hook-level JSDoc must list **what the hook does** as a bullet list under "Responsibilities".
- Always mention the `queryKey` used (if TanStack Query is involved).
- Do NOT document individual `useState` or `useCallback` calls unless the logic is non-obvious.

---

### UI Component — Root Composer (`ui/<Name>.tsx`)

Add a JSDoc block above the exported component. If the slice has sub-components, list them:

```tsx
/**
 * User Management page — root composer, purely presentational.
 *
 * Composes:
 * - `UserToolbar` — search and add-new action
 * - `UserTable` — loading/error/empty/data states + row actions
 *
 * All data and handlers are received from `useUserModel`.
 * This component contains no state, no effects, and no direct API calls.
 */
export const User = () => {
  // ...
};
```

### UI Component — Sub-component (`ui/<SectionName>.tsx`)

Add a JSDoc block above each sub-component, noting which composer renders it:

```tsx
/**
 * Search bar and add-new action for the User Management page.
 * Rendered by `User` (root composer) — receives all data via props.
 */
const UserToolbar = (props: UserToolbarProps) => {
  // ...
};
```

Rules:
- Always state that the component is "purely presentational".
- Root composer JSDoc must list every sub-component it renders.
- Sub-component JSDoc must name the parent composer that renders it.
- Always name the model hook the root composer consumes.
- Do NOT add inline comments inside JSX returns.

---

## Output B: `README.md` for Slice

When scope is **Slice-level**, create (or overwrite) a `README.md` inside the slice folder.

**Path:** `widgets/<name>/README.md` | `features/<name>/README.md` | `entities/<name>/README.md`

**Template:**

```markdown
# <SliceName>

> **Layer:** widget | feature | entity
> **Updated:** <today's date>

## Purpose

<One short paragraph describing what this slice is responsible for.>

## File Structure

```
<sliceName>/
├── ui/
│   ├── <Name>.tsx          # Root composer — pure presentational, no logic
│   └── <SectionName>.tsx   # Sub-component (repeat per section; list all that exist)
├── models/
│   └── use<Name>Model.ts   # All state, hooks, and handlers
├── api/
│   └── <name>Api.ts        # All API calls
└── types/
    └── index.ts            # All TypeScript types
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getAll` | `GET /endpoint` | Fetch all items |
| `getById` | `GET /endpoint/:id` | Fetch a single item |
| `create` | `POST /endpoint` | Create a new item |
| `remove` | `DELETE /endpoint/:id` | Delete an item |

## Query Keys

| Hook | queryKey |
|------|----------|
| List | `["<slice>", "list"]` |
| Detail | `["<slice>", "detail", id]` |

## Translation Keys

i18n keys used in this slice:

```
<slice>.title
<slice>.table.name
<slice>.status.active
<slice>.form.fields.<field>.label
```

## Usage

```tsx
import { <Name> } from "@/widgets/<name>/ui/<Name>";

// In pages/<Name>.tsx
const <Name>Page = () => <Name />;
```

## Dependencies

- Layer: `widgets` → depends on `features/<...>` and `entities/<...>`
- shadcn/ui components used: `<Button>`, `<Table>`, ...
```

Rules:
- Fill in **only** what actually exists in the code — do NOT invent endpoints or keys.
- If a section has no data (e.g. no store file), omit that section entirely.
- The "Usage" section must show the real import path.

---

## Output C: `docs/PROJECT.md` (Project-level)

When scope is **Project-level**, create or update `docs/PROJECT.md`.

**Sections to generate:**

```markdown
# Dynova Frontend — Project Documentation

> **Stack:** React + TypeScript + Tailwind v4 + shadcn/ui + TanStack Query v5
> **Architecture:** Feature-Sliced Design (FSD)
> **Updated:** <today's date>

## Pages (Routes)

| Page | Route | Widget |
|------|-------|--------|
| <PageName> | `/route` | `widgets/<name>` |

## Widgets

| Widget | Purpose | Depends on |
|--------|---------|------------|

## Features

| Feature | Purpose | API Endpoint |
|---------|---------|-------------|

## Entities

| Entity | Purpose | API Endpoint |
|--------|---------|-------------|

## Design Tokens

| Category | Main Tokens |
|----------|-------------|
| Background | `--color-bg-default`, `--color-bg-elevated`, ... |
| Text | `--color-text-default`, `--color-text-subtle`, ... |
| Interactive | `--color-interactive-default`, ... |
| Status | `--color-status-success`, `--color-status-danger`, ... |

## Naming Conventions

| Target | Convention | Example |
|--------|------------|---------|
| Page file | `PascalCase.tsx` | `UserList.tsx` |
| Widget folder | `camelCase` | `userList/` |
| Model hook | `use<Name>Model.ts` | `useUserListModel.ts` |
| API file | `<name>Api.ts` | `userApi.ts` |
| Types file | `index.ts` | `types/index.ts` |
```

---

## Audit Checklist

Before finalizing, confirm:

- [ ] All JSDoc blocks are written in English
- [ ] Every exported function/interface has a JSDoc block
- [ ] `@param` and `@returns` present on all API methods
- [ ] `@throws {ApiError}` added to mutation methods
- [ ] Model hook JSDoc includes the queryKey (if applicable)
- [ ] Root composer JSDoc lists every sub-component it renders; each sub-component JSDoc names its parent
- [ ] `README.md` File Structure lists every `ui/*.tsx` file that actually exists, not just the root
- [ ] `README.md` contains only real data (no invented endpoints or keys)
- [ ] `README.md` translation keys match actual `t('...')` calls in the model file
- [ ] Project-level doc lists all pages found in `pages/` folder

---

## Constraints

- **Never invent** endpoints, types, or translation keys — read the actual files
- **Never add** comments inside JSX returns
- **Never document** obvious lines (`// increment counter`, `// return data`)
- **Keep JSDoc concise** — prefer bullet points over paragraphs
- If the file **already has complete JSDoc**, output "Already documented" and stop
