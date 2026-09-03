# Routing Strategy Instruction

> **Version:** 1.0.0 | **Updated:** 2026-05-11
> **Source:** `src/app/router.tsx`, `src/pages/`

---

## Core rule

> **Route definitions live in `src/app/router.tsx`.** Page components live under `src/pages/` and should stay thin: compose the matching **widget** for the route, not business logic.

---

## URL paths

- Use **kebab-case** path segments consistent with existing routes (e.g. `/organizational-unit`, `/tenants`, `/tenants/create`).
- Prefer **one canonical path** per screen; if aliases are required (e.g. `/person` and `/persons`), document them in the router and keep breadcrumb `handle` in sync.

---

## Files & imports

- **Page file:** `src/pages/<RouteSegment>/index.tsx` or nested folders for nested URLs (e.g. `pages/tenant/create/index.tsx`).
- Default export: a component that renders the widget entry (naming should match the page purpose).
- Import direction: `pages` → `widgets` (and below) only — never import a page into a widget.

---

## `createBrowserRouter` data

- Use route `handle` (or equivalent) for **breadcrumb** and metadata that the shell/layout reads — keep labels consistent with i18n strategy (if labels are user-visible long-term, prefer keys resolved in layout/model).

---

## Lazy loading (optional, for large pages)

- When bundle size matters, use `React.lazy` + `<Suspense>` **around the page default export** or in the router `element` wrapper — not inside FSD `ui/` files.
- Provide a **fallback** that matches design tokens (skeleton or minimal loading shell).

---

## Anti-patterns

- Defining routes inside widgets or features.
- Deep business logic or data fetching inside `pages/*.tsx` — move to widget `models/`.
