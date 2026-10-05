import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/config/api";
import { categoryApi } from "@/entities/category";
import { useToastStore } from "@/shared-app/designSystem/toast/store";
import {
  toCategoryStatsViewModel,
  toCategoryTreeViewModel,
  toCategoryViewModel,
  toCreateCategoryInput,
  toUpdateCategoryInput,
} from "../models/categoryMapper";
import type { Category, CategoryFormData, CategoryTreeItem } from "../types";

export type CategoryFormMode = "create" | "edit" | "createChild";
type StatusFilter = "all" | "active" | "inactive";

const categoryKeys = {
  all: ["categories"] as const,
  list: (status?: boolean) => ["categories", "list", { status }] as const,
  tree: (search: string, status?: boolean) => ["categories", "tree", { search, status }] as const,
  stats: ["categories", "stats"] as const,
  options: ["categories", "product-options"] as const,
  detail: (id: string) => ["categories", "detail", id] as const,
};

function collectTreeIds(nodes: CategoryTreeItem[]): string[] {
  return nodes.flatMap((node) => [node.id, ...collectTreeIds(node.children)]);
}

function statusToWire(status: StatusFilter): boolean | undefined {
  return status === "all" ? undefined : status === "active";
}

function categoryErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) return error instanceof Error ? error.message : fallback;
  const messages: Partial<Record<string, string>> = {
    slug_taken: "این اسلاگ قبلاً برای دسته‌بندی دیگری استفاده شده است.",
    invalid_parent: "والد انتخاب‌شده نامعتبر است یا یک حلقه در ساختار ایجاد می‌کند.",
    invalid_attribute: "ساختار ویژگی‌ها معتبر نیست؛ گزینه‌های ویژگی انتخابی را بررسی کنید.",
  };
  const reason = typeof error.details.reason === "string" ? error.details.reason : "";
  return messages[reason] ??
    (error.requestId ? `${fallback} (شناسه پیگیری: ${error.requestId})` : fallback);
}

