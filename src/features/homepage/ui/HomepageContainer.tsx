import React from "react";
import { useHomepageBuilder } from "../hooks/useHomepageBuilder";
import HomepageStatsCards from "./HomepageStatsCards";
import HomepageActionBar from "./HomepageActionBar";
import SectionListDesktop from "./SectionListDesktop";
import SectionListMobile from "./SectionListMobile";
import AddSectionModal from "./AddSectionModal";
import SectionConfigDrawer from "./SectionConfigDrawer";
import LivePreviewDrawer from "./LivePreviewDrawer";
import SectionDeleteDialog from "./SectionDeleteDialog";
import EmptyState from "@/shared-app/emptyState";
import { LayoutTemplate, Plus, RotateCcw } from "lucide-react";
import EButton from "@/shared-app/designSystem/button";

export const HomepageContainer: React.FC = () => {
  const {
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
  } = useHomepageBuilder();

  return (
    <div className="space-y-6">
      {/* 1. Statistics Cards */}
      <HomepageStatsCards stats={stats} isLoading={isLoading} />

      {/* 2. Action Bar & Filters */}
      <HomepageActionBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenPreview={() => setIsPreviewOpen(true)}
        onResetDefaults={handleResetDefaults}
        isUpdating={isUpdating}
      />

      {/* 3. Sections Content List / Table */}
      {isLoading ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">در حال بارگذاری چیدمان صفحه اصلی...</p>
        </div>
      ) : filteredSections.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8">
          <EmptyState
            title="هیچ سکشنی مطابق جستجو یا فیلتر یافت نشد"
            description="می‌توانید فیلترها را تغییر داده یا با کلیک بر روی دکمه زیر سکشن جدید ایجاد کنید."
            icon={<LayoutTemplate className="w-12 h-12 text-slate-600" />}
            action={
              <div className="flex items-center gap-2 mt-4">
                <EButton
                  variant="outlined"
                  size="sm"
                  onClick={handleResetDefaults}
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  بازنشانی به پیش‌فرض
                </EButton>
                <EButton
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAddModalOpen(true)}
                  icon={<Plus className="w-4 h-4" />}
                >
                  افزودن سکشن جدید
                </EButton>
              </div>
            }
          />
        </div>
      ) : (
        <>
          {/* Desktop Table View (>= 768px) */}
          <div className="hidden md:block">
            <SectionListDesktop
              sections={filteredSections}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onReorder={handleReorder}
              onToggleActive={handleToggleActive}
              onOpenConfig={openConfigDrawer}
              onDeleteClick={setDeleteConfirmSection}
            />
          </div>

          {/* Mobile Cards View (< 768px) */}
          <div className="block md:hidden">
            <SectionListMobile
              sections={filteredSections}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onReorder={handleReorder}
              onToggleActive={handleToggleActive}
              onOpenConfig={openConfigDrawer}
              onDeleteClick={setDeleteConfirmSection}
            />
          </div>
        </>
      )}

      {/* 4. Add Section Modal */}
      <AddSectionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSection={handleAddSection}
        isUpdating={isUpdating}
      />

      {/* 5. Section Configurator Drawer */}
      <SectionConfigDrawer
        isOpen={isConfigDrawerOpen}
        onClose={closeConfigDrawer}
        section={selectedSection}
        onSave={handleSaveSection}
        catalogProducts={catalogProducts}
        isUpdating={isUpdating}
      />

      {/* 6. Live Responsive Simulator Preview */}
      <LivePreviewDrawer
        isOpen={isOpenPreviewOpen(isPreviewOpen)}
        onClose={() => setIsPreviewOpen(false)}
        sections={sections}
        catalogProducts={catalogProducts}
      />

      {/* 7. Delete Confirmation Dialog */}
      <SectionDeleteDialog
        section={deleteConfirmSection}
        onClose={() => setDeleteConfirmSection(null)}
        onConfirm={handleDeleteSection}
        isUpdating={isUpdating}
      />
    </div>
  );
};

// Helper for type safety
function isOpenPreviewOpen(open: boolean) {
  return open;
}

export default HomepageContainer;
