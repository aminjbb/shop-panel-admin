---
description: Reference for all shared design-system components. Apply when using or building any UI that needs buttons, text fields, icon buttons, confirm dialogs, sidebars, data tables, or toasts from `src/shared-app`.
applyTo: "src/**/*.{ts,tsx}"
---

# Design System — Component Reference

> All shared components live directly under `src/shared-app/`.  
> Each component module follows **Feature-Sliced Design (FSD)** architecture:
> - `ui/`: Component UI implementation (e.g. `ui/Button.tsx`)
> - `logics/`: Component custom hook logic (e.g. `logics/useButton.ts`)
> - `types/`: Type & interface definitions (e.g. `types/index.ts`)
> 
> Always import components and types directly from their respective FSD path under `src/shared-app/` — never copy or re-create these primitives in feature or widget folders.

---

## FSD Architecture & Component Structure

Every shared component in `src/shared-app` is structured as follows:

```
src/shared-app/<component-folder>/
├── ui/              # Presentation React component
├── logics/          # Custom hook with UI handlers & state logic
└── types/           # Component props and type definitions
```

---

## Design Tokens & Glassmorphism System

The design system relies on CSS variables defined in `src/index.css` supporting dark mode glassmorphism:

- **Primary Colors:** `--color-primary` (`#6366f1`), `--color-primary-hover` (`#4f46e5`)
- **Background & Surface:** `--color-background` (`#0f172a`), `--color-surface` (`rgba(255, 255, 255, 0.08)`)
- **Glass Effects:** `.glass-card`, `.glass-nav`, `--glass-bg`, `--glass-border`, `--glass-input-bg`
- **Text Tokens:** `--color-text-primary` (`#ffffff`), `--color-text-secondary` (`rgba(255, 255, 255, 0.7)`), `--color-text-muted` (`rgba(255, 255, 255, 0.45)`)
- **Status Colors:** `--color-error` (`#f87171`), `--color-success` (`#4ade80`), `--color-warning` (`#fbbf24`)
- **Border Radii:** `--radius-sm` (`0.5rem`), `--radius-md` (`0.75rem`), `--radius-lg` (`1rem`), `--radius-xl` (`1.5rem`)

---

## Shared Component Specifications

---

### 1. `Button` — Action Button

**Path:** `src/shared-app/button`  
**Imports:**
- UI: `import { Button } from '@/shared-app/button/ui/Button'`
- Logic: `import { useButton } from '@/shared-app/button/logics/useButton'`
- Types: `import type { ButtonProps } from '@/shared-app/button/types'`

#### Props (`ButtonProps`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **Required** | Button content / label |
| `variant` | `'primary'` \| `'secondary'` \| `'outlined'` \| `'text'` | `'primary'` | Visual style variant |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | Button sizing |
| `isLoading` | `boolean` | `false` | Shows loading spinner and text |
| `isFullWidth` | `boolean` | `false` | Stretches button to 100% width |
| `isDisabled` | `boolean` | `false` | Disables button interactions |
| `startIcon` | `ReactNode` | — | Icon rendered before label |
| `endIcon` | `ReactNode` | — | Icon rendered after label |
| `type` | `'button'` \| `'submit'` \| `'reset'` | `'button'` | Native HTML button type |
| `className` | `string` | `''` | Additional Tailwind classes |
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | — | Click handler |

```tsx
import { Button } from '@/shared-app/button/ui/Button';

// Primary Button
<Button variant="primary" size="medium" isLoading={isSubmitting} onClick={handleSubmit}>
  ورود به حساب
</Button>

// Secondary Glass Button with Icon
<Button variant="secondary" size="small" startIcon={<Plus className="w-4 h-4" />}>
  افزودن آیتم جدید
</Button>
```

---

### 2. `TextField` — Input & Password Field

**Path:** `src/shared-app/textField`  
**Imports:**
- UI: `import { TextField } from '@/shared-app/textField/ui/TextField'`
- Logic: `import { useTextField } from '@/shared-app/textField/logics/useTextField'`
- Types: `import type { TextFieldProps } from '@/shared-app/textField/types'`

