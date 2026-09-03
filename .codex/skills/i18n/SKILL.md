# i18n Skill

> **Library:** react-i18next
> **Locale file:** `src/lib/i18n/locales/fa/translation.json`
> **Version:** 1.0.0 | **Updated:** 2026-05-10

---

## Core Rule

> **ALL user-visible text must come from the translation file.**
> Never hardcode Persian or English UI strings directly in TSX or TS files.
> `useTranslation` must only be called inside **model** files — never in UI files.

---

## Setup

```typescript
// src/lib/i18n/index.ts — already configured, do not modify
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import faTranslation from './locales/fa/translation.json';

i18n.use(initReactI18next).init({
  resources: { fa: { translation: faTranslation } },
  lng: 'fa',
  fallbackLng: 'fa',
  interpolation: { escapeValue: false },
});
```

---

## Translation File Structure

File: `src/lib/i18n/locales/fa/translation.json`

Organize keys by **feature/domain slice**, then by **section**:

```json
{
  "<slice>": {
    "title": "...",
    "subtitle": "...",
    "addNew": "...",
    "count": "{{count}} ...",
    "search": {
      "placeholder": "..."
    },
    "stats": {
      "total": "...",
      "active": "...",
      "inactive": "..."
    },
    "table": {
      "<columnName>": "..."
    },
    "status": {
      "active": "...",
      "inactive": "..."
    },
    "actions": {
      "view": "...",
      "edit": "...",
      "delete": "..."
    },
    "form": {
      "fields": {
        "<fieldName>": {
          "label": "...",
          "placeholder": "...",
          "helperText": "...",
          "error": "..."
        }
      },
      "validation": {
        "required": "این فیلد الزامی است",
        "invalid": "دیتای وارد شده صحیح نیست"
      }
    }
  }
}
```

---

## Adding New Translations

### Step 1: Add keys to translation.json

```json
{
  "role": {
    "title": "مدیریت نقش‌ها",
    "subtitle": "لیست نقش‌های تعریف‌شده در پلتفرم",
    "addNew": "نقش جدید",
    "count": "{{count}} نقش",
    "table": {
      "name": "نام نقش",
      "permissions": "مجوزها",
      "status": "وضعیت"
    },
    "status": {
      "active": "فعال",
      "inactive": "غیرفعال"
    }
  }
}
```

### Step 2: Use in model file (not UI)

```typescript
// widgets/role/models/useRoleModel.ts
import { useTranslation } from 'react-i18next';

export const useRoleModel = () => {
  const { t } = useTranslation();

  return {
    title: t('role.title'),
    subtitle: t('role.subtitle'),
    addNewLabel: t('role.addNew'),
    tableHeaders: {
      name: t('role.table.name'),
      permissions: t('role.table.permissions'),
      status: t('role.table.status'),
    },
    statusLabels: {
      active: t('role.status.active'),
      inactive: t('role.status.inactive'),
    },
  };
};
```

### Step 3: Consume in UI (receive as props from model)

```tsx
// widgets/role/ui/Role.tsx
import { useRoleModel } from '../models/useRoleModel';

export const Role = () => {
  const { title, subtitle, addNewLabel, tableHeaders } = useRoleModel();
  return (
    <div>
      <h1 className="text-display-md-semibold">{title}</h1>
      <p className="text-body-sm-reg">{subtitle}</p>
    </div>
  );
};
```

---

## Interpolation (Dynamic Values)

### Count / plural

```json
{
  "tenant": {
    "count": "{{count}} سازمان"
  }
}
```

```typescript
t('tenant.count', { count: tenants.length })
// → "۵ سازمان"
```

### Named variables

```json
{
  "user": {
    "welcome": "خوش آمدید، {{name}}"
  }
}
```

```typescript
t('user.welcome', { name: userName })
// → "خوش آمدید، علی"
```

---

## Key Naming Conventions

| Pattern | Example |
|---------|---------|
| Slice root | `tenant`, `person`, `role`, `user` |
| Page title | `<slice>.title` |
| Page subtitle | `<slice>.subtitle` |
| Add button | `<slice>.addNew` |
| Count badge | `<slice>.count` |
| Table headers | `<slice>.table.<columnName>` |
| Status labels | `<slice>.status.<statusValue>` |
| Action labels | `<slice>.actions.<actionName>` |
| Form field label | `<slice>.form.fields.<fieldName>.label` |
| Form field placeholder | `<slice>.form.fields.<fieldName>.placeholder` |
| Form validation | `<slice>.form.validation.required`, `.invalid` |
| Search placeholder | `<slice>.search.placeholder` |
| Stat cards | `<slice>.stats.<statName>` |

Key names must be `camelCase` at every level.

---

## Where to Call useTranslation

| Location | Allowed | Reason |
|----------|---------|--------|
| `widgets/<name>/models/` | ✅ Yes | model files handle all logic |
| `features/<name>/models/` | ✅ Yes | model files handle all logic |
| `entities/<name>/models/` | ✅ Yes | model files handle all logic |
| `shared-app/<name>/logics/` | ✅ Yes | logic files allowed |
| `widgets/<name>/ui/` | ❌ No | UI must be pure — receive strings as props |
| `features/<name>/ui/` | ❌ No | same rule |
| `entities/<name>/ui/` | ❌ No | same rule |
| `pages/` | ❌ No | delegate to widget model |

---

## Adding a New Locale (future)

When adding English support:

1. Create: `src/lib/i18n/locales/en/translation.json`
2. Add to `src/lib/i18n/index.ts`:

```typescript
import enTranslation from './locales/en/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    fa: { translation: faTranslation },
    en: { translation: enTranslation },
  },
  lng: 'fa',
  fallbackLng: 'fa',
});
```

3. All existing `t('...')` calls work automatically for the new locale.

---

## Audit Checklist

- [ ] All UI text uses `t('...')` — no hardcoded Persian/English strings
- [ ] `useTranslation` called only in model/logic files (not in UI)
- [ ] Keys added to `src/lib/i18n/locales/fa/translation.json`
- [ ] Key names are `camelCase` at every level
- [ ] Keys organized under the correct slice root (`tenant`, `person`, etc.)
- [ ] Interpolation uses `{{variable}}` syntax (not string concatenation)
- [ ] No missing keys (all `t('...')` calls have matching JSON entries)

---

## Forbidden Patterns

```tsx
// ❌ Hardcoded Persian in JSX
<h1>مدیریت کاربران</h1>

// ❌ Hardcoded Persian in model
return { title: 'مدیریت کاربران' };

// ❌ useTranslation inside UI file
export const MyComponent = () => {
  const { t } = useTranslation(); // ← must be in models/
  return <h1>{t('user.title')}</h1>;
};

// ❌ String concatenation instead of interpolation
t('tenant.count') + ' ' + count  // ← use t('tenant.count', { count })

// ❌ Keys not in translation file (runtime error)
t('user.nonExistentKey')

// ❌ Inline key naming (inconsistent)
t('user_title')       // use camelCase: t('user.title')
t('User.Title')       // use camelCase: t('user.title')
```
