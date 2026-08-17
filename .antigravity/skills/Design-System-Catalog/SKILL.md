# Design System Catalog

> **Version:** 1.0.0 | **Updated:** 2026-06-16
> **Purpose:** Single-file reference for all available components. Read this instead of searching the codebase.

---

## RULE: Always check this catalog before creating new UI components.
If a component exists here, use it. Do NOT recreate it.

---

## FORBIDDEN — Never use these in UI files

Using native HTML elements or third-party primitives directly is **forbidden** when a design system equivalent exists.

| Forbidden | Required replacement | Import |
|-----------|---------------------|--------|
| `<button>`, MUI `Button`, shadcn `Button` | `EButton` | `@/shared-app/designSystem/button` |
| `<input>`, MUI `TextField`, shadcn `Input` | `ETextField` | `@/shared-app/designSystem/textField` |
| `<input type="number">` | `ENumberField` | `@/shared-app/designSystem/numberField` |
| `<input type="date">`, MUI `DatePicker` | `EDatePicker` | `@/shared-app/designSystem/datePicker` |
| `<select>`, MUI `Select` | `ESelect` | `@/shared-app/designSystem/select` |
| `<input type="checkbox">`, MUI `Switch` | `ESwitch` | `@/shared-app/designSystem/switch` |
| `<input type="radio">`, MUI `Radio` | `ERadio` | `@/shared-app/designSystem/radio` |
| Custom pagination component | `EPagination` | `@/shared-app/designSystem/pagination` |
| Custom tab switcher | `ESwitchTab` | `@/shared-app/designSystem/switchTab` |
| Custom search input | `SearchBox` | `@/shared-app/designSystem/searchBox` |
| `<table>`, custom grid, MUI `Table` | `DynamicTable` | `@/shared-app/dynamicTable` |
| Custom empty state / no-data view | `EmptyState` | `@/shared-app/emptyState` |
| Custom page heading / title+actions area | `HeaderPages` | `@/shared-app/headerPages` |
| Custom section title | `SectionHeader` | `@/shared-app/sectionHeader` |
| Custom status badge | `ActivationBage` | `@/shared-app/activationbage` |
| Custom alert / warning banner | `AllertMassage` | `@/shared-app/allertMassage` |
| `alert()`, custom toast | `useToastStore` | `@/shared-app/designSystem/toast/store` |
| Custom modal / drawer | `BottomSheet` | `@/shared-app/bottomSheet` |
| native `title` attribute for tooltip | `ETooltip` | `@/shared-app/designSystem/tooltip` |
| MUI `LinearProgress` | `EProgressBar` | `@/shared-app/designSystem/progressBar` |

> **Table row actions:** always `<EButton variant="link" size="icon" icon={...} />` — never `outlined`, `secondary`, or native `<button>`.

---

## designSystem Components (`src/shared-app/designSystem/`)

### EButton
```ts
import EButton from "@/shared-app/designSystem/button";
// Types: EButtonVariant, EButtonSize, EButtonIconPosition, EButtonProps
```
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `EButtonVariant` | required | See variants below |
| `size` | `"sm"\|"md"\|"lg"\|"icon"` | `"md"` | |
| `icon` | `ReactNode` | — | |
| `iconPosition` | `"start"\|"end"` | `"start"` | RTL-safe |
| `disabled` | `boolean` | `false` | |
| `onClick` | `MouseEventHandler` | — | |

**Variants:** `primary` · `secondary` · `outlined` · `outlinedRounded` · `destructive` · **`link`** (table row actions)
Each variant has sub-states: `*Hover` · `*Active` · `*Focus` · `*Disabled`

```tsx
// Primary CTA
<EButton variant="primary" size="md">ذخیره</EButton>
// Table row action — ALWAYS use link
<EButton variant="link" size="icon" icon={<EditIcon />} onClick={() => onEdit(id)} />
// Destructive
<EButton variant="destructive" icon={<DeleteIcon />}>حذف</EButton>
```

---

### ETextField
```ts
import ETextField from "@/shared-app/designSystem/textField";
// Types: ETextFieldProps
```
| Prop | Type | Notes |
|------|------|-------|
| `value` | `string` | Controlled |
| `onValueChange` | `(v: string) => void` | Preferred over `onChange` |
| `label` | `ReactNode` | |
| `placeholder` | `string` | |
| `error` | `boolean` | |
| `helperText` | `ReactNode` | Validation message |
| `required` | `boolean` | |
| `fullWidth` | `boolean` | Default `true` |
| `leftIcon` / `rightIcon` | `ReactNode` | Adornments |
| `multiline` | `boolean` | Textarea mode |

```tsx
<ETextField label="نام" value={name} onValueChange={setName} fullWidth required />
```

---

