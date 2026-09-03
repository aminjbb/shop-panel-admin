# Component Generator Skill

> **Architecture:** Feature-Sliced Design (FSD)
> **Version:** 1.1.0 | **Updated:** 2026-05-10

---

## Core Rule

> When asked to generate a component, determine its layer first, then generate all required files with correct structure, naming, and content.
> Never mix logic with UI. Never define types inside UI. Never call APIs outside `api/`.

## Small Component Decomposition Rule

> **Mandatory for every UI that has more than one logical section.**

When designing any feature or component that has UI, you **must** break it into smaller, focused sub-components. Never put the entire UI in one large component file.

### Rules

1. **Decompose by visual/logical section** — every distinct section, card, panel, row, or repeated unit becomes its own sub-component.
2. **All sub-components live in the same `ui/` folder** as the parent component — never in `models/`, `types/`, or root.
3. **Sub-components are only used by their parent** — they are not exported outside the `ui/` folder unless explicitly needed by another layer.
4. **Sub-components follow the same UI rules** — zero logic, zero type definitions, props typed via `types/index.ts`.
5. **The main `ui/<Name>.tsx` is a composer** — it imports and assembles sub-components; it contains no markup of its own beyond layout wrappers.

### Example structure for a Feature

```
features/myFeature/
├── ui/
│   ├── MyFeature.tsx          ← composer: imports and lays out sub-components
│   ├── MyFeatureHeader.tsx    ← sub-component: top section
│   ├── MyFeatureCard.tsx      ← sub-component: repeated card unit
│   └── MyFeatureFooter.tsx    ← sub-component: bottom actions
├── models/
│   └── useMyFeature.ts
└── types/
    └── index.ts
```

### Decomposition checklist

| Signal | Action |
|--------|--------|
| Section has its own heading or icon | → separate sub-component |
| Element repeats in a list | → separate sub-component |
| Section has its own conditional visibility | → separate sub-component |
| Two or more fields grouped together | → consider grouping into a sub-component |
| Total JSX in one file > ~60 lines | → decompose further |

---

## Step 0: Detect Input Source

**In most cases, a Figma URL is provided alongside the generation request.**
Always check for a Figma link before doing anything else.

| Input | Action |
|-------|--------|
| Figma URL provided | → Follow the Figma workflow below first, then continue to Step 1 |
| Text description only | → Skip to Step 1 directly |

### Figma Workflow (when a URL is given)

**1. Parse the URL**

Extract `fileKey` and `nodeId` from the Figma URL:
- `figma.com/design/:fileKey/:name?node-id=:nodeId` → convert `-` to `:` in `nodeId`
- `figma.com/design/:fileKey/branch/:branchKey/...` → use `branchKey` as `fileKey`

**2. Call `get_design_context`**

```
get_design_context({ fileKey, nodeId })
```

This returns: generated code reference, a screenshot, and contextual hints (tokens, Code Connect mappings, annotations).

**3. Extract what you need**

| From Figma result | Maps to |
|-------------------|---------|
| Layout structure and hierarchy | JSX skeleton in `ui/<Name>.tsx` |
| Color values | Project design tokens (see mapping table below) |
| Font size + weight | Typography classes (see mapping table below) |
| Border radius values | Radius token classes |
| Component annotations / Code Connect | Existing codebase components to reuse |
| Overall component purpose | FSD layer decision (Step 1) |

**4. Apply token mapping — never use raw Figma values**

| Figma value | Project token |
|-------------|---------------|
| Primary brand color / blue | `var(--color-interactive-default)` |
| Hover blue | `var(--color-interactive-hover)` |
| White / light background | `var(--color-bg-subtle)` |
| Card / elevated background | `var(--color-bg-elevated)` |
| Default page background | `var(--color-bg-default)` |
| Primary body text | `var(--color-text-default)` |
| Secondary / muted text | `var(--color-text-subtle)` |
| Disabled text | `var(--color-text-disabled)` |
| Default border | `var(--color-border-default)` |
| Success green | `var(--color-status-success)` |
| Error / danger red | `var(--color-status-danger)` |
| Warning yellow | `var(--color-status-warning)` |
| 32px / 600 | `text-display-lg-semibold` |
| 28px / 600 | `text-display-md-semibold` |
| 24px / 600 | `text-display-sm-semibold` |
| 20px / 600 | `text-heading-lg-semibold` |
| 18px / 600 | `text-heading-md-semibold` |
| 16px / 600 | `text-body-lg-semibold` |
| 16px / 400 | `text-body-lg-reg` |
| 14px / 600 | `text-body-sm-semibold` |
| 14px / 400 | `text-body-sm-reg` |
| 12px / 600 | `text-label-lg-semibold` |
| 12px / 400 | `text-label-lg-reg` |
| 10px / 600 | `text-label-sm-semibold` |
| border-radius: 0px | `rounded-none` |
| border-radius: 4px | `rounded-xs` |
| border-radius: 12px | `rounded-sm` |
| border-radius: 20px | `rounded-md` |
| border-radius: 32px | `rounded-lg` |

