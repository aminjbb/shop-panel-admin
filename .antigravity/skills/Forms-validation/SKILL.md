---
name: forms-validation
description: >-
  Defines form structure, validation messaging, and design-system field
  patterns for Dynova FSD (models own state and i18n). Use when building or
  refactoring forms, validation, error messages, text fields, selects, or
  submit handlers.
---

# Forms & Validation Skill

> **UI library:** the project **design system** (`ETextField`, `ESelect`, `ENumberField`, `EDatePicker`, `ESwitch`, `ERadio`, `EButton` from `@/shared-app/designSystem/*`) is the **only** allowed form control set — see **Design-System-Catalog** skill. Raw MUI form controls (`TextField`, `Select`, `Switch`, `Radio`, native `<input>`/`<select>`) are forbidden per the FORBIDDEN table there.
> **Version:** 1.1.0 | **Updated:** 2026-07-01

---

## FSD ownership

| Concern | Layer |
|---------|--------|
| Field state, `onChange`, submit handler, API calls | `models/use*Model.ts` (or feature model) |
| Validation rules and error message **keys** | Model — resolve with `t('slice.form.validation.*')` |
| Pure parsers/formatters (dates, numbers) | `logics/` or small helpers in `shared-app` if reusable project-wide |
| JSX for inputs, labels, layout | `ui/*.tsx` — **no** `useTranslation`, **no** business rules |

---

## Validation messaging

- Use **interpolation** for dynamic parts: `t('slice.form.validation.minLength', { min: 8 })`.
- Required field default: align with project key `*.form.validation.required` pattern in `translation.json`.
- Show field-level errors via `ETextField`/`ESelect` `error` + `helperText` props fed from model state.

---

## Design-system field pattern (conceptual)

- One controlled value per field in model; pass `value`, `onValueChange`, `error`, `helperText`, `required`, `fullWidth` as props to `ETextField` / `ESelect` / `ENumberField`.
- For pickers, use `EDatePicker` (`@/shared-app/designSystem/datePicker`) — never native `<input type="date">` or raw MUI `DatePicker`. Keep the **canonical value** type consistent in the model; convert at API boundary if backend expects strings.
- Toggle/radio fields use `ESwitch` / `ERadio` — never native `<input type="checkbox">`/`<input type="radio">` or raw MUI equivalents.
- Group 2+ related fields into their own sub-component file in `ui/` per the **Component-Generator** Small Component Decomposition Rule (e.g. `PersonBasicInfo.tsx` for a name/email/role section) — see **Layout-Patterns** Pattern 5.

---

## API submit flow

- Submit handlers call slice `*Api` methods only (never inline `fetch`).
- On `ApiError`, map server fields to form errors in the model when the API returns structured validation; otherwise show a toast + generic message key.

---

## Optional schema libraries

This repo may not include `zod` or `react-hook-form`. If the team adds them:

- Schemas live next to types or in `models/` — not in UI files.
- Prefer a single submit validation path (schema or manual) per form; avoid duplicate rules.

---

## Anti-patterns

- Hardcoded Persian/English strings in `helperText` or button labels.
- Validating in UI components with `useState` local to JSX files.
- Bypassing `@/config/api` from submit logic.

---

## Cross-links

- **Design-System-Catalog:** the authoritative list of required form controls and forbidden native/MUI equivalents.
- **TanStack Query:** mutations for create/update; invalidate with slice prefix `queryKey` per project rules.
- **Design tokens:** no raw colors for error states — use token-backed classes/CSS variables (`var(--color-status-danger)`), never inline MUI theme colors.
