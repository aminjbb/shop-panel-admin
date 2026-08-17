# Code Review Skill

> **Version:** 1.0.0 | **Updated:** 2026-05-10

---

## Core Rule

> Perform a structured, rule-based code review of the target file or diff.
> Report issues grouped by category. Provide exact line numbers and fix suggestions.
> Do NOT rewrite the file — only report findings.

---

## Trigger Phrases

- "Review this"
- "Code review"
- "بررسی کن"
- "چک کن"
- "مشکلات رو پیدا کن"

---

## Review Workflow

### Step 1: Identify the file type and layer

Determine:
- **Layer:** pages / widgets / features / entities / shared-app
- **File type:** UI component / model hook / API file / types / store
- **Context:** is it data-driven? does it have mutations? is it bilingual?

### Step 2: Run all applicable checks

Run every check below that applies to the file type.

---

## Check Categories

### A. FSD Architecture

| Check | Applies to | Severity |
|-------|-----------|----------|
| UI file contains logic (useState, useEffect, handlers) | `ui/*.tsx` | 🔴 Critical |
| UI file defines types inline | `ui/*.tsx` | 🔴 Critical |
| UI file calls API directly | `ui/*.tsx` | 🔴 Critical |
| Cross-layer import (e.g. feature → widget) | All | 🔴 Critical |
| File is in wrong layer/folder | All | 🔴 Critical |
| Extra folders outside allowed set | All | 🟡 Warning |
| Monolithic UI (all markup in root composer, no sub-component files) | `ui/<SliceName>.tsx` | 🟡 Warning |
| Model file contains JSX | `models/` | 🔴 Critical |
| Types not in `types/index.ts` | All | 🟡 Warning |

### B. Design Tokens

| Check | Applies to | Severity |
|-------|-----------|----------|
| Hardcoded hex color `#...` | `*.tsx` | 🔴 Critical |
| Inline `rgb(...)` / `rgba(...)` | `*.tsx` | 🔴 Critical |
| Tailwind palette (`text-gray-*`, `bg-blue-*`, `text-white`, `bg-white`) | `*.tsx` | 🔴 Critical |
| Raw font-size utility (`text-[14px]`, `text-sm`) | `*.tsx` | 🔴 Critical |
| Lone `font-semibold` / `font-normal` without size class | `*.tsx` | 🟡 Warning |
| Arbitrary border-radius (`rounded-[...]`, `rounded-xl`) | `*.tsx` | 🔴 Critical |
| Arbitrary border width (`border-[...]`, numeric border) | `*.tsx` | 🟡 Warning |
| Inline `style` for color/typography/spacing | `*.tsx` | 🔴 Critical |

### C. RTL Safety

| Check | Applies to | Severity |
|-------|-----------|----------|
| `ml-*` / `mr-*` used instead of `ms-*` / `me-*` | `*.tsx` | 🔴 Critical |
| `pl-*` / `pr-*` used instead of `ps-*` / `pe-*` | `*.tsx` | 🔴 Critical |
| `left-*` / `right-*` positioning instead of `start-*` / `end-*` | `*.tsx` | 🔴 Critical |
| `text-left` / `text-right` instead of `text-start` / `text-end` | `*.tsx` | 🔴 Critical |
| `border-l-*` / `border-r-*` instead of `border-s-*` / `border-e-*` | `*.tsx` | 🟡 Warning |
| Directional arrow/chevron icon without `rtl:rotate-180` | `*.tsx` | 🟡 Warning |

### D. TanStack Query (model files)

| Check | Applies to | Severity |
|-------|-----------|----------|
| v4 array signature used | `models/*.ts` | 🔴 Critical |
| `queryFn` calls `get()`/`post()` directly (not via api/ file) | `models/*.ts` | 🔴 Critical |
| Missing `enabled` for conditional query | `models/*.ts` | 🟡 Warning |
| Missing `loading` state in UI consumer | `ui/*.tsx` | 🟡 Warning |
| Missing `error` state in UI consumer | `ui/*.tsx` | 🟡 Warning |
| Missing `empty` state in UI consumer | `ui/*.tsx` | 🟡 Warning |
| Mutation does not invalidate on success | `models/*.ts` | 🟡 Warning |

### E. API Layer (api files)

| Check | Applies to | Severity |
|-------|-----------|----------|
| Import from `fetch` / `axios` / non-api.ts | `*Api.ts` | 🔴 Critical |
| API call placed outside `api/` folder | All | 🔴 Critical |
| File not named `<sliceName>Api.ts` | `api/` | 🟡 Warning |
| Does not export single named api object | `*Api.ts` | 🟡 Warning |
| Types defined inline instead of `../types` | `*Api.ts` | 🟡 Warning |

### F. General Code Quality

| Check | Applies to | Severity |
|-------|-----------|----------|
| `any` type used | All `.ts/.tsx` | 🟡 Warning |
| Missing TypeScript types for function params | All | 🟡 Warning |
| Props interface not named `<ComponentName>Props` | `ui/*.tsx` | 🟢 Info |
| Boolean var missing `is/has/can` prefix | All | 🟢 Info |
| Event handler missing `handle` prefix | All | 🟢 Info |
| Exported constant not `UPPER_SNAKE_CASE` | All | 🟢 Info |

### G. Design System Components

All buttons, switches, text fields, and select fields **must** use the shared design-system components from `src/shared-app/designSystem`. Native HTML elements or custom re-implementations are forbidden for these types.

| Check | Applies to | Severity |
|-------|-----------|----------|
| Native `<button>` used instead of `EButton` from `@/shared-app/designSystem/button` | `*.tsx` | 🔴 Critical |
| Native `<input type="text">` / `<textarea>` used instead of `ETextField` from `@/shared-app/designSystem/textField` | `*.tsx` | 🔴 Critical |
| Native `<select>` used instead of the design-system select component from `@/shared-app/designSystem/select` | `*.tsx` | 🔴 Critical |
| Native `<input type="checkbox">` used as a toggle/switch instead of the design-system switch from `@/shared-app/designSystem/switch` | `*.tsx` | 🔴 Critical |
| Custom button/input/select/switch component created outside `src/shared-app/designSystem` | All | 🔴 Critical |

---

## Report Format

```
CODE REVIEW: <filename>
Layer: <layer> | Type: <file type>
─────────────────────────────────────

🔴 CRITICAL (must fix before merge)
  [FSD] Line 14: useState inside UI file — move to models/
  [TOKEN] Line 23: bg-[#1e40af] — use var(--color-interactive-default)
  [RTL] Line 31: ml-4 → must be ms-4

🟡 WARNING (should fix)
  [QUERY] Line 45: Missing error state — add: if (error) return <ErrorPanel />
  [API] Types defined inline at line 8 — move to ../types/index.ts

🟢 INFO (optional improvement)
  [NAMING] Line 5: Boolean `loading` → rename to `isLoading`

─────────────────────────────────────
Summary: 3 critical, 2 warnings, 1 info
Files that need changes: <filename>, widgets/x/types/index.ts
```

---

## Severity Definitions

| Level | Meaning |
|-------|---------|
| 🔴 Critical | Violates a hard rule — must fix before this code can be merged |
| 🟡 Warning | Should be fixed — degrades maintainability or consistency |
| 🟢 Info | Optional improvement — cosmetic or stylistic |

---

## What NOT to do

- Do NOT rewrite the file
- Do NOT suggest architectural changes beyond FSD rules
- Do NOT flag issues that are not in the defined checks above
- Do NOT change behavior descriptions — only report rule violations