> If a Figma color token has no matching project token, add a new CSS variable to `src/index.css` first, then use it. Never use hardcoded hex or rgb values.

**5. Check for existing components**

Before generating new UI, check `src/shared-app/designSystem` for components that already match the Figma design (buttons, inputs, selects, etc.). Reuse them — do not recreate.

**6. Continue to Step 1**

After extracting the design context, proceed with Step 1 (determine layer) through Step 5 using the Figma-extracted structure as your implementation source.

---

## Step 1: Determine the Layer

| Question | Layer |
|----------|-------|
| Is it a full page with a route? | `pages` + `widgets` |
| Full page **with app shell** (sidebar + header + main from Figma)? | Same layers — follow **`page-with-app-shell`** skill for mandatory layout and router |
| Is it a self-contained feature (login form, filter panel, upload modal)? | `features` |
| Is it a domain object (user card, product row, status badge)? | `entities` |
| Is it used across the whole project (table, modal shell, avatar)? | `shared-app` |

---

## Step 2: Generate Files by Layer

### Page + Widget

```
pages/<PageName>.tsx
widgets/<pageName>/ui/<PageName>.tsx          ← root composer
widgets/<pageName>/ui/<SectionName>.tsx       ← one file per section (repeat per Decomposition Rule above)
widgets/<pageName>/models/use<PageName>Model.ts
widgets/<pageName>/types/index.ts
```

**`pages/<PageName>.tsx`**
```tsx
import { <PageName> } from "@/widgets/<pageName>/ui/<PageName>";

const <PageName>Page = () => <PageName />;
export default <PageName>Page;
```

**`widgets/<pageName>/ui/<PageName>.tsx`** — root composer, no section markup of its own
```tsx
import type { <SpecificType> } from "../types";
import { use<PageName>Model } from "../models/use<PageName>Model";
import <SectionName> from "./<SectionName>";

export const <PageName> = () => {
  const { /* destructured model values */ } = use<PageName>Model();
  return (
    <div>
      {/* layout wrapper only — each section is imported, never inlined */}
      <SectionName {...sectionProps} />
    </div>
  );
};
```

**`widgets/<pageName>/ui/<SectionName>.tsx`** — sub-component, same rules as root
```tsx
import type { <SectionName>Props } from "../types";

const <SectionName> = (props: <SectionName>Props) => {
  return (
    <div>
      {/* pure JSX for this section only — no logic, no useState, no useEffect */}
    </div>
  );
};

export default <SectionName>;
```

**`widgets/<pageName>/models/use<PageName>Model.ts`**
```ts
import { useState, useCallback } from "react";
import type { <SpecificType> } from "../types";

export const use<PageName>Model = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = useCallback(() => {
    // business logic here
  }, []);

  return { isLoading, handleAction };
};
```

**`widgets/<pageName>/types/index.ts`**
```ts
export interface <PageName>Props {
  // props if any
}

export interface <PageName>Item {
  id: string;
  // ...
}
```

---

### Feature

```
features/<featureName>/ui/<FeatureName>.tsx      ← root composer
features/<featureName>/ui/<SectionName>.tsx      ← one file per section (only if the UI has more than one section)
features/<featureName>/models/use<FeatureName>.ts
features/<featureName>/api/<featureName>Api.ts
features/<featureName>/types/index.ts
```

**`features/<featureName>/ui/<FeatureName>.tsx`** — root composer
```tsx
import type { <FeatureName>Props } from "../types";
import { use<FeatureName> } from "../models/use<FeatureName>";
import <SectionName> from "./<SectionName>";

export const <FeatureName> = () => {
  const { /* model values */ } = use<FeatureName>();
  return (
    <div>
      {/* layout wrapper + sub-components only */}
      <SectionName {...sectionProps} />
    </div>
  );
};
```

**`features/<featureName>/models/use<FeatureName>.ts`**
```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { <featureName>Api } from "../api/<featureName>Api";
import type { <FeatureName>Item } from "../types";

export const use<FeatureName> = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["<featureName>"],
    queryFn: () => <featureName>Api.getAll(),
  });

  return { data, isLoading, error };
};
```

**`features/<featureName>/api/<featureName>Api.ts`**
```ts
import { get, post, put, del } from "@/config/api";
import type { <FeatureName>Item, Create<FeatureName>Dto } from "../types";

const BASE = "/<feature-endpoint>";

export const <featureName>Api = {
  getAll: () => get<<FeatureName>Item[]>(BASE),
  create: (body: Create<FeatureName>Dto) =>
    post<<FeatureName>Item, Create<FeatureName>Dto>(BASE, body),
};
```