#### Props (`TextFieldProps`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | **Required** | Input field name |
| `value` | `string` | **Required** | Controlled input value |
| `onChange` | `(event: ChangeEvent<HTMLInputElement>) => void` | **Required** | Change event handler |
| `id` | `string` | `name` | HTML input element ID |
| `label` | `string` | — | Field floating label |
| `type` | `'text'` \| `'password'` \| `'email'` \| `'number'` | `'text'` | Input type (auto toggles password visibility icon) |
| `placeholder` | `string` | — | Placeholder text |
| `hasError` | `boolean` | `false` | Enables error border & color |
| `errorMessage` | `string` | — | Validation error text displayed below input |
| `helperText` | `string` | — | Helper text displayed below input |
| `isDisabled` | `boolean` | `false` | Disables input |
| `isRequired` | `boolean` | `false` | Marks field as required |
| `isFullWidth` | `boolean` | `true` | Stretches container to 100% width |
| `autoComplete` | `string` | — | HTML autocomplete attribute |
| `startAdornment` | `ReactNode` | — | Icon/Element placed inside start of input |
| `endAdornment` | `ReactNode` | — | Icon/Element placed inside end of input |
| `onBlur` | `(event: FocusEvent<HTMLInputElement>) => void` | — | Focus out handler |
| `className` | `string` | `''` | Container styling |

```tsx
import { TextField } from '@/shared-app/textField/ui/TextField';
import { User, Lock } from 'lucide-react';

<TextField
  name="username"
  label="نام کاربری"
  value={formData.username}
  onChange={handleChange}
  startAdornment={<User className="w-4 h-4 text-white/50" />}
  hasError={!!errors.username}
  errorMessage={errors.username}
/>

<TextField
  name="password"
  type="password"
  label="رمز عبور"
  value={formData.password}
  onChange={handleChange}
  startAdornment={<Lock className="w-4 h-4 text-white/50" />}
  hasError={!!errors.password}
  errorMessage={errors.password}
/>
```

---

### 3. `IconButton` — Icon Only Action

**Path:** `src/shared-app/iconButton`  
**Imports:**
- UI: `import { IconButton } from '@/shared-app/iconButton/ui/IconButton'`
- Logic: `import { useIconButton } from '@/shared-app/iconButton/logics/useIconButton'`
- Types: `import type { IconButtonProps } from '@/shared-app/iconButton/types'`

#### Props (`IconButtonProps`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **Required** | Icon element |
| `ariaLabel` | `string` | **Required** | Accessible screen reader label |
| `variant` | `'primary'` \| `'secondary'` \| `'ghost'` \| `'outlined'` | `'ghost'` | Button style variant |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | Button dimensions |
| `isDisabled` | `boolean` | `false` | Disables button |
| `tooltipText` | `string` | — | Tooltip text (wraps in MUI Tooltip when set) |
| `type` | `'button'` \| `'submit'` \| `'reset'` | `'button'` | HTML button type |
| `className` | `string` | `''` | Custom CSS classes |

```tsx
import { IconButton } from '@/shared-app/iconButton/ui/IconButton';
import { Trash2, Edit } from 'lucide-react';

<IconButton
  ariaLabel="ویرایش آیتم"
  tooltipText="ویرایش اطلاعات"
  variant="ghost"
  size="small"
  onClick={handleEdit}
>
  <Edit className="w-4 h-4 text-indigo-400" />
</IconButton>

<IconButton
  ariaLabel="حذف آیتم"
  tooltipText="حذف دسته‌بندی"
  variant="ghost"
  size="small"
  onClick={handleDelete}
>
  <Trash2 className="w-4 h-4 text-rose-400" />
</IconButton>
```

---

### 4. `ConfirmDialog` — Confirmation Modal

**Path:** `src/shared-app/confirmDialog`  
**Imports:**
- UI: `import { ConfirmDialog } from '@/shared-app/confirmDialog/ui/ConfirmDialog'`
- Logic: `import { useConfirmDialog } from '@/shared-app/confirmDialog/logics/useConfirmDialog'`
- Types: `import type { ConfirmDialogProps, ConfirmDialogVariant } from '@/shared-app/confirmDialog/types'`

