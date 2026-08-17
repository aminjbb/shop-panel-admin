import { useState, useEffect, useCallback, useMemo } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import type {
  HomepageSection,
  HomepageStats,
  SectionType,
  HeroBannerSection,
  FlashDealsSection,
  ProductGridSection,
  BannerGridSection,
} from "@/types/homepage";
import type { Product } from "@/types/product";
import { mockHomepageService } from "../api/mockHomepageService";
import { mockProductService } from "@/features/products/api/mockProductService";
import { useToastStore } from "@/shared-app/designSystem/toast/store";

export function useHomepageBuilder() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [stats, setStats] = useState<HomepageStats | null>(null);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<HomepageSection | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [deleteConfirmSection, setDeleteConfirmSection] = useState<HomepageSection | null>(null);

  // Fetch all layout data, stats, and catalog products
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [layoutData, statsData, productsResp] = await Promise.all([
        mockHomepageService.getHomepageLayout(),
        mockHomepageService.getSectionStats(),
        mockProductService.getProducts({ page: 1, pageSize: 100 }),
      ]);

      setSections(layoutData);
      setStats(statsData);
      setCatalogProducts(productsResp.products || []);
    } catch (err) {
      console.error(err);
      useToastStore.getState().error("خطا در دریافت ساختار صفحه اصلی");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered sections list
  const filteredSections = useMemo(() => {
    return sections.filter((sec) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = sec.title.toLowerCase().includes(q);
        const matchesSubtitle =
          sec.type === "product_grid" &&
          (sec as ProductGridSection).subtitle?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSubtitle) return false;
      }

      // Type Filter
      if (typeFilter !== "all" && sec.type !== typeFilter) {
        return false;
      }

      // Status Filter
      if (statusFilter === "active" && !sec.isActive) return false;
      if (statusFilter === "inactive" && sec.isActive) return false;

      return true;
    });
  }, [sections, searchQuery, typeFilter, statusFilter]);

  // Toggle active status
  const handleToggleActive = useCallback(
    async (id: string) => {
      try {
        const updated = await mockHomepageService.toggleSectionActive(id);
        setSections((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isActive: updated.isActive } : s))
        );
        const statData = await mockHomepageService.getSectionStats();
        setStats(statData);

        useToastStore.getState().success(
          `سکشن «${updated.title}» ${updated.isActive ? "فعال" : "غیرفعال"} شد.`
        );
      } catch (err: any) {
        useToastStore.getState().error(err.message || "خطا در تغییر وضعیت سکشن");
      }
    },
    []
  );

  // Move Section Up
  const handleMoveUp = useCallback(
    async (currentIndex: number) => {
      if (currentIndex <= 0) return;

      const newSections = [...sections];
      const temp = newSections[currentIndex];
      newSections[currentIndex] = newSections[currentIndex - 1];
      newSections[currentIndex - 1] = temp;

      // Update local state immediately for instant feedback
      const orderedIds = newSections.map((s) => s.id);
      setSections(newSections.map((s, idx) => ({ ...s, displayOrder: idx + 1 })));

      try {
        await mockHomepageService.reorderSections(orderedIds);
      } catch (err: any) {
        useToastStore.getState().error("خطا در ذخیره ترتیب جدید");
        loadData();
      }
    },
    [sections, loadData]
  );

  // Move Section Down
  const handleMoveDown = useCallback(
    async (currentIndex: number) => {
      if (currentIndex >= sections.length - 1) return;

      const newSections = [...sections];
      const temp = newSections[currentIndex];
      newSections[currentIndex] = newSections[currentIndex + 1];
      newSections[currentIndex + 1] = temp;

      const orderedIds = newSections.map((s) => s.id);
      setSections(newSections.map((s, idx) => ({ ...s, displayOrder: idx + 1 })));

      try {
        await mockHomepageService.reorderSections(orderedIds);
      } catch (err: any) {
        useToastStore.getState().error("خطا در ذخیره ترتیب جدید");
        loadData();
      }
    },
    [sections, loadData]
  );

  // Drag & Drop visual reorder handler
  const handleReorder = useCallback(
    async (activeId: string, overId: string) => {
      if (!activeId || !overId || activeId === overId) return;

      const oldIndex = sections.findIndex((s) => s.id === activeId);
      const newIndex = sections.findIndex((s) => s.id === overId);
      if (oldIndex === -1 || newIndex === -1) return;

      const newSections = arrayMove(sections, oldIndex, newIndex).map(
        (sec, idx) => ({
          ...sec,
          displayOrder: idx + 1,
        })
      );

      // Immediate optimistic update
      setSections(newSections);

      try {
        const orderedIds = newSections.map((s) => s.id);
        await mockHomepageService.reorderSections(orderedIds);
        useToastStore.getState().success("ترتیب سکشن‌ها با کشیدن و رها کردن به‌روزرسانی شد.", {
          title: "تغییر چیدمان",
        });
      } catch (err: any) {
        console.error(err);
        useToastStore.getState().error("خطا در ذخیره چیدمان جدید");
        loadData();
      }
    },
    [sections, loadData]
  );

  // Open Edit Config Drawer
  const openConfigDrawer = useCallback((section: HomepageSection) => {
    setSelectedSection(section);
    setIsConfigDrawerOpen(true);
  }, []);

  const closeConfigDrawer = useCallback(() => {
    setIsConfigDrawerOpen(false);
    setSelectedSection(null);
  }, []);

  // Save / Update Section
  const handleSaveSection = useCallback(
    async (updatedSection: HomepageSection) => {
      setIsUpdating(true);
      try {
        await mockHomepageService.updateSection(updatedSection.id, updatedSection);
        useToastStore.getState().success(
          `تنظیمات سکشن «${updatedSection.title}» با موفقیت ذخیره شد.`,
          { title: "ذخیره تغییرات" }
        );
        closeConfigDrawer();
        await loadData();
      } catch (err: any) {
        useToastStore.getState().error(err.message || "خطا در ذخیره تنظیمات سکشن");
      } finally {
        setIsUpdating(false);
      }
    },
    [closeConfigDrawer, loadData]
  );

  // Add new section
  const handleAddSection = useCallback(
    async (type: SectionType, title?: string) => {
      setIsUpdating(true);
      try {
        const created = await mockHomepageService.addSection({
          type,
          title: title || undefined,
          isActive: true,
        });

        useToastStore.getState().success(
          `سکشن جدید «${created.title}» با موفقیت به صفحه اصلی اضافه شد.`,
          { title: "افزودن سکشن" }
        );
        setIsAddModalOpen(false);
        await loadData();

        // Immediately open config drawer for user to customize
        openConfigDrawer(created);
      } catch (err: any) {
        useToastStore.getState().error(err.message || "خطا در افزودن سکشن");
      } finally {
        setIsUpdating(false);
      }
    },
    [loadData, openConfigDrawer]
  );

  // Delete Section
  const handleDeleteSection = useCallback(
    async (id: string) => {
      setIsUpdating(true);
      try {
        await mockHomepageService.deleteSection(id);
        useToastStore.getState().success("سکشن با موفقیت از صفحه اصلی حذف شد.", {
          title: "حذف سکشن",
        });
        setDeleteConfirmSection(null);
        await loadData();
      } catch (err: any) {
        useToastStore.getState().error(err.message || "خطا در حذف سکشن");
      } finally {
        setIsUpdating(false);
      }
    },
    [loadData]
  );

  // Reset to default layout
  const handleResetDefaults = useCallback(async () => {
    setIsUpdating(true);
    try {
      await mockHomepageService.resetToDefaults();
      useToastStore.getState().success(
        "چیدمان صفحه اصلی و بنرها به ساختار پیش‌فرض بازنشانی گردید.",
        { title: "بازنشانی چیدمان" }
      );
      await loadData();
    } catch (err: any) {
      useToastStore.getState().error("خطا در بازنشانی داده‌ها");
    } finally {
      setIsUpdating(false);
    }
  }, [loadData]);

  return {
    sections,
    filteredSections,
    stats,
    catalogProducts,
    isLoading,
    isUpdating,
    // Filters
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    // Actions
    handleToggleActive,
    handleMoveUp,
    handleMoveDown,
    handleReorder,
    handleAddSection,
    handleSaveSection,
    handleDeleteSection,
    handleResetDefaults,
    // Modal states
    isAddModalOpen,
    setIsAddModalOpen,
    isConfigDrawerOpen,
    selectedSection,
    openConfigDrawer,
    closeConfigDrawer,
    isPreviewOpen,
    setIsPreviewOpen,
    deleteConfirmSection,
    setDeleteConfirmSection,
    refresh: loadData,
  };
}