**`features/<featureName>/types/index.ts`**
```ts
export interface <FeatureName>Item {
  id: string;
  // ...
}

export interface Create<FeatureName>Dto {
  // ...
}
```

---

### Entity

```
entities/<entityName>/ui/<EntityName>.tsx
entities/<entityName>/models/use<EntityName>.ts
entities/<entityName>/api/<entityName>Api.ts
entities/<entityName>/types/index.ts
```

Same structure as Feature above, but semantically represents a domain object (User, Product, Role, etc.)

---

### Shared Component

```
shared-app/<componentName>/ui/<ComponentName>.tsx
shared-app/<componentName>/logics/use<ComponentName>.ts
shared-app/<componentName>/types/index.ts
```

**`shared-app/<componentName>/ui/<ComponentName>.tsx`**
```tsx
import type { <ComponentName>Props } from "../types";
import { use<ComponentName> } from "../logics/use<ComponentName>";

export const <ComponentName> = (props: <ComponentName>Props) => {
  const logic = use<ComponentName>(props);
  return (
    <div>
      {/* generic, reusable JSX */}
    </div>
  );
};
```

---

## Step 3: Required UI States

All data-driven components must handle all 4 states:

```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorPanel onRetry={refetch} />;
if (!data?.length) return <EmptyState />;
return <ActualContent data={data} />;
```

---

## Step 4: Apply Token Rules

All UI must use design tokens — never hardcoded values.

| Type | Rule |
|------|------|
| Colors | Use `var(--color-...)` tokens only |
| Typography | Use exactly one typography class per text element |
| Border radius | Use `rounded-xs/sm/md/lg` classes only |
| Border | Use `border-xs/sm/md` classes only |
| Spacing | Use Tailwind spacing utilities (`p-*`, `m-*`, `gap-*`) |
| RTL safety | Use logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`) |

### EButton variant selection

| Use case | Variant |
|----------|---------|
| Primary CTA | `primary` |
| Secondary / tinted action | `secondary` |
| Border-only action | `outlined` / `outlinedRounded` |
| Danger / delete | `destructive` |
| **Table row actions** (edit, view, delete icon buttons) | **`link`** — no background, no border |

> **Rule:** Always use `variant="link"` for action buttons rendered inside table rows or action columns. Never use `outlined` or `secondary` variants for inline table actions.

```tsx
// ✅ Correct — table row action
<EButton variant="link" size="icon" icon={<EditIcon />} onClick={() => onEdit(row.id)} />

// ❌ Wrong — too visually heavy for a table cell
<EButton variant="outlined" size="sm" icon={<EditIcon />}>ویرایش</EButton>
```

---

## Step 5: Apply Naming Rules

| Target | Convention |
|--------|------------|
| Page file | `PascalCase.tsx` |
| Widget/Feature/Entity folder | `camelCase` |
| UI component file | `PascalCase.tsx` |
| UI component export | `PascalCase` |
| Model hook file | `camelCase` with `use` prefix |
| API file | `camelCase` + `Api` suffix |
| Store file | `camelCase` + `Store` suffix |
| Types file | always `index.ts` |
| Props interface | `PascalCase` + `Props` suffix |

---

## Audit Checklist

Before finalizing generated code, confirm:

**Figma (if URL was provided)**
- [ ] `get_design_context` was called before writing any code
- [ ] All colors mapped to project tokens (no hex, no rgb from Figma)
- [ ] All font sizes mapped to typography classes
- [ ] All border-radius values mapped to radius token classes
- [ ] Existing `shared-app/designSystem` components reused where applicable

**FSD Structure**
- [ ] Correct layer for the component type
- [ ] All required files exist with correct names
- [ ] UI file has zero logic, zero type definitions, zero API calls
- [ ] Types are in `types/index.ts` only
- [ ] API calls are in `api/<name>Api.ts` only
- [ ] UI is decomposed into smaller sub-components (no monolithic single-file UI)
- [ ] All sub-components are in the same `ui/` folder
- [ ] Main `ui/<Name>.tsx` is a pure composer (no raw markup beyond layout wrappers)

**Logic & Data**
- [ ] TanStack Query uses object signature (v5)
- [ ] All 4 data states handled (loading, error, empty, data)

**Tokens & RTL**
- [ ] Token rules applied (no hex, no raw Tailwind palette)
- [ ] Typography classes used (not `text-[...]` or `font-semibold`)
- [ ] Logical RTL properties used (`ms-*`, `me-*`, not `ml-*`, `mr-*`)