#### Props (`ConfirmDialogProps`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | **Required** | Modal open state |
| `title` | `string` | **Required** | Dialog header title |
| `description` | `ReactNode` | **Required** | Dialog body content / explanation |
| `onConfirm` | `() => void` | **Required** | Triggered on primary confirm click |
| `onClose` | `() => void` | **Required** | Triggered on backdrop or cancel click |
| `confirmLabel` | `string` | `'تأیید و حذف'` | Primary confirm button text |
| `cancelLabel` | `string` | `'انصراف'` | Cancel button text |
| `isLoading` | `boolean` | `false` | Disables actions & shows button loading |
| `variant` | `'danger'` \| `'warning'` \| `'info'` | `'danger'` | Dialog theme & header icon |

```tsx
import { ConfirmDialog } from '@/shared-app/confirmDialog/ui/ConfirmDialog';

<ConfirmDialog
  isOpen={isDeleteModalOpen}
  title="حذف دسته‌بندی"
  description="آیا از حذف این دسته‌بندی اطمینان دارید؟ تمام داده‌های مرتبط پاک خواهند شد."
  variant="danger"
  isLoading={isDeleting}
  confirmLabel="بله، حذف شود"
  cancelLabel="انصراف"
  onConfirm={handleConfirmDelete}
  onClose={() => setIsDeleteModalOpen(false)}
/>
```

---

### 5. `SidebarContainer` — Responsive Sidebar & Mobile Drawer

**Path:** `src/shared-app/sidebarContainer`  
**Imports:**
- UI: `import { SidebarContainer } from '@/shared-app/sidebarContainer/ui/SidebarContainer'`
- Logic: `import { useSidebarContainer } from '@/shared-app/sidebarContainer/logics/useSidebarContainer'`
- Types: `import type { SidebarContainerProps } from '@/shared-app/sidebarContainer/types'`

#### Props (`SidebarContainerProps`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **Required** | Navigation menu links/items |
| `isCollapsed` | `boolean` | **Required** | Desktop sidebar collapse state (`w-20` vs `w-64`) |
| `isMobileOpen` | `boolean` | **Required** | Mobile drawer overlay open state |
| `onMobileClose` | `() => void` | **Required** | Triggered when backdrop is clicked on mobile |
| `headerSlot` | `ReactNode` | — | Top logo or branding section slot |
| `footerSlot` | `ReactNode` | — | Bottom user info or logout section slot |
| `className` | `string` | `''` | Extra wrapper styling |

```tsx
import { SidebarContainer } from '@/shared-app/sidebarContainer/ui/SidebarContainer';

<SidebarContainer
  isCollapsed={isCollapsed}
  isMobileOpen={isMobileOpen}
  onMobileClose={() => setIsMobileOpen(false)}
  headerSlot={<BrandHeader isCollapsed={isCollapsed} />}
  footerSlot={<UserProfileFooter isCollapsed={isCollapsed} />}
>
  <NavigationItems />
</SidebarContainer>
```

---

### 6. Table Components (`DataTable`, `TablePagination`, `ColumnManager`)

**Path:** `src/shared-app/table`  
**Imports:**
- Data Table UI: `import { DataTable } from '@/shared-app/table/ui/DataTable'`
- Table Pagination UI: `import { TablePagination } from '@/shared-app/table/ui/TablePagination'`
- Column Manager UI: `import { ColumnManager } from '@/shared-app/table/ui/ColumnManager'`
- Logic: `import { useDataTable } from '@/shared-app/table/logics/useDataTable'`
- Types: `import type { Column, DataTableProps, TablePaginationProps, ColumnManagerProps, SortDirection } from '@/shared-app/table/types'`

#### DataTable Props (`DataTableProps<T>`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `Column<T>[]` | **Required** | Table columns configuration array |
| `data` | `T[]` | **Required** | Data rows array |
| `keyExtractor` | `(item: T) => string` | **Required** | Key extractor function for each row |
| `sortColumn` | `string \| null` | **Required** | Currently active sorted column ID |
| `sortDirection` | `SortDirection` (`'asc'` \| `'desc'` \| `null`) | **Required** | Sort direction |
| `onSortChange` | `(columnId: string) => void` | **Required** | Column sort click handler |
| `visibleColumnIds` | `string[]` | **Required** | Active column IDs to render |
| `isLoading` | `boolean` | `false` | Table loading state |
| `emptyStateSlot` | `ReactNode` | — | Custom empty state placeholder |
| `className` | `string` | `''` | Wrapper styling |

