# Structure Strategy Instruction

> **Architecture:** Feature-Sliced Design (FSD)
> **Version:** 1.0.0

---

## Layer Overview

```
src/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared-app/
```

---

## 1. Page Development

When creating a **page**, follow this structure:

```
pages/
└── <page-name>.tsx                        ← Page entry point

widgets/
└── <page-name>/
    ├── ui/
    │   └── <page-name>.tsx                ← Pure presentational UI (no logic, no types)
    ├── models/
    │   └── use<PageName>Model.ts          ← State, hooks, handlers, business logic
    └── types/
        └── index.ts                       ← All TypeScript types/interfaces
```

### Rules
- The page file imports the widget UI component and renders it.
- The widget UI file must be **pure presentational** — no logic, no inline types.
- UI files may only import types from `widgets/<page-name>/types/`.
- UI components may only consume models from `widgets/<page-name>/models/`.
- No cross-layer imports.

---

## 2. Feature Development

When developing a **feature**, follow this structure:

```
features/
└── <feature-name>/
    ├── ui/
    │   └── <FeatureName>.tsx              ← Presentational UI only
    ├── models/
    │   └── use<FeatureName>.ts            ← Hooks, handlers, business logic
    ├── store/
    │   └── <featureName>Store.ts          ← State management (if needed)
    ├── api/
    │   └── <featureName>Api.ts            ← API calls only (no logic in UI)
    └── types/
        └── index.ts                       ← All TypeScript types/interfaces
```

### Rules
- UI must be presentational — no logic, no API calls, no types defined inline.
- All business logic lives in `models/`.
- All API calls live in `api/` only — never in UI or models.
- All types live in `types/` — reuse from there everywhere.
- State management (if required) lives in `store/`.
- Feature components are used inside widgets or pages.

---

## 3. Entity Development

When developing an **entity**, follow this structure:

```
entities/
└── <entity-name>/
    ├── ui/
    │   └── <EntityName>.tsx               ← Presentational UI only
    ├── models/
    │   └── use<EntityName>.ts             ← Domain logic, hooks
    ├── store/
    │   └── <entityName>Store.ts           ← Shared/entity-level state (if needed)
    ├── api/
    │   └── <entityName>Api.ts             ← API calls only
    └── types/
        └── index.ts                       ← All TypeScript types/interfaces
```

### Conditional UI Rule

> **If a widget already exists under `widgets/<entity-name>/` for this entity, do NOT create a `ui/` folder inside `entities/<entity-name>/`.**

The entity's UI responsibility is then owned by that widget. Only create `entities/<entity-name>/ui/` when no corresponding widget exists.

```
# Widget exists → skip entity ui/
widgets/
└── <entity-name>/          ← widget exists for this entity
    └── ui/
        └── <EntityName>.tsx

entities/
└── <entity-name>/
    ├── models/              ← keep
    ├── api/                 ← keep
    └── types/               ← keep
    # NO ui/ folder here

# Widget does NOT exist → create entity ui/ as normal
entities/
└── <entity-name>/
    ├── ui/
    │   └── <EntityName>.tsx ← created only when no widget owns this entity's UI
    ├── models/
    ├── api/
    └── types/
```

### Rules
- UI must be presentational — no business logic, no API calls, no inline types.
- Domain logic and hooks live in `models/`.
- API logic must not exist in UI or models — only in `api/`.
- Types live in `types/` — do not define types inside UI files.
- Entity components are used inside features, widgets, or pages.
- **Do not create `entities/<entity-name>/ui/` if `widgets/<entity-name>/` already exists.**

---

## 4. Shared Component Development

When developing a **shared/reusable component** for use across the project:

```
shared-app/
└── <component-name>/
    ├── ui/
    │   └── <ComponentName>.tsx            ← Presentational UI only
    ├── logics/
    │   └── use<ComponentName>.ts          ← Reusable hooks and logic
    └── types/
        └── index.ts                       ← All TypeScript types/interfaces
```

### Rules
- Shared components must be generic and reusable across layers.
- UI is presentational only — no business logic.
- Logic lives in `logics/`.
- Types live in `types/`.
- These components are consumed by widgets, features, entities, and pages.

---

## Import Direction (FSD Layer Hierarchy)

Imports must only flow **downward** through the layers:

```
pages  →  widgets  →  features  →  entities  →  shared-app
```

- A **page** can import from: `widgets`, `features`, `entities`, `shared-app`
- A **widget** can import from: `features`, `entities`, `shared-app`
- A **feature** can import from: `entities`, `shared-app`
- An **entity** can import from: `shared-app`
- **Cross-layer imports are forbidden** (e.g. a feature must not import from a widget)

---

## Strict Rules (Never Violate)

| Rule | Description |
|------|-------------|
| No logic in UI | UI files must be pure and presentational |
| No types in UI | Types must be defined in the `types/` folder |
| No API in UI | API calls belong only in `api/` |
| No cross-layer imports | Respect FSD import direction strictly |
| No extra folders | Only `ui/`, `models/`, `types/`, `api/`, `store/`, `logics/` |
| Types are always reused | Import types from `types/index.ts`, never redefine |
| UI decomposition | One root composer file (`ui/<SliceName>.tsx`) + sub-components in the same `ui/` folder; no monolithic markup in root |
