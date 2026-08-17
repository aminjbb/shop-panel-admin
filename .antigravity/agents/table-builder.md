# Table Builder Agent

> **Version:** 2.0.0 | **Updated:** 2026-08-13
> **Trigger:** User asks to build a list page, table page, or management screen.

---

## Purpose

Generate a complete FSD-compliant table/list page using `src/shared-app` components:
- `DataTable` with typed columns, column sorting, and responsive mobile stack view
- `ColumnManager` popover for column visibility toggles
- `TablePagination` for 1-indexed page and page-size navigation
- `Button` for primary page actions (e.g. Add New)
- `IconButton` with tooltips for table row actions (Edit, Delete, View)
- All 4 UI states: loading spinner, error state, empty state slot, and data table

---

## Step 0 — Read available components

Before generating, consult:
- `.antigravity/instructions/Design-System-Instruction.md` — shared component reference (`DataTable`, `TablePagination`, `ColumnManager`, `Button`, `IconButton`)
- `src/index.css` — CSS color and glassmorphism tokens

---

## Step 1 — Determine entity name and operations

Identify from the user's request:
- **Entity name** (e.g. `category`, `user`, `tenant`)
- **List operations** (view, edit, delete, activate, etc.)
- **Filter/search** — what fields are searchable
- **Page actions** — add new, export, etc.

---

## Step 2 — Generate FSD files

### Files to create:

```
pages/<EntityName>Management.tsx
widgets/<entityName>Management/
  ui/<EntityName>Management.tsx        ← root composer
  ui/<EntityName>Table.tsx              ← table toolbar (Search + ColumnManager + Button), DataTable, TablePagination
  models/use<EntityName>ManagementModel.ts
  types/index.ts
```

**UI decomposition is mandatory**: root `ui/<EntityName>Management.tsx` only renders the shell and composes `<EntityName>Table`. Never inline the table/loading/error/empty markup directly in the root file.

If API doesn't exist yet, also create:
```
entities/<entityName>/api/<entityName>Api.ts
entities/<entityName>/types/index.ts
entities/<entityName>/models/use<EntityName>List.ts
```

---

## Step 3 — File templates

### `pages/<EntityName>Management.tsx`
```tsx
import { lazy, Suspense } from "react";

const <EntityName>Management = lazy(
  () => import("@/widgets/<entityName>Management/ui/<EntityName>Management")
);

const <EntityName>ManagementPage = () => (
  <Suspense fallback={null}>
    <<EntityName>Management />
  </Suspense>
);

export default <EntityName>ManagementPage;
```

---

### `widgets/<entityName>Management/types/index.ts`
```ts
import type { Column, SortDirection } from "@/shared-app/table/types";
import type { <EntityName> } from "@/entities/<entityName>/types";

export interface <EntityName>ManagementFilters {
  search: string;
  page: number;
  pageSize: number;
}

export interface <EntityName>TableProps {
  items: <EntityName>[];
  columns: Column<<EntityName>>[];
  sortColumn: string | null;
  sortDirection: SortDirection;
  onSortChange: (columnId: string) => void;
  visibleColumnIds: string[];
  onToggleColumn: (columnId: string) => void;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDeleteCategory: (item: <EntityName>) => void;
  onCreateCategoryClick: () => void;
  isLoading?: boolean;
}
```

---

### `entities/<entityName>/types/index.ts`
```ts
export interface <EntityName> {
  id: string;
  title: string;
  code: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface <EntityName>ListResponse {
  data: <EntityName>[];
  total: number;
  page: number;
  pageSize: number;
}
```

---

### `entities/<entityName>/api/<entityName>Api.ts`
```ts
import { get, post, put, del } from "@/config/api";
import type { <EntityName>, <EntityName>ListResponse } from "../types";

const BASE = "/<entity-endpoint>";

export const <entityName>Api = {
  getList: (params?: Record<string, unknown>) =>
    get<<EntityName>ListResponse>(BASE, { params }),
  getById: (id: string) =>
    get<<EntityName>>(`${BASE}/${id}`),
  create: (body: unknown) =>
    post<<EntityName>>(BASE, body),
  update: (id: string, body: unknown) =>
    put<<EntityName>>(`${BASE}/${id}`, body),
  remove: (id: string) =>
    del<void>(`${BASE}/${id}`),
};
```

---

### `entities/<entityName>/models/use<EntityName>List.ts`
```ts
import { useQuery } from "@tanstack/react-query";
import { <entityName>Api } from "../api/<entityName>Api";
import type { <EntityName>ManagementFilters } from "@/widgets/<entityName>Management/types";

export const use<EntityName>List = (filters: <EntityName>ManagementFilters) =>
  useQuery({
    queryKey: ["<entityName>", "list", filters],
    queryFn: () => <entityName>Api.getList(filters),
  });
```

---

