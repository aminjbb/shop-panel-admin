# Data-Driven UI States Strategy Instruction

> **Version:** 1.0.0 | **Updated:** 2026-05-11
> **Related:** `TanStack-Query-Instruction.md`, `shared-app/dynamicTable/`

---

## Core rule

> **Every screen or section backed by async data must explicitly handle four states:** loading, error, empty, and success (data rendered).

---

## State mapping

| State | User experience |
|-------|------------------|
| **Loading** | Skeleton, table skeleton rows, or scoped spinner — avoid layout jump when possible |
| **Error** | Error panel or inline alert + **retry** (`refetch` or action handler) |
| **Empty** | Dedicated empty state (copy + optional CTA), not a blank table |
| **Success** | Real content (table, cards, detail) |

Order in code: resolve `isLoading` → `isError` → empty data → render data.

---

## Lists & tables

- For `DynamicTable` and similar: parent owns pagination/query; pass **already-fetched** `data` when possible. Use `emptyMessage` (or equivalent) with an **i18n** string from the model for the empty state.
- While loading, either **do not mount** the table until first success, or show a **skeleton** table with the same column layout.

---

## Mutations

- Loading: disable primary actions or show **inline** pending state on the triggering control.
- Error: show field-level or toast feedback per `Error-Handling-User-Feedback-Instruction.md`.
- Success: close dialogs / invalidate lists as required; optional brief success feedback if specified by UX.

---

## Anti-patterns

- Rendering only `data` without guarding `undefined`/pending — causes flash or runtime errors.
- Using **empty** state when the query **failed** (must show error + retry).
- Hardcoded empty-state copy in JSX.
