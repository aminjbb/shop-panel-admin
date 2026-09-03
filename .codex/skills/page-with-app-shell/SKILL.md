---
name: page-with-app-shell
description: >-
  Builds a new routed page under src/pages with the standard app shell: Sidebar
  and Header from shared-app, main content from Figma MCP (get_design_context)
  adapted to FSD widget UI. Use when creating a full screen with sidebar/header,
  implementing a Figma frame as a page, or the user mentions app layout shell.
---

# Page With App Shell Skill

> **Version:** 1.0.0 | **Updated:** 2026-05-11
> **Shell components:** `src/shared-app/sidebar/index.tsx`, `src/shared-app/header/index.tsx`

---

## When this skill applies

Use when the deliverable is a **full application page** (route) that must match other Dynova screens: **persistent sidebar + top header**, scrollable **main** area, and the **body** built from **Figma** (via MCP `get_design_context`) or a design spec.

For components without the full shell (modals, cards only), use **Component-Generator** / **FSD-Architecture** instead.

---

## What already exists in the repo (reference)

Live examples of the shell pattern:

- `src/widgets/Person/ui/Person.tsx` — `Sidebar` + column (`Header` + `main` + content)
- `src/widgets/OrganizationalUnit/ui/index.tsx` — same outer layout
- `src/widgets/tenant/ui/Tenant.tsx` — same pattern

Thin page entry:

- `src/pages/Person/index.tsx` — `use*Model` + default export rendering the widget

---

## Execution order

### 1) Figma input (if a URL is provided)

1. Parse `fileKey` and `nodeId` from the Figma URL (`-` → `:` in `nodeId`; branch URLs → use `branchKey` as `fileKey`).
2. Call **`get_design_context`** (Figma MCP) before writing JSX.
3. Treat output as **reference only**: map colors → CSS variables, type → typography classes, radius → `radius-*`, reuse `src/shared-app/designSystem` where possible (see **Design-Tokens** / **Component-Generator** skill).

### 2) FSD files to create

| Piece | Path |
|-------|------|
| Page | `src/pages/<PageName>/index.tsx` |
| Widget UI (root composer) | `src/widgets/<pageName>/ui/<PageName>.tsx` (or `index.tsx` if that is the slice convention — match sibling widgets) |
| Widget UI (sub-components) | `src/widgets/<pageName>/ui/<SectionName>.tsx` — one file per distinct section of `<main>` (toolbar, panel, card, list, modal, etc.) |
| Widget model | `src/widgets/<pageName>/models/use<PageName>Model.ts` |
| Widget types | `src/widgets/<pageName>/types/index.ts` |

**Page file:** only wires the model and renders the widget — **no** shell JSX in `pages/`.

**UI decomposition is mandatory** (see **Component-Generator** → Small Component Decomposition Rule): the root `ui/<PageName>.tsx` is a **composer only** — it renders `Sidebar`, `Header`, and imports the `<main>` content from sibling sub-component files in the same `ui/` folder. Never inline the Figma-driven body markup directly in the root file; break it into `<PageName><SectionName>.tsx` files per section (e.g. `PersonToolbar.tsx`, `PersonTreePanel.tsx`, matching the `organizationalUnit` widget pattern).

### 3) Mandatory widget layout (shell)

The widget UI **must** wrap content in this structure (class names may match existing pages: `bg-bg-default`, `h-screen`, `overflow-hidden`, RTL-safe utilities):

```tsx
// ui/<PageName>.tsx — root composer, no markup of its own beyond this shell
import PageNameToolbar from './PageNameToolbar';
import PageNamePanel from './PageNamePanel';

<div className="flex h-screen overflow-hidden bg-bg-default">
  <Sidebar {...sidebarProps} />

  <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
    <Header {...headerProps} />

    <main className="flex-1 overflow-y-auto p-6">
      {/* Each distinct section is its own sub-component — never inline JSX here */}
      <PageNameToolbar {...toolbarProps} />
      <PageNamePanel {...panelProps} />
    </main>
  </div>
</div>
```

- **Do not** reimplement sidebar or header markup — import defaults from `@/shared-app/sidebar` and `@/shared-app/header`.
- `PageHeader`, toolbar, tables, panels, etc. **inside** `<main>` each live in their **own sub-component file** in `ui/` — still presentational; data via props. See `src/widgets/organizationalUnit/ui/` (`OrgToolbar.tsx`, `OrgTabs.tsx`, `OrgTreePanel.tsx`, …) as the reference pattern.

### 4) Model responsibilities

- `useTranslation` **only** here (and slice `logics/` if needed).
- **Sidebar:** `import { createSidebarProps } from '@/shared-app/sidebar/model'` and call `createSidebarProps({ activeItem: '<key>', t })`. Use a valid `SidebarItemKey` (`'dashboard' | 'tenants' | 'orgUnits' | 'persons' | …`) — see `src/shared-app/sidebar/model/index.tsx`. Match examples: `Person` → `'persons'`, `OrganizationalUnit` → `'orgUnits'`, `Tenant` → `'tenants'`.
- **New route in the sidebar:** extend `SidebarItemKey`, `SIDEBAR_ITEMS`, and `SECTION_ITEM_ORDER` in that same model file (and `href`) so the nav links to the new path.
- **Header:** build `headerProps` to match `Header` component props (`userInitials`, `userName`, `userEmail`, `userRole`, tenant fields, `*Icon` nodes). Pass **MUI icons** as `ReactNode` with token-safe classes; user-visible strings via `t(...)`.
- Queries/mutations, table data, handlers: stay in the model; pass plain props into UI.

### 5) Router

- Register the route in `src/app/router.tsx` (`createBrowserRouter`).
- Path: **kebab-case**; align with **Routing-Strategy-Instruction**.
- Set `handle.breadcrumb` for the shell if other routes do (labels should eventually align with i18n strategy — follow existing router patterns).

### 6) i18n & tokens

- All new UI strings → `src/lib/i18n/locales/fa/translation.json` under the slice root; **camelCase** keys.
- No hardcoded colors / arbitrary typography — project rules apply.

---

## Anti-patterns

- Putting `Sidebar` / `Header` only in `pages/` while the widget omits them (breaks FSD: page stays thin).
- Skipping `get_design_context` when the user supplied a Figma URL.
- `useState` / API calls / `useTranslation` inside widget **UI** files.
- Inlining the entire `<main>` body as raw JSX in the root `ui/<PageName>.tsx` instead of splitting it into sub-component files in the same `ui/` folder.

---

## Cross-references

- **FSD-Architecture** — layer rules
- **Component-Generator** — Figma token mapping tables, file templates
- **figma-implement-design** (Figma skill) — design-to-code fidelity
- **Routing-Strategy-Instruction** — router and `pages/` conventions
- **Data-UI-States-Instruction** — if the main area is data-driven
