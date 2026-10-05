import { useCallback, useMemo, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { homepageApi } from "@/entities/homepage";
import { productApi, type Product } from "@/entities/product";
import type { HomepageSection, ProductGridSection, SectionType } from "@/types/homepage";
import { useToastStore } from "@/shared-app/designSystem/toast/store";
import { useAuth } from "@/features/auth/context/AuthContext";
import { createHomepageSectionInput, toHomepageSectionInput, toHomepageSectionViewModel } from "../models/homepageMapper";

const homepageKeys = { all: ["homepage"] as const, sections: ["homepage", "sections"] as const, stats: ["homepage", "stats"] as const };

export function useHomepageBuilder() {
  const { user } = useAuth();
  const canManage = user?.role === "super_admin";
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<HomepageSection | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [deleteConfirmSection, setDeleteConfirmSection] = useState<HomepageSection | null>(null);

  const sectionsQuery = useQuery({ queryKey: homepageKeys.sections, queryFn: ({ signal }) => homepageApi.listSections(signal) });
  const statsQuery = useQuery({ queryKey: homepageKeys.stats, queryFn: ({ signal }) => homepageApi.getStats(signal) });
  const productsQuery = useQuery({ queryKey: ["products", "homepage-options"], queryFn: ({ signal }) => productApi.list({ page: 1, pageSize: 100 }, signal) });
  const sections = useMemo(() => (sectionsQuery.data ?? []).map(toHomepageSectionViewModel), [sectionsQuery.data]);
  const catalogProducts: Product[] = productsQuery.data?.products ?? [];
  const invalidate = () => queryClient.invalidateQueries({ queryKey: homepageKeys.all });

  const toggleMutation = useMutation({ mutationFn: (id: string) => homepageApi.toggleSection(id), retry: false, onSuccess: async (section) => { await invalidate(); useToastStore.getState().success(`سکشن «${section.title ?? "بدون عنوان"}» ${section.isActive ? "فعال" : "غیرفعال"} شد.`); }, onError: () => useToastStore.getState().error("خطا در تغییر وضعیت سکشن") });
  const reorderMutation = useMutation({ mutationFn: (orderedIds: string[]) => homepageApi.reorderSections({ orderedIds }), retry: false, onSuccess: invalidate, onError: () => useToastStore.getState().error("خطا در ذخیره ترتیب جدید") });
  const saveMutation = useMutation({ mutationFn: (section: HomepageSection) => homepageApi.replaceSection(section.id, toHomepageSectionInput(section)), retry: false, onSuccess: async () => { await invalidate(); setIsConfigDrawerOpen(false); setSelectedSection(null); useToastStore.getState().success("تنظیمات سکشن ذخیره شد."); }, onError: () => useToastStore.getState().error("خطا در ذخیره تنظیمات سکشن") });
  const createMutation = useMutation({ mutationFn: ({ type, title }: { type: SectionType; title?: string }) => homepageApi.createSection(createHomepageSectionInput(type, title || "سکشن جدید", sections.length + 1)), retry: false, onSuccess: async (created) => { await invalidate(); setIsAddModalOpen(false); setSelectedSection(toHomepageSectionViewModel(created)); setIsConfigDrawerOpen(true); useToastStore.getState().success("سکشن جدید ایجاد شد."); }, onError: () => useToastStore.getState().error("خطا در افزودن سکشن") });
  const archiveMutation = useMutation({ mutationFn: (id: string) => homepageApi.archiveSection(id), retry: false, onSuccess: async () => { await invalidate(); setDeleteConfirmSection(null); useToastStore.getState().success("سکشن آرشیو شد."); }, onError: () => useToastStore.getState().error("خطا در حذف سکشن") });
  const publishMutation = useMutation({ mutationFn: () => homepageApi.publish(), retry: false, onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["storefront", "homepage"] }); useToastStore.getState().success("چیدمان صفحه اصلی منتشر شد."); }, onError: () => useToastStore.getState().error("خطا در انتشار صفحه اصلی") });

  const filteredSections = useMemo(() => sections.filter((section) => {
    const query = searchQuery.trim().toLowerCase();
    const subtitle = section.type === "product_grid" ? (section as ProductGridSection).subtitle ?? "" : "";
    if (query && !section.title.toLowerCase().includes(query) && !subtitle.toLowerCase().includes(query)) return false;
    if (typeFilter !== "all" && section.type !== typeFilter) return false;
    if (statusFilter === "active" && !section.isActive) return false;
    if (statusFilter === "inactive" && section.isActive) return false;
    return true;
  }), [searchQuery, sections, statusFilter, typeFilter]);

  const reorder = useCallback(async (next: HomepageSection[]) => {
    queryClient.setQueryData(homepageKeys.sections, (current: typeof sectionsQuery.data) => current ? [...current].sort((a, b) => next.findIndex((item) => item.id === a.id) - next.findIndex((item) => item.id === b.id)) : current);
    await reorderMutation.mutateAsync(next.map((section) => section.id));
  }, [queryClient, reorderMutation, sectionsQuery.data]);

  const move = async (index: number, target: number) => {
    if (target < 0 || target >= sections.length) return;
    await reorder(arrayMove(sections, index, target));
  };
  const isUpdating = toggleMutation.isPending || reorderMutation.isPending || saveMutation.isPending || createMutation.isPending || archiveMutation.isPending || publishMutation.isPending;

  return {
    canManage,
    sections,
    filteredSections,
    stats: statsQuery.data ?? null,
    catalogProducts,
    isLoading: sectionsQuery.isLoading || statsQuery.isLoading || productsQuery.isLoading,
    isUpdating,
    searchQuery, setSearchQuery, typeFilter, setTypeFilter, statusFilter, setStatusFilter,
    handleToggleActive: (id: string) => toggleMutation.mutateAsync(id).then(() => undefined),
    handleMoveUp: (index: number) => move(index, index - 1),
    handleMoveDown: (index: number) => move(index, index + 1),
    handleReorder: (activeId: string, overId: string) => { const from = sections.findIndex((item) => item.id === activeId); const to = sections.findIndex((item) => item.id === overId); return from < 0 || to < 0 ? Promise.resolve() : reorder(arrayMove(sections, from, to)); },
    handleAddSection: (type: SectionType, title?: string) => createMutation.mutateAsync({ type, title }).then(() => undefined),
    handleSaveSection: (section: HomepageSection) => saveMutation.mutateAsync(section).then(() => undefined),
    handleDeleteSection: (id: string) => archiveMutation.mutateAsync(id).then(() => undefined),
    handlePublish: () => publishMutation.mutateAsync().then(() => undefined),
    isAddModalOpen, setIsAddModalOpen, isConfigDrawerOpen, selectedSection,
    openConfigDrawer: (section: HomepageSection) => { setSelectedSection(section); setIsConfigDrawerOpen(true); },
    closeConfigDrawer: () => { setSelectedSection(null); setIsConfigDrawerOpen(false); },
    isPreviewOpen, setIsPreviewOpen, deleteConfirmSection, setDeleteConfirmSection,
    refresh: () => Promise.all([sectionsQuery.refetch(), statsQuery.refetch(), productsQuery.refetch()]),
  };
}
