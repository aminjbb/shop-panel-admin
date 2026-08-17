# Error Handling & User Feedback Strategy Instruction

> **Version:** 1.0.0 | **Updated:** 2026-05-11
> **Sources:** `src/config/api.ts`, shared toast/alert components under `src/shared-app/`

---

## Core rule

> **Distinguish three channels:** inline field errors (forms), **query/mutation errors** (TanStack), and **global/transient feedback** (toast/snackbar). Do not mix them for the same failure without a product reason.

---

## HTTP & `apiRequest`

- All HTTP goes through `src/config/api.ts` (`get`, `post`, `put`, `patch`, `del`, `apiRequest`).
- On non-OK responses, the client **rejects** a value derived from the response (JSON body, text, or `{ status, message }`). It is **not** guaranteed to be an `Error` instance — use narrow checks (`typeof`, `status`, shape) when typing `unknown`.
- **401 / 403:** `apiRequest` triggers Keycloak logout — do not duplicate logout in every caller; handle UX only where you need a specific message before redirect.

---

## TanStack Query — reads (`useQuery`)

- Surface failures in the **widget/feature UI** via the query result: `isError`, `error`, `refetch`.
- Prefer a dedicated **error panel** with **retry** (`refetch`) for list/detail views — not only a toast.
- User-visible error copy must come from **i18n** in the model (or a small mapper in the model), not hardcoded JSX.

---

## TanStack Query — writes (`useMutation`)

- Use `onError` for mutations when the user needs acknowledgment beyond inline validation (network, conflict, permission).
- Map server payloads to **field errors** when the API returns per-field messages; otherwise show a **single** toast/snackbar or inline alert.
- On success, prefer `invalidateQueries` + optional short **success** feedback if product requires it (same i18n rules).

---

## Toasts & alerts

- Reuse existing **design-system** pieces under `src/shared-app/designSystem/` (e.g. toast variants) when showing transient messages.
- Toast/alert **text** is translated via `t(...)` in **model/logic** layers, passed as props — same rule as other UI strings.
- Do not introduce a second ad-hoc notification system in a feature unless aligning with app root providers.

---

## Forms vs global errors

| Situation | Where to show |
|-----------|----------------|
| Invalid field value before submit | `helperText` / MUI `error` from model state |
| Submit rejected with field map | Map to fields + optional summary |
| Submit rejected without field map | Toast or alert + generic keyed message |
| Failed load of a page section | Error panel + retry in that section |

---

## Anti-patterns

- Swallowing errors (`catch` with no user feedback) on user-initiated actions.
- Duplicating `fetch` error handling outside `api.ts`.
- Hardcoded Persian/English error strings in UI components.