#### TablePagination Props (`TablePaginationProps`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `totalCount` | `number` | **Required** | Total data count |
| `currentPage` | `number` | **Required** | Current active page (1-based index) |
| `pageSize` | `number` | **Required** | Number of items per page |
| `onPageChange` | `(page: number) => void` | **Required** | Page change callback |
| `onPageSizeChange` | `(pageSize: number) => void` | **Required** | Rows per page change callback |
| `pageSizeOptions` | `number[]` | `[5, 10, 20, 50]` | Selectable page sizes |

#### ColumnManager Props (`ColumnManagerProps<T>`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `Column<T>[]` | **Required** | All table columns definitions |
| `visibleColumnIds` | `string[]` | **Required** | Currently visible column IDs |
| `onToggleColumn` | `(columnId: string) => void` | **Required** | Toggle column visibility callback |

```tsx
import { DataTable } from '@/shared-app/table/ui/DataTable';
import { TablePagination } from '@/shared-app/table/ui/TablePagination';
import { ColumnManager } from '@/shared-app/table/ui/ColumnManager';
import type { Column } from '@/shared-app/table/types';

const columns: Column<Category>[] = [
  { id: 'title', headerName: 'عنوان', field: 'title', sortable: true },
  { id: 'code', headerName: 'کد', field: 'code', sortable: true },
  {
    id: 'actions',
    headerName: 'عملیات',
    sortable: false,
    renderCell: (row) => <ActionButtons category={row} />,
  },
];

// Rendering Table Toolbar & Table
<ColumnManager
  columns={columns}
  visibleColumnIds={visibleColumnIds}
  onToggleColumn={handleToggleColumn}
/>

<DataTable
  columns={columns}
  data={categories}
  keyExtractor={(item) => item.id}
  sortColumn={sortColumn}
  sortDirection={sortDirection}
  onSortChange={handleSortChange}
  visibleColumnIds={visibleColumnIds}
  isLoading={isLoading}
/>

<TablePagination
  totalCount={totalCount}
  currentPage={page}
  pageSize={pageSize}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>
```

---

### 7. `Toast` — Notification Alert

**Path:** `src/shared-app/toast`  
**Imports:**
- UI: `import { Toast } from '@/shared-app/toast/ui/Toast'`
- Logic: `import { useToast } from '@/shared-app/toast/logics/useToast'`
- Types: `import type { ToastProps, ToastType } from '@/shared-app/toast/types'`

#### Props (`ToastProps`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | **Required** | Toast visibility state |
| `message` | `string` | **Required** | Toast message text |
| `onClose` | `() => void` | **Required** | Callback when toast closes or autohides |
| `type` | `'error'` \| `'success'` \| `'warning'` \| `'info'` | `'error'` | Alert severity status |
| `autoHideDuration` | `number` | `5000` | Duration in milliseconds before auto hiding |

```tsx
import { Toast } from '@/shared-app/toast/ui/Toast';

<Toast
  isOpen={toastState.isOpen}
  message={toastState.message}
  type={toastState.type}
  onClose={hideToast}
/>
```

---

## Mandatory Design System Guidelines

1. **Strict FSD Modular Architecture:**  
   Every design system component must consist of three parts inside `src/shared-app/<component>`:
   - `ui/<ComponentName>.tsx` (Pure JSX presentation)
   - `logics/use<ComponentName>.ts` (State hooks & event handlers)
   - `types/index.ts` (TypeScript interfaces & types)

2. **Never Duplicate Components:**  
   Never recreate buttons, inputs, icon buttons, confirm dialogs, sidebars, tables, or toasts inside features, pages, or widgets. Always import from `@/shared-app/<component-folder>/...`.

3. **Responsive Table Behavior:**  
   `DataTable` automatically switches between Desktop HTML `<table>` view (`md` breakpoint and above) and mobile `DataCard` stack view (`< md` breakpoint). Always utilize built-in column definitions and key extractors.

4. **Glassmorphism & Contrast:**  
   All inputs and cards use dark glass surface styling (`rgba(255,255,255,0.08)` / `rgba(0,0,0,0.25)`) with backdrop blur (`blur(12px)` / `blur(24px)`). Maintain high text contrast using `--color-text-primary` (`#ffffff`) and `--color-text-secondary` (`rgba(255,255,255,0.7)`).