### ESelect
```ts
import ESelect from "@/shared-app/designSystem/select";
// Types: ESelectProps, ESelectOption, ESelectValue
```
| Prop | Type | Notes |
|------|------|-------|
| `options` | `ESelectOption[]` | `{ label, value, disabled? }` |
| `fetchOptions` | `() => Promise<ESelectOption[]>` | Async load |
| `value` | `ESelectValue \| ESelectValue[]` | Controlled |
| `onValueChange` | `(v) => void` | Preferred callback |
| `multiple` | `boolean` | Multi-select |
| `label` | `ReactNode` | |
| `placeholder` | `ReactNode` | |
| `fullWidth` | `boolean` | Default `true` |

```tsx
<ESelect label="نقش" options={roleOptions} value={role} onValueChange={setRole} />
```

---

### ESwitch
```ts
import ESwitch from "@/shared-app/designSystem/switch";
// Types: ESwitchProps
```
| Prop | Type | Notes |
|------|------|-------|
| `checked` | `boolean` | Controlled |
| `onCheckedChange` | `(checked: boolean) => void` | Simplified callback |
| `activeLabel` | `ReactNode` | Label when ON |
| `inActiveLabel` | `ReactNode` | Label when OFF |
| `labelPosition` | `"left"\|"right"` | Default `"left"` |

```tsx
<ESwitch checked={isActive} onCheckedChange={setIsActive} activeLabel="فعال" inActiveLabel="غیرفعال" />
```

---

### ERadio
```ts
import ERadio from "@/shared-app/designSystem/radio";
// Types: ERadioProps (extends MUI RadioProps)
```
| Prop | Type | Notes |
|------|------|-------|
| `onCheckedChange` | `(checked: boolean, event) => void` | Simplified callback |

```tsx
<ERadio value="admin" checked={role === "admin"} onCheckedChange={() => setRole("admin")} />
```

---

### EStepper
```ts
import EStepper from "@/shared-app/designSystem/stepper";
// Types: EStepperProps, EStepperStep
```
| Prop | Type | Notes |
|------|------|-------|
| `steps` | `EStepperStep[]` | `{ id, label, icon }` |
| `activeStep` | `number` | 0-based index |

```tsx
<EStepper steps={steps} activeStep={currentStep} />
```

---

### EPagination
```ts
import EPagination from "@/shared-app/designSystem/pagination";
// Types: EPaginationProps
```
| Prop | Type | Notes |
|------|------|-------|
| `page` | `number` | 1-indexed |
| `count` | `number` | Total pages |
| `onChange` | `(page: number) => void` | |

```tsx
<EPagination page={page} count={totalPages} onChange={setPage} />
```

---

### ESwitchTab
```ts
import ESwitchTab from "@/shared-app/designSystem/switchTab";
// Types: ESwitchTabProps, ESwitchTabOption
```
| Prop | Type | Notes |
|------|------|-------|
| `options` | `ESwitchTabOption<T>[]` | `{ value: T, label: string }` |
| `value` | `T` | Active tab value (controlled) |
| `onChange` | `(value: T) => void` | Called on tab click |

**Visual:** pill container (`bg-bg-subtle`) with per-tab buttons; active button gets `bg-bg-muted shadow-amin-xs`.

```tsx
type MyTab = 'info' | 'models';
<ESwitchTab<MyTab>
  value={activeTab}
  onChange={setActiveTab}
  options={[
    { value: 'models', label: t('tabs.models') },
    { value: 'info', label: t('tabs.info') },
  ]}
/>
```

---

### SearchBox
```ts
import SearchBox from "@/shared-app/designSystem/searchBox";
// Types: SearchBoxProps
```
| Prop | Type | Notes |
|------|------|-------|
| `value` | `string` | Controlled |
| `onChange` | `(v: string) => void` | Per keystroke |
| `onSearch` | `(v: string) => void` | On Enter/button |
| `placeholder` | `string` | |
| `shortcutHint` | `string` | e.g. `"Ctrl F"` |

---

### TableHeader
```ts
import TableHeader from "@/shared-app/designSystem/tableHeader";
// Types: TableHeaderProps
```
Combines action button + sort + filter + view toggle + search in one component.

| Prop | Notes |
|------|-------|
| `actionLabel` + `onActionClick` | Primary action button |
| `showAction` / `showSort` / `showFilter` | Toggle sections |
| `view` + `onViewChange` | `"list" \| "grid"` toggle |
| `searchValue` + `onSearchChange` + `onSearch` | Search bar |

```tsx
<TableHeader
  actionLabel={t("addNew")}
  onActionClick={onAddNew}
  searchValue={search}
  onSearchChange={setSearch}
  showSort={false}
/>
```

---

### GridState
```ts
import GridState from "@/shared-app/designSystem/gridState";
// Types: GridStateProps, GridStateViewType
```
Toggle between `"list"` and `"grid"` views.

---

### ENumberField
```ts
import { ENumberField } from "@/shared-app/designSystem/numberField";
// Types: ENumberFieldProps
```
Same API as `ETextField` with `min`, `max`, `step`, `showControls` added.

---