### `widgets/<entityName>Management/models/use<EntityName>ManagementModel.ts`
```ts
import { useState, useCallback } from "react";
import type { Column, SortDirection } from "@/shared-app/table/types";
import type { <EntityName> } from "@/entities/<entityName>/types";
import { use<EntityName>List } from "@/entities/<entityName>/models/use<EntityName>List";

export const use<EntityName>ManagementModel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [sortColumn, setSortColumn] = useState<string | null>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const initialColumns: Column<<EntityName>>[] = [
    { id: "title", headerName: "عنوان", field: "title", sortable: true },
    { id: "code", headerName: "کد", field: "code", sortable: true },
    { id: "status", headerName: "وضعیت", field: "status", sortable: true },
    { id: "actions", headerName: "عملیات", sortable: false },
  ];

  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(
    initialColumns.map((col) => col.id)
  );

  const { data, isLoading } = use<EntityName>List({
    search: searchQuery,
    page: currentPage,
    pageSize,
  });

  const handleToggleColumn = useCallback((columnId: string) => {
    setVisibleColumnIds((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  }, []);

  const handleSortChange = useCallback((columnId: string) => {
    setSortColumn((prevCol) => {
      if (prevCol !== columnId) {
        setSortDirection("asc");
        return columnId;
      }
      if (sortDirection === "asc") {
        setSortDirection("desc");
        return columnId;
      }
      setSortDirection(null);
      return null;
    });
  }, [sortDirection]);

  return {
    items: data?.data ?? [],
    totalCount: data?.total ?? 0,
    isLoading,
    columns: initialColumns,
    sortColumn,
    sortDirection,
    onSortChange: handleSortChange,
    visibleColumnIds,
    onToggleColumn: handleToggleColumn,
    currentPage,
    pageSize,
    onPageChange: setCurrentPage,
    onPageSizeChange: setPageSize,
    searchQuery,
    onSearchChange: setSearchQuery,
  };
};
```

---

### `widgets/<entityName>Management/ui/<EntityName>Management.tsx` — root composer
```tsx
import { use<EntityName>ManagementModel } from "../models/use<EntityName>ManagementModel";
import { <EntityName>Table } from "./<EntityName>Table";

export const <EntityName>Management = () => {
  const modelProps = use<EntityName>ManagementModel();

  return (
    <div className="p-6 space-y-6">
      <<EntityName>Table
        {...modelProps}
        onDeleteCategory={(item) => console.log("Delete", item)}
        onCreateCategoryClick={() => console.log("Create new")}
      />
    </div>
  );
};

export default <EntityName>Management;
```

---

### `widgets/<entityName>Management/ui/<EntityName>Table.tsx` — sub-component
```tsx
import React from "react";
import { Search, Plus, Trash2, FolderTree } from "lucide-react";
import { DataTable } from "@/shared-app/table/ui/DataTable";
import { TablePagination } from "@/shared-app/table/ui/TablePagination";
import { ColumnManager } from "@/shared-app/table/ui/ColumnManager";
import { Button } from "@/shared-app/button/ui/Button";
import { IconButton } from "@/shared-app/iconButton/ui/IconButton";
import type { <EntityName> } from "@/entities/<entityName>/types";
import type { <EntityName>TableProps } from "../types";

export const <EntityName>Table: React.FC<<EntityName>TableProps> = (props) => {
  const {
    items,
    columns,
    sortColumn,
    sortDirection,
    onSortChange,
    visibleColumnIds,
    onToggleColumn,
    currentPage,
    pageSize,
    totalCount,
    onPageChange,
    onPageSizeChange,
    searchQuery,
    onSearchChange,
    onDeleteCategory,
    onCreateCategoryClick,
    isLoading,
  } = props;

  const tableColumns = columns.map((col) => {
    if (col.id === "actions") {
      return {
        ...col,
        renderCell: (row: <EntityName>) => (
          <div className="flex items-center gap-1">
            <IconButton
              onClick={() => onDeleteCategory(row)}
              size="small"
              variant="ghost"
              ariaLabel="حذف"
              tooltipText="حذف آیتم"
            >
              <Trash2 className="w-4 h-4 text-rose-400 hover:text-rose-300" />
            </IconButton>
          </div>
        ),
      };
    }
    return col;
  });

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
        <FolderTree className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-white text-base">هیچ آیتمی یافت نشد</h4>
        <p className="text-xs text-white/60 max-w-sm">
          {searchQuery
            ? "با عبارت جستجو شده هیچ آیتمی مطابقت ندارد."
            : "هنوز هیچ داده‌ای ثبت نشده است."}
        </p>
      </div>
      <Button
        variant="primary"
        size="small"
        onClick={onCreateCategoryClick}
        startIcon={<Plus className="w-4 h-4" />}
      >
        ایجاد اولین آیتم
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجو در اطلاعات..."
            className="w-full bg-black/30 border border-white/15 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 transition-all backdrop-blur-md"
          />
          <Search className="w-4 h-4 text-white/40 absolute right-3.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <ColumnManager
            columns={tableColumns}
            visibleColumnIds={visibleColumnIds}
            onToggleColumn={onToggleColumn}
          />

          <Button
            variant="primary"
            size="medium"
            onClick={onCreateCategoryClick}
            startIcon={<Plus className="w-4 h-4" />}
          >
            ایجاد آیتم جدید
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={tableColumns}
        data={items}
        keyExtractor={(row) => row.id}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={onSortChange}
        visibleColumnIds={visibleColumnIds}
        isLoading={isLoading}
        emptyStateSlot={emptyState}
      />

      {/* Pagination Footer */}
      {totalCount > 0 && (
        <TablePagination
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
};

export default <EntityName>Table;
```

---

## Step 4 — Checklist before finishing

- [ ] All UI states supported (`isLoading` spinner, `emptyStateSlot`, data table)
- [ ] Row action buttons use `<IconButton variant="ghost" size="small" ariaLabel="..." tooltipText="..." />`
- [ ] Primary page buttons use `<Button variant="primary" size="medium" startIcon={<Plus />} />`
- [ ] `<ColumnManager />` popover integrated for column visibility toggles
- [ ] `<TablePagination />` integrated with `totalCount`, `currentPage`, and `pageSize`
- [ ] `<DataTable />` used with `keyExtractor`, `sortColumn`, `sortDirection`, `onSortChange`
- [ ] Types in `widgets/<name>/types/index.ts`
- [ ] UI decomposed into `<EntityName>Management.tsx` (root composer) and `<EntityName>Table.tsx`