export function useCategories() {
  const queryClient = useQueryClient();
  const [search, setSearchState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilterState] = useState<StatusFilter>("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CategoryFormMode>("create");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSnapshot, setSelectedSnapshot] = useState<Category | null>(null);
  const [parentForNewChild, setParentForNewChild] = useState<Category | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailCategoryId, setDetailCategoryId] = useState<string | null>(null);
  const [detailSnapshot, setDetailSnapshot] = useState<Category | null>(null);
  const wireStatus = statusToWire(statusFilter);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  const treeQuery = useQuery({
    queryKey: categoryKeys.tree(debouncedSearch, wireStatus),
    queryFn: ({ signal }) => categoryApi.tree({ search: debouncedSearch.trim() || undefined, status: wireStatus }, signal),
  });
  const listQuery = useQuery({
    queryKey: categoryKeys.list(wireStatus),
    queryFn: ({ signal }) => categoryApi.list({ status: wireStatus, sortBy: "sort_order_asc" }, signal),
  });
  const statsQuery = useQuery({
    queryKey: categoryKeys.stats,
    queryFn: ({ signal }) => categoryApi.stats(signal),
  });
  const selectedDetailQuery = useQuery({
    queryKey: categoryKeys.detail(selectedCategoryId ?? "none"),
    queryFn: ({ signal }) => categoryApi.get(selectedCategoryId as string, signal),
    enabled: isFormOpen && formMode === "edit" && Boolean(selectedCategoryId),
  });
  const drawerDetailQuery = useQuery({
    queryKey: categoryKeys.detail(detailCategoryId ?? "none"),
    queryFn: ({ signal }) => categoryApi.get(detailCategoryId as string, signal),
    enabled: isDetailOpen && Boolean(detailCategoryId),
  });

  const tree = useMemo(
    () => (treeQuery.data ?? []).map(toCategoryTreeViewModel),
    [treeQuery.data],
  );
  const flatCategories = useMemo(
    () => (listQuery.data ?? []).map(toCategoryViewModel),
    [listQuery.data],
  );
  const stats = statsQuery.data ? toCategoryStatsViewModel(statsQuery.data) : null;
  const selectedCategory = selectedDetailQuery.data
    ? toCategoryViewModel(selectedDetailQuery.data)
    : selectedSnapshot;
  const categoryDetail = drawerDetailQuery.data
    ? toCategoryViewModel(drawerDetailQuery.data)
    : detailSnapshot;

  useEffect(() => {
    if (!tree.length) return;
    if (debouncedSearch.trim()) setExpandedIds(new Set(collectTreeIds(tree)));
    else setExpandedIds((current) => current.size ? current : new Set(tree.map((node) => node.id)));
  }, [debouncedSearch, tree]);

  useEffect(() => {
    const error = treeQuery.error ?? listQuery.error ?? statsQuery.error;
    if (error) useToastStore.error(categoryErrorMessage(error, "خطا در دریافت دسته‌بندی‌ها"));
  }, [listQuery.error, statsQuery.error, treeQuery.error]);

  const invalidateCategories = () => Promise.all([
    queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
    queryClient.invalidateQueries({ queryKey: categoryKeys.options }),
    queryClient.invalidateQueries({ queryKey: ["products", "list"] }),
  ]);

  const saveMutation = useMutation({
    mutationFn: async ({ formData, editId }: { formData: CategoryFormData; editId?: string }) => {
      const availability = await categoryApi.checkSlug({ slug: formData.slug.trim(), excludeId: editId });
      if (!availability.available) throw new Error("این اسلاگ قبلاً برای دسته‌بندی دیگری استفاده شده است.");
      return editId
        ? categoryApi.update(editId, toUpdateCategoryInput(formData))
        : categoryApi.create(toCreateCategoryInput(formData));
    },
    onSuccess: async (category, variables) => {
      queryClient.setQueryData(categoryKeys.detail(category.id), category);
      await invalidateCategories();
      useToastStore.success(
        variables.editId
          ? `دسته‌بندی «${variables.formData.name}» با موفقیت به‌روزرسانی شد.`
          : `دسته‌بندی «${variables.formData.name}» با موفقیت ایجاد شد.`,
      );
      setIsFormOpen(false);
      setSelectedCategoryId(null);
      setSelectedSnapshot(null);
      setParentForNewChild(null);
    },
    onError: (error) => useToastStore.error(categoryErrorMessage(error, "خطا در ذخیره دسته‌بندی")),
  });

  const archiveMutation = useMutation({
    mutationFn: ({ id, cascadeDelete }: { id: string; cascadeDelete: boolean }) =>
      categoryApi.archive({ categoryId: id, cascadeDelete }),
    onSuccess: async ({ deletedIds, reassignedIds }, { cascadeDelete }) => {
      await invalidateCategories();
      const message = cascadeDelete && deletedIds.length > 1
        ? `دسته‌بندی و ${deletedIds.length - 1} زیردسته آرشیو شدند.`
        : reassignedIds.length
          ? `دسته‌بندی آرشیو شد و ${reassignedIds.length} زیردسته منتقل شدند.`
          : "دسته‌بندی با موفقیت آرشیو شد.";
      useToastStore.success(message);
      setIsDeleteOpen(false);
      setCategoryToDelete(null);
    },
    onError: (error) => useToastStore.error(categoryErrorMessage(error, "خطا در حذف دسته‌بندی")),
  });

  const toggleMutation = useMutation({
    mutationFn: (categoryId: string) => categoryApi.toggleStatus(categoryId),
    onSuccess: async (category) => {
      queryClient.setQueryData(categoryKeys.detail(category.id), category);
      await invalidateCategories();
      useToastStore.success(`وضعیت دسته‌بندی به «${category.isActive ? "فعال" : "غیرفعال"}» تغییر یافت.`);
    },
    onError: (error) => useToastStore.error(categoryErrorMessage(error, "خطا در تغییر وضعیت")),
  });

  const reorderMutation = useMutation({
    mutationFn: (orderedIds: string[]) => {
      if (!orderedIds.length) throw new Error("حداقل یک دسته‌بندی برای مرتب‌سازی لازم است.");
      return categoryApi.reorder({ orderedIds: orderedIds as [string, ...string[]] });
    },
    onSuccess: async () => {
      await invalidateCategories();
      useToastStore.success("ترتیب نمایش دسته‌بندی‌ها ذخیره شد.");
    },
    onError: (error) => useToastStore.error(categoryErrorMessage(error, "خطا در تغییر ترتیب")),
  });

  const closeFormModal = () => {
    setIsFormOpen(false);
    setSelectedCategoryId(null);
    setSelectedSnapshot(null);
    setParentForNewChild(null);
  };

  const categoryChildCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    flatCategories.forEach((category) => {
      if (category.parentId) counts[category.parentId] = (counts[category.parentId] ?? 0) + 1;
    });
    return counts;
  }, [flatCategories]);
  const error = treeQuery.error ?? listQuery.error ?? statsQuery.error;

  return {
    tree,
    flatCategories,
    stats,
    isLoading: treeQuery.isLoading || listQuery.isLoading || statsQuery.isLoading,
    isUpdating: saveMutation.isPending || archiveMutation.isPending || toggleMutation.isPending || reorderMutation.isPending,
    error: error ? categoryErrorMessage(error, "خطا در دریافت دسته‌بندی‌ها") : null,
    search,
    statusFilter,
    expandedIds,
    categoryChildCounts,
    setSearch: setSearchState,
    setStatusFilter: setStatusFilterState,
    toggleExpand: (id: string) => setExpandedIds((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    }),
    expandAll: () => setExpandedIds(new Set(collectTreeIds(tree))),
    collapseAll: () => setExpandedIds(new Set()),
    isFormOpen,
    formMode,
    selectedCategory,
    parentForNewChild,
    openCreateModal: () => { setFormMode("create"); setSelectedCategoryId(null); setSelectedSnapshot(null); setParentForNewChild(null); setIsFormOpen(true); },
    openCreateChildModal: (parent: Category) => { setFormMode("createChild"); setParentForNewChild(parent); setIsFormOpen(true); },
    openEditModal: (category: Category) => { setFormMode("edit"); setSelectedCategoryId(category.id); setSelectedSnapshot(category); setIsFormOpen(true); },
    closeFormModal,
    handleSaveCategory: (formData: CategoryFormData, editId?: string) => saveMutation.mutateAsync({ formData, editId }).then(() => undefined),
    isDeleteOpen,
    categoryToDelete,
    openDeleteDialog: (category: Category) => { setCategoryToDelete(category); setIsDeleteOpen(true); },
    closeDeleteDialog: () => { setIsDeleteOpen(false); setCategoryToDelete(null); },
    handleDeleteCategory: (id: string, cascadeDelete: boolean) => archiveMutation.mutateAsync({ id, cascadeDelete }).then(() => undefined),
    handleToggleStatus: (id: string) => toggleMutation.mutateAsync(id).then(() => undefined),
    handleReorder: (orderedIds: string[]) => reorderMutation.mutateAsync(orderedIds).then(() => undefined),
    isDetailOpen,
    categoryDetail,
    openDetailDrawer: (category: Category) => { setDetailCategoryId(category.id); setDetailSnapshot(category); setIsDetailOpen(true); },
    closeDetailDrawer: () => { setIsDetailOpen(false); setDetailCategoryId(null); setDetailSnapshot(null); },
    refresh: () => Promise.all([treeQuery.refetch(), listQuery.refetch(), statsQuery.refetch()]),
  };
}