### EDatePicker / ETimePicker / EDateTimePicker
```ts
import EDatePicker from "@/shared-app/designSystem/datePicker";
import ETimePicker from "@/shared-app/designSystem/timePicker";
import EDateTimePicker from "@/shared-app/designSystem/dateTimePicker";
```
All share: `value`, `onChange`, `onValueChange`, `label`, `disabled`, `error`, `helperText`, `minDate`, `maxDate`, `fullWidth`.

---

### EProgressBar
```ts
import EProgressBar from "@/shared-app/designSystem/progressBar";
// Types: EProgressBarProps (extends MUI LinearProgressProps)
```
| Prop | Notes |
|------|-------|
| `value` | 0–100 (from MUI) |
| `filledColor` | CSS color / var token |
| `trackColor` | CSS color / var token |
| `rtl` | Default `true` |

---

### EPopover / ETooltip
```ts
import EPopover from "@/shared-app/designSystem/popover";
import ETooltip from "@/shared-app/designSystem/tooltip";
```
Both accept `content: ReactNode`. `ETooltip` also accepts `position: ETooltipPosition`.

---

### Toast (global)
```ts
import useToastStore from "@/shared-app/designSystem/toast/store";
// In component: useToastStore.getState().show({ title, message, status })
// Status: "success" | "error" | "warning" | "info"
```
Call from model/logics only. Never call from UI.

---

### InfoText
```ts
import InfoText from "@/shared-app/designSystem/infoText";
// Props: { title?, description?, className? }
```

---

## shared-app Components (`src/shared-app/`)

### Header
```ts
import Header from "@/shared-app/header";
// Props: { breadcrumbs?, onProfile?, onNotifications?, onSettings?, onExport? }
```
App shell top bar. Used in every routed page.

---

### Sidebar
```ts
import Sidebar from "@/shared-app/sidebar";
// Props: { brandInitial, brandName, sections: SidebarSection[], version?, copyrightText? }
```
App shell side navigation. `SidebarSection` → `SidebarItem[]` → `SidebarSubItem[]`.

---

### HeaderPages
```ts
import { HeaderPages } from "@/shared-app/headerPages";
// Props: { title: string, subtitle?: string, children?: ReactNode }
```
Page-level heading with optional action slot on the trailing end.

```tsx
<HeaderPages title={t("users.title")} subtitle={t("users.subtitle")}>
  <EButton variant="primary" onClick={onAddNew}>{t("addNew")}</EButton>
</HeaderPages>
```

---

### DynamicTable
```ts
import DynamicTable from "@/shared-app/dynamicTable";
// Types: DynamicTableColumn<T>, DynamicTableFooterLabels
```
| Prop | Type | Notes |
|------|------|-------|
| `columns` | `DynamicTableColumn<T>[]` | Column definitions |
| `data` | `T[]` | Row data |
| `keyExtractor` | `(row: T) => string` | Unique row key |
| Row actions | via `renderCell` | Use `EButton variant="link"` |

```tsx
const columns: DynamicTableColumn<User>[] = [
  { key: "name", header: t("name"), renderCell: (row) => row.name },
  {
    key: "actions",
    header: t("actions"),
    renderCell: (row) => (
      <EButton variant="link" size="icon" icon={<EditIcon />} onClick={() => onEdit(row.id)} />
    ),
  },
];
```

---

### EmptyState
```ts
import EmptyState from "@/shared-app/emptyState";
// Props: { title, illustration?, buttonLabel?, onButtonClick?, buttonVariant? }
```

---

### StatCard
```ts
import StatCard from "@/shared-app/statCard";
// Props: { value, label, iconBgClassName, icon }
```

---

### ActivationBage
```ts
import ActivationBage from "@/shared-app/activationbage";
// Props: { label: string, status: "active"|"inactive"|"info"|"archived" }
```

---

### AllertMassage
```ts
import AllertMassage from "@/shared-app/allertMassage";
// Props: { icon, title?, message, variant?: "warning"|"danger"|"info"|"success" }
```

---

### BottomSheet (modal drawer)
```ts
import { BottomSheet, useBottomSheetStore } from "@/shared-app/bottomSheet";
// Open: useBottomSheetStore.getState().open(payload)
// Close: useBottomSheetStore.getState().close()
```

---

### ConfirmedBox
```ts
import ConfirmedBox from "@/shared-app/confirmedBox";
// Props: { checked, onCheckedChange, message, warningText? }
```

---

### SectionHeader
```ts
import SectionHeader from "@/shared-app/sectionHeader";
// Props: { title: string, icon?: ReactNode }
```

---

### PageHeader
```ts
import PageHeader from "@/shared-app/pageHeader";
// Props: { breadcrumbs: string[], title: string, subtitle: string }
```

---

### Breadcrumb
```ts
import { Breadcrumb } from "@/shared-app/breadcrumb";
// Props: { items: BreadcrumbItem[] } — { label, href?, isActive? }
```
