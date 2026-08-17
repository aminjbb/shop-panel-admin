import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  Category,
  CategoryFormData,
  CategoryStats,
  CategoryTreeItem,
} from "@/types/category";
import { mockCategoryService } from "../api/mockCategoryService";
import { useToastStore } from "@/shared-app/designSystem/toast/store";

export type CategoryFormMode = "create" | "edit" | "createChild";

export function useCategories() {
  const [tree, setTree] = useState<CategoryTreeItem[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Filters
  const [search, setSearchState] = useState<string>("");
  const [statusFilter, setStatusFilterState] = useState<"all" | "active" | "inactive">("all");

  // Expand / Collapse
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Modal / Dialog States
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<CategoryFormMode>("create");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [parentForNewChild, setParentForNewChild] = useState<Category | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [categoryDetail, setCategoryDetail] = useState<Category | null>(null);

  // Helper to extract all IDs from tree
  const getAllTreeIds = useCallback((nodes: CategoryTreeItem[]): string[] => {
    const ids: string[] = [];
    const traverse = (items: CategoryTreeItem[]) => {
      for (const item of items) {
        ids.push(item.id);
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      }
    };
    traverse(nodes);
    return ids;
  }, []);

  // Fetch Tree & Flat categories & Stats
  const loadData = useCallback(async (currentSearch = search, currentStatus = statusFilter) => {
    setIsLoading(true);
    try {
      const [treeData, flatData, statsData] = await Promise.all([
        mockCategoryService.getCategoryTree({
          search: currentSearch,
          status: currentStatus,
        }),
        mockCategoryService.getCategories({ status: currentStatus }),
        mockCategoryService.getCategoryStats(),
      ]);

      setTree(treeData);
      setFlatCategories(flatData);
      setStats(statsData);

      // If searching, auto expand all matched branches
      if (currentSearch.trim()) {
        const allIds = getAllTreeIds(treeData);
        setExpandedIds(new Set(allIds));
      } else {
        // By default expand root categories
        const rootIds = treeData.map((item) => item.id);
        setExpandedIds((prev) => {
          if (prev.size === 0) {
            return new Set(rootIds);
          }
          return prev;
        });
      }
    } catch (err) {
      console.error(err);
      useToastStore.getState().error("خطا در دریافت لیست دسته‌بندی‌ها");
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, getAllTreeIds]);

  // Initial load
  useEffect(() => {
    loadData(search, statusFilter);
  }, [search, statusFilter, loadData]);

  // Search updater
  const setSearch = useCallback((query: string) => {
    setSearchState((prev) => {
      if (prev === query) return prev;
      return query;
    });
  }, []);

  // Status Filter updater
  const setStatusFilter = useCallback((status: "all" | "active" | "inactive") => {
    setStatusFilterState((prev) => {
      if (prev === status) return prev;
      return status;
    });
  }, []);

  // Expand / Collapse toggle
  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Expand All
  const expandAll = useCallback(() => {
    const allIds = getAllTreeIds(tree);
    setExpandedIds(new Set(allIds));
    useToastStore.getState().info("تمامی شاخه‌ها باز شدند");
  }, [tree, getAllTreeIds]);

  // Collapse All
  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
    useToastStore.getState().info("تمامی شاخه‌ها بسته شدند");
  }, []);

  // Open Form: Create root category
  const openCreateModal = useCallback(() => {
    setFormMode("create");
    setSelectedCategory(null);
    setParentForNewChild(null);
    setIsFormOpen(true);
  }, []);

  // Open Form: Create child under parent
  const openCreateChildModal = useCallback((parent: Category) => {
    setFormMode("createChild");
    setSelectedCategory(null);
    setParentForNewChild(parent);
    setIsFormOpen(true);
  }, []);

  // Open Form: Edit existing category
  const openEditModal = useCallback((category: Category) => {
    setFormMode("edit");
    setSelectedCategory(category);
    setParentForNewChild(null);
    setIsFormOpen(true);
  }, []);

  // Close Form
  const closeFormModal = useCallback(() => {
    setIsFormOpen(false);
    setSelectedCategory(null);
    setParentForNewChild(null);
  }, []);

  // Save Category (Create / Edit)
  const handleSaveCategory = useCallback(
    async (formData: CategoryFormData, editId?: string) => {
      setIsUpdating(true);
      try {
        if (editId) {
          await mockCategoryService.updateCategory(editId, formData);
          useToastStore.getState().success(`دسته‌بندی "${formData.name}" با موفقیت به‌روزرسانی شد.`, {
            title: "ویرایش دسته‌بندی",
          });
        } else {
          await mockCategoryService.createCategory(formData);
          useToastStore.getState().success(`دسته‌بندی "${formData.name}" با موفقیت ایجاد گردید.`, {
            title: "ایجاد دسته‌بندی جدید",
          });
        }
        closeFormModal();
        await loadData();
      } catch (err: any) {
        useToastStore.getState().error(err.message || "خطا در ذخیره دسته‌بندی", {
          title: "خطای اعتبارسنجی",
        });
      } finally {
        setIsUpdating(false);
      }
    },
    [closeFormModal, loadData]
  );

  // Open Delete Dialog
  const openDeleteDialog = useCallback((category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteOpen(true);
  }, []);

  // Close Delete Dialog
  const closeDeleteDialog = useCallback(() => {
    setIsDeleteOpen(false);
    setCategoryToDelete(null);
  }, []);

  // Handle Delete
  const handleDeleteCategory = useCallback(
    async (id: string, cascadeDelete: boolean) => {
      setIsUpdating(true);
      try {
        const { deletedIds, reassignedIds } = await mockCategoryService.deleteCategory(id, {
          cascadeDelete,
        });

        let msg = `دسته‌بندی با موفقیت حذف شد.`;
        if (cascadeDelete && deletedIds.length > 1) {
          msg = `دسته‌بندی و ${deletedIds.length - 1} زیردسته مرتبط به صورت آبشاری حذف شدند.`;
        } else if (reassignedIds.length > 0) {
          msg = `دسته‌بندی حذف شد و ${reassignedIds.length} زیردسته به سطح والد منتقل گردیدند.`;
        }

        useToastStore.getState().success(msg, { title: "حذف دسته‌بندی" });
        closeDeleteDialog();
        await loadData();
      } catch (err: any) {
        useToastStore.getState().error(err.message || "خطا در حذف دسته‌بندی");
      } finally {
        setIsUpdating(false);
      }
    },
    [closeDeleteDialog, loadData]
  );

  // Toggle Active Status
  const handleToggleStatus = useCallback(
    async (id: string) => {
      try {
        const updated = await mockCategoryService.toggleCategoryStatus(id);
        const statusText = updated.isActive ? "فعال" : "غیرفعال";
        useToastStore.getState().success(`وضعیت دسته‌بندی به "${statusText}" تغییر یافت.`);
        await loadData();
      } catch (err: any) {
        useToastStore.getState().error(err.message || "خطا در تغییر وضعیت");
      }
    },
    [loadData]
  );

  // Reorder
  const handleReorder = useCallback(
    async (orderedIds: string[]) => {
      try {
        await mockCategoryService.reorderCategories(orderedIds);
        useToastStore.getState().success("ترتیب نمایش دسته‌بندی‌ها ذخیره شد.");
        await loadData();
      } catch (err: any) {
        useToastStore.getState().error(err.message || "خطا در تغییر ترتیب");
      }
    },
    [loadData]
  );

  // Detail Drawer
  const openDetailDrawer = useCallback((category: Category) => {
    setCategoryDetail(category);
    setIsDetailOpen(true);
  }, []);

  const closeDetailDrawer = useCallback(() => {
    setIsDetailOpen(false);
    setCategoryDetail(null);
  }, []);

  // Reset Mock Data
  const handleResetDefaults = useCallback(async () => {
    setIsUpdating(true);
    try {
      await mockCategoryService.resetToDefaults();
      useToastStore.getState().success("ساختار و داده‌های ماک دسته‌بندی‌ها به حالت پیش‌فرض بازنشانی شدند.", {
        title: "بازنشانی داده‌ها",
      });
      await loadData();
    } catch (err: any) {
      useToastStore.getState().error("خطا در بازنشانی داده‌ها");
    } finally {
      setIsUpdating(false);
    }
  }, [loadData]);

  // Direct descendant counts calculation helper
  const categoryChildCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of flatCategories) {
      if (cat.parentId) {
        counts[cat.parentId] = (counts[cat.parentId] || 0) + 1;
      }
    }
    return counts;
  }, [flatCategories]);

  return {
    tree,
    flatCategories,
    stats,
    isLoading,
    isUpdating,
    search,
    statusFilter,
    expandedIds,
    categoryChildCounts,
    setSearch,
    setStatusFilter,
    toggleExpand,
    expandAll,
    collapseAll,
    // Modal states & triggers
    isFormOpen,
    formMode,
    selectedCategory,
    parentForNewChild,
    openCreateModal,
    openCreateChildModal,
    openEditModal,
    closeFormModal,
    handleSaveCategory,
    // Delete states & triggers
    isDeleteOpen,
    categoryToDelete,
    openDeleteDialog,
    closeDeleteDialog,
    handleDeleteCategory,
    // Toggle & Reorder
    handleToggleStatus,
    handleReorder,
    // Detail Drawer
    isDetailOpen,
    categoryDetail,
    openDetailDrawer,
    closeDetailDrawer,
    // Reset & Reload
    handleResetDefaults,
    refresh: loadData,
  };
}
