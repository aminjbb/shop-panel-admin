---
name: accessibility
description: >-
  Applies WCAG-oriented accessibility and keyboard patterns for Dynova React UI
  (design-system components + Tailwind tokens, RTL). Use when the user mentions
  a11y, accessibility, screen reader, focus trap, aria, keyboard navigation, or
  WCAG.
---

# Accessibility (a11y) Skill

> **Context:** React 19 + project design system (`@/shared-app/designSystem/*`) + Tailwind token classes; app is **RTL**-aware. MUI icon components (e.g. `EditOutlined`) are used only as `icon` props inside design-system components — never as standalone form controls (see **Design-System-Catalog**).
> **Version:** 1.1.0 | **Updated:** 2026-07-01

---

## Non-negotiables

1. **Every interactive control** has an accessible name: visible label, `aria-label`, or `aria-labelledby` (design-system: `ETextField`/`ESelect` accept a `label` prop that wires `id`/`htmlFor` internally).
2. **Keyboard:** focus order follows visual order; no `tabIndex` traps except intentional focus management in modals/drawers.
3. **Color:** never rely on color alone for status — pair with text, icon, or `aria-live` where appropriate. Use design tokens only (see Design-Tokens skill).
4. **RTL:** use logical CSS (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`); do not hardcode left/right for layout that affects reading order.

---

## Focus and dialogs

- Opening a **Dialog/Modal**: move focus to the first focusable element or the dialog title region; on close, restore focus to the trigger.
- **Escape** closes modal surfaces unless product spec says otherwise; document exceptions in code comments only when required by UX.
- Avoid `autoFocus` on long forms unless it improves a single primary field; it can disorient screen reader users on page load.

---

## Live regions and async feedback

- After mutations (save, delete), ensure users hear/see feedback: use `useToastStore` (`@/shared-app/designSystem/toast/store`) with meaningful message text (via i18n from model, not hardcoded in UI) — never `alert()` or a custom toast.
- For inline loading on buttons, keep the **accessible name** stable; use `aria-busy="true"` on the control or region when loading state is purely visual.

---

## Tables and lists

- Data tables: `<th scope="col">` where applicable; row actions need discernible names (e.g. “Edit {name}” not only an icon).
- Decorative icons: `aria-hidden="true"` when adjacent text already conveys meaning.

---

## Testing a11y quickly

- Prefer **RTL queries**: `getByRole`, `getByLabelText`, `getByText` (user-visible strings from props).
- Tab through critical flows mentally (or with keyboard in browser): Tab / Shift+Tab, Enter / Space on buttons.

---

## Design-system-specific hints

- `ETextField` / `ENumberField`: pass `label` and `helperText`; for errors use the `error` prop so the message is associated with the field.
- Icon-only `EButton` (`size="icon"`, e.g. table row actions): always provide `aria-label` (translated string from model) since there is no visible text label.
- `ESelect`: ensure `label` is set so the control has an accessible name; expanded/collapsed state is handled internally.

---

## Cross-links

- **Design-System-Catalog:** required components and props for accessible names (`label`, `aria-label`, `helperText`).
- **Forms-validation:** field ownership (model owns state/validation, UI only renders design-system controls).
- **i18n:** visible strings and `aria-label` values must go through `t()` in **model** files, not UI (see project i18n rules).
- **FSD:** keep behavior and string assembly in `models/`; UI remains presentational.
