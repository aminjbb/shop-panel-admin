# Refactor Audit Skill

> **Version:** 1.0.0 | **Updated:** 2026-05-10

---

## Core Rule

> When the user says "Refactor", "Refactor this", or "Refactor `<file/path>`":
> **NEVER immediately rewrite.** Always audit first, then refactor only what violates the rules.

---

## Trigger Phrases

This skill activates when the user says:
- "Refactor"
- "Refactor this"
- "Refactor `<path>`"
- "بهینه‌سازی کن"
- "اصلاح کن"
- "پاکسازی کن"

---

## Required Workflow (always follow this order)

### Step 1: Read the File

Read the entire target file before doing anything.

### Step 2: Build the Audit Checklist

Extract applicable rules and present them as a checklist:

```
AUDIT CHECKLIST for: <filename>
Layer: <pages | widgets | features | entities | shared-app>

FSD Architecture
[ ] UI file has no logic (no useState, useEffect, handlers)
[ ] UI file has no inline type definitions
[ ] UI file has no direct API calls
[ ] Types are defined in types/index.ts
[ ] API calls are only in api/<name>Api.ts
[ ] No cross-layer imports (e.g. feature importing from widget)
[ ] File is in the correct FSD layer
[ ] If this is the root UI file, it is a composer only — no monolithic markup for sections that should be sub-components
[ ] No inline helper/nested function components defined inside the file — extract to sibling files in ui/

Design Tokens
[ ] No hardcoded hex colors (#...)
[ ] No raw rgb/rgba values
[ ] No Tailwind palette classes (text-gray-*, bg-blue-*)
[ ] No Tailwind opacity modifier on semantic tokens (e.g. bg-bg-default/35 bypasses token system)
     → If semi-transparency is intentional, define a dedicated token in index.css (e.g. --color-bg-tree-canvas)
       and replace with bg-[var(--color-bg-tree-canvas)]
[ ] No inline sx={{ fontSize: N }} on MUI icons — use Tailwind size class via className (e.g. className="w-3.5 h-3.5")
     or a shared icon-size constant
[ ] Typography uses predefined classes (text-body-sm-reg, etc.)
[ ] Border radius uses token classes (rounded-xs/sm/md/lg)
[ ] Border width uses bridge classes (border-xs/sm/md)

RTL Safety
[ ] No ml-* / mr-* → should be ms-* / me-*
[ ] No pl-* / pr-* → should be ps-* / pe-*
[ ] No left-* / right-* positioning → should be start-* / end-*
[ ] No text-left / text-right → should be text-start / text-end

i18n (Internationalization)
[ ] No hardcoded Persian text in JSX or TS return values
[ ] No hardcoded English UI strings (labels, placeholders, messages)
[ ] useTranslation called only in models/ or logics/ files (never in ui/)
[ ] All t('...') keys exist in src/lib/i18n/locales/fa/translation.json
[ ] Key names are camelCase at every level (e.g. t('tenant.addNew'))
[ ] Dynamic values use interpolation t('key', { var }) not string concat
[ ] New keys organized under the correct slice root in translation.json

TanStack Query (if applicable)
[ ] Object signature used (not array/positional)
[ ] queryFn calls api/ file method
[ ] All 4 UI states handled (loading, error, empty, data)
[ ] Mutation invalidates correct queryKeys

API Layer (if applicable)
[ ] Import from @/config/api only
[ ] File named <sliceName>Api.ts
[ ] Exports single named object
[ ] Types from ../types/index.ts

Design System Components
[ ] No native <button> — must use EButton from @/shared-app/designSystem/button
[ ] No native <input type="text"> or <textarea> — must use ETextField from @/shared-app/designSystem/textField
[ ] No native <select> — must use design-system select from @/shared-app/designSystem/select
[ ] No native <input type="checkbox"> used as toggle/switch — must use design-system switch from @/shared-app/designSystem/switch
[ ] Table row action buttons use EButton with variant="link" — not outlined, secondary, or native <button>

UI Decomposition
[ ] Every distinct section/card/panel/repeated unit in the root UI file has been extracted to its own sub-component in the same ui/ folder
[ ] Root ui/<Name>.tsx contains no markup beyond layout wrappers and sub-component composition
```

### Step 3: Report Compliance Status

For each item, report:
- ✅ **Compliant** — rule satisfied
- ❌ **Non-compliant** — violated (include exact line numbers)
- ⚠️ **Unclear** — state your assumption

Example:
```
FSD Architecture
✅ UI file has no logic
❌ Line 12: Type `UserCardProps` defined inline — must move to types/index.ts
✅ No direct API calls
⚠️ Line 5: Imports from shared-app — assumed valid (shared-app is allowed)

Design Tokens
❌ Line 24: bg-[#2093d1] — hardcoded hex, use var(--color-interactive-default)
❌ Line 31: text-gray-500 — Tailwind palette, use var(--color-text-subtle)
❌ Line 80: bg-bg-default/35 — opacity modifier on semantic token, define --color-bg-tree-canvas in index.css
❌ Line 44: sx={{ fontSize: 14 }} — inline style on MUI icon, use className="w-3.5 h-3.5"
✅ Border radius uses rounded-sm class

RTL Safety
❌ Line 18: ml-4 → must be ms-4
❌ Line 18: pr-2 → must be pe-2
```

