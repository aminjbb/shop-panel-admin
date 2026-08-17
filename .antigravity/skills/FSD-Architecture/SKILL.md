# FSD Architecture Skill

> **Architecture:** Feature-Sliced Design (FSD)
> **Version:** 1.0.0 | **Updated:** 2026-05-10

---

## Core Rule

> **Strictly follow Feature-Sliced Design (FSD) at all times.**
> Never place files in wrong layers. Never import upward. Never mix logic with UI.

---

## Layer Structure

```
src/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared-app/
```

### Import Direction (strictly downward only)

```
pages → widgets → features → entities → shared-app
```

| Layer | Can import from |
|-------|----------------|
| `pages` | `widgets`, `features`, `entities`, `shared-app` |
| `widgets` | `features`, `entities`, `shared-app` |
| `features` | `entities`, `shared-app` |
| `entities` | `shared-app` |
| `shared-app` | nothing above |

**Cross-layer imports are forbidden.**

---

## Page Development

When asked to create a **page**, generate exactly these files:

```
pages/
└── <PageName>.tsx                        ← Page entry point

widgets/
└── <pageName>/
    ├── ui/
    │   ├── <PageName>.tsx                ← Root composer — pure presentational, no logic, no types
    │   └── <SectionName>.tsx             ← Sub-component per distinct section (repeat as needed)
    ├── models/
    │   └── use<PageName>Model.ts         ← State, hooks, handlers, business logic
    └── types/
        └── index.ts                      ← All TypeScript types/interfaces
```

> See **Component-Generator** → Small Component Decomposition Rule. Every distinct section, card, panel, or repeated unit gets its own file in `ui/`; the root file only composes them.

### Page File Template

```tsx
// pages/<PageName>.tsx
import { <PageName> } from "@/widgets/<pageName>/ui/<PageName>";

const <PageName>Page = () => <PageName />;
export default <PageName>Page;
```

### Widget UI Template

```tsx
// widgets/<pageName>/ui/<PageName>.tsx — root composer only
import type { <PageName>Props } from "../types";
import { use<PageName>Model } from "../models/use<PageName>Model";
import <SectionName> from "./<SectionName>";

export const <PageName> = () => {
  const model = use<PageName>Model();
  return (
    // layout wrapper + sub-components only — no raw markup for a section's content
    <div>
      <SectionName {...model.sectionProps} />
    </div>
  );
};
```

```tsx
// widgets/<pageName>/ui/<SectionName>.tsx — sub-component, same rules as root
import type { <SectionName>Props } from "../types";

const <SectionName> = (props: <SectionName>Props) => {
  return (
    // pure JSX for this section only
  );
};

export default <SectionName>;
```

### Widget Model Template

```ts
// widgets/<pageName>/models/use<PageName>Model.ts
import { useState } from "react";
import type { <RelatedType> } from "../types";

export const use<PageName>Model = () => {
  // state, handlers, derived values
  return { /* only what UI needs */ };
};
```

### Widget Types Template

```ts
// widgets/<pageName>/types/index.ts
export interface <PageName>Props {
  // ...
}
```

---

## Feature Development

When asked to create a **feature**, generate exactly these files:

```
features/
└── <featureName>/
    ├── ui/
    │   ├── <FeatureName>.tsx             ← Root composer — presentational only
    │   └── <SectionName>.tsx             ← Sub-component per distinct section (repeat as needed)
    ├── models/
    │   └── use<FeatureName>.ts           ← Hooks, handlers, business logic
    ├── api/
    │   └── <featureName>Api.ts           ← API calls only
    ├── store/
    │   └── <featureName>Store.ts         ← State management (only if needed)
    └── types/
        └── index.ts                      ← All TypeScript types/interfaces
```

---

## Entity Development

When asked to create an **entity**, generate exactly these files:

```
entities/
└── <entityName>/
    ├── ui/
    │   ├── <EntityName>.tsx              ← Root composer — presentational only
    │   └── <SectionName>.tsx             ← Sub-component per distinct section (only if needed)
    ├── models/
    │   └── use<EntityName>.ts            ← Domain logic, hooks
    ├── api/
    │   └── <entityName>Api.ts            ← API calls only
    ├── store/
    │   └── <entityName>Store.ts          ← Entity-level state (only if needed)
    └── types/
        └── index.ts                      ← All TypeScript types/interfaces
```

---

## Shared Component Development

When asked to create a **shared/reusable component**:

```
shared-app/
└── <componentName>/
    ├── ui/
    │   ├── <ComponentName>.tsx           ← Root composer — presentational UI only
    │   └── <SectionName>.tsx             ← Sub-component per distinct section (only if needed)
    ├── logics/
    │   └── use<ComponentName>.ts         ← Reusable hooks and logic
    └── types/
        └── index.ts                      ← All TypeScript types/interfaces
```

---

## Naming Conventions

| Target | Convention | Example |
|--------|------------|---------|
| Page file | `PascalCase.tsx` | `UserList.tsx` |
| Widget folder | `camelCase` | `userList/` |
| Widget UI file (root + sub-components) | `PascalCase.tsx` | `UserList.tsx`, `UserListToolbar.tsx` |
| Widget model file | `camelCase` with `use` prefix | `useUserListModel.ts` |
| Feature/Entity folder | `camelCase` | `userAuth/` |
| API file | `camelCase` + `Api` suffix | `userAuthApi.ts` |
| Store file | `camelCase` + `Store` suffix | `userAuthStore.ts` |
| Types file | always `index.ts` | `types/index.ts` |

---

## Audit Checklist

When reviewing code for FSD compliance, check:

- [ ] Page file is in `pages/` and imports from the matching widget
- [ ] Widget UI has no logic, no type definitions
- [ ] Widget model has no JSX, no API calls
- [ ] Types are only defined in `types/index.ts`
- [ ] API calls are only in `api/<sliceName>Api.ts`
- [ ] No imports going upward (e.g. feature importing from widget)
- [ ] No extra folders beyond `ui/`, `models/`, `types/`, `api/`, `store/`, `logics/`
- [ ] Root composer UI file exists (`ui/<SliceName>.tsx`) and sub-components live in the same `ui/` folder

---

## Forbidden Patterns

| Pattern | Why |
|---------|-----|
| Logic inside UI file | UI must be pure and presentational |
| Types defined in UI file | All types go in `types/index.ts` |
| API calls in `models/` or `ui/` | API belongs only in `api/` |
| Widget importing from feature at a higher level | Cross-layer violation |
| Monolithic UI (all markup in root file without sub-component split) | Sub-components must be separate files in `ui/` |
| `pages/` folder inside `widgets/` | Wrong layer nesting |
| Inline state in UI | State goes in `models/` |