### Step 4: Refactor (only if violations found)

Apply ALL fixes in a single pass:
- Preserve behavior — no functional changes unless required by rules
- Minimize diff — change only what violates the rules
- Keep naming consistent with existing codebase
- Do not add abstraction unless required

### Step 5: Output Summary

```
CHANGES MADE:
- Line 12: Moved UserCardProps to types/index.ts → FSD: no types in UI
- Line 24: bg-[#2093d1] → bg-[var(--color-interactive-default)] → Token rule
- Line 31: text-gray-500 → text-[var(--color-text-subtle)] → Token rule
- Line 18: ml-4 → ms-4, pr-2 → pe-2 → RTL safety

ASSUMPTIONS:
- Import from shared-app/sidebar assumed valid per FSD layer rules

UNCHANGED:
- Component logic (handleSubmit, useState) — already compliant
```

---

## Constraints

- **Never change** public component APIs (props interface names, export names)
- **Never change** routing or external contracts
- **Never introduce** new dependencies
- **Never add** abstraction unless required by rules
- If the file is **fully compliant** — output "No violations found" and stop

---

## Priority Order (when rules conflict)

```
Security > Correctness > FSD Structure > Design Tokens > RTL Safety > Style
```

---

## Examples

### Example 1: UI file with logic

User: "Refactor `widgets/userList/ui/UserList.tsx`"

**Audit finds:**
- `useState` inside UI file
- Type `UserListItem` defined inline

**Action:**
1. Extract state to `widgets/userList/models/useUserListModel.ts`
2. Move type to `widgets/userList/types/index.ts`
3. Update UI to consume model

---

### Example 2: Hardcoded colors and Persian strings

User: "Refactor `features/auth/ui/LoginForm.tsx`"

**Audit finds:**
- `className="bg-[#2093d1]"` on line 15
- `className="text-gray-600"` on line 22
- `className="ml-4"` on line 30
- Hardcoded Persian string `"ورود به حساب"` on line 8

**Action:**
- `bg-[#2093d1]` → `bg-[var(--color-interactive-default)]`
- `text-gray-600` → `text-[var(--color-text-subtle)]`
- `ml-4` → `ms-4`
- Move `"ورود به حساب"` to `translation.json` under `auth.login.title`, use `t('auth.login.title')` in model, receive as prop in UI

---

### Example 3: useTranslation inside UI file

User: "Refactor `widgets/role/ui/RoleList.tsx`"

**Audit finds:**
- `const { t } = useTranslation()` on line 5 — inside UI file
- `t('role.title')` used directly in JSX on line 18

**Action:**
1. Remove `useTranslation` from UI file
2. Add `title: t('role.title')` to `widgets/role/models/useRoleModel.ts`
3. Accept `title` as a value from model in UI component

---

### Example 4: Opacity modifier and icon inline style

User: "Refactor `widgets/organizationalUnit/ui/TreeSection.tsx`"

**Audit finds:**
- `className="bg-bg-default/35"` on line 80 — Tailwind opacity modifier on a semantic token bypasses the token system
- `sx={{ fontSize: 14 }}` on MUI icon on lines 44 & 52 — inline style for icon sizing

**Action:**
1. Add a dedicated token to `index.css`:
   ```css
   --color-bg-tree-canvas: color-mix(in srgb, var(--color-bg-default) 35%, transparent);
   ```
2. Replace `bg-bg-default/35` → `bg-[var(--color-bg-tree-canvas)]`
3. Remove `sx={{ fontSize: 14 }}` from MUI icons → add `className="w-3.5 h-3.5"` (14px = 3.5 in Tailwind spacing)

---

### Example 6: Native HTML elements instead of design-system components

User: "Refactor `features/createUser/ui/SomeForm.tsx`"

**Audit finds:**
- `<button onClick={...}>ارسال</button>` on line 20 — native button
- `<input type="text" value={...} onChange={...} />` on line 35 — native text input
- `<select value={...} onChange={...}>` on line 50 — native select
- `<input type="checkbox" checked={...} onChange={...} />` used as toggle on line 65

**Action:**
- `<button>` → `<EButton variant="primary" onClick={...}>ارسال</EButton>` (import from `@/shared-app/designSystem/button`)
- `<input type="text">` → `<ETextField value={...} onValueChange={...} />` (import from `@/shared-app/designSystem/textField`)
- `<select>` → design-system select component (import from `@/shared-app/designSystem/select`)
- `<input type="checkbox">` toggle → design-system switch component (import from `@/shared-app/designSystem/switch`)

---

### Example 5: Already compliant file

**Audit finds:** All rules satisfied

**Output:** "No violations found. File is compliant."
