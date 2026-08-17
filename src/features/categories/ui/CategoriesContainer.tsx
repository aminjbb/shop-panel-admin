import React from "react";
import { useCategories } from "../hooks/useCategories";
import CategoryStatsCards from "./CategoryStatsCards";
import CategoryFilterBar from "./CategoryFilterBar";
import CategoryTreeTable from "./CategoryTreeTable";
import CategoryCardList from "./CategoryCardList";
import CategoryFormModal from "./CategoryFormModal";
import CategoryDeleteDialog from "./CategoryDeleteDialog";
import CategoryDetailDrawer from "./CategoryDetailDrawer";
import EmptyState from "@/shared-app/emptyState";
import { FolderTree, Plus, SearchX } from "lucide-react";
import EButton from "@/shared-app/designSystem/button";

export const CategoriesContainer: React.FC = () => {
  const {
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
    // Modal states
    isFormOpen,
    formMode,
    selectedCategory,
    parentForNewChild,
    openCreateModal,
    openCreateChildModal,
    openEditModal,
    closeFormModal,
    handleSaveCategory,
    // Delete
    isDeleteOpen,
    categoryToDelete,
    openDeleteDialog,
    closeDeleteDialog,
    handleDeleteCategory,
    // Toggle
    handleToggleStatus,
    // Detail
    isDetailOpen,
    categoryDetail,
    openDetailDrawer,
    closeDetailDrawer,
    // Reset
    handleResetDefaults,
  } = useCategories();

  return (
    <div className="space-y-6">
      {/* 1. Statistics Cards */}
      <CategoryStatsCards stats={stats} isLoading={isLoading} />

      {/* 2. Search, Status Filter & Actions Bar */}
      <CategoryFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
        onOpenCreateModal={openCreateModal}
        onResetDefaults={handleResetDefaults}
        isUpdating={isUpdating}
      />

      {/* 3. Main Content: Skeleton / Empty State / Tree Table & Cards */}
      {isLoading ? (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-pulse">
          <div className="h-10 bg-slate-800/80 rounded-xl w-full" />
          <div className="h-14 bg-slate-800/60 rounded-xl w-full" />
          <div className="h-14 bg-slate-800/60 rounded-xl w-full" />
          <div className="h-14 bg-slate-800/60 rounded-xl w-full" />
          <div className="h-14 bg-slate-800/60 rounded-xl w-full" />
        </div>
      ) : tree.length === 0 ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <EmptyState
            icon={search || statusFilter !== "all" ? <SearchX className="w-10 h-10 text-indigo-400" /> : <FolderTree className="w-10 h-10 text-indigo-400" />}
            title={
              search || statusFilter !== "all"
                ? "دسته‌بندی با این مشخصات یافت نشد"
                : "هنوز هیچ دسته‌بندی تعریف نشده است"
            }
            description={
              search || statusFilter !== "all"
                ? "عبارت جستجو یا فیلتر وضعیت را بررسی کرده و مجدداً تلاش کنید."
                : "برای سازمان‌دهی محصولات و کاتالوگ فروشگاه، اولین دسته‌بندی خود را ایجاد کنید."
            }
            action={
              search || statusFilter !== "all" ? (
                <EButton
                  variant="outlined"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                >
                  پاکسازی فیلترها
                </EButton>
              ) : (
                <EButton
                  variant="primary"
                  onClick={openCreateModal}
                  icon={<Plus className="w-4 h-4" />}
                >
                  ایجاد اولین دسته‌بندی
                </EButton>
              )
            }
          />
        </div>
      ) : (
        <>
          {/* Desktop Tree Table (>= 768px) */}
          <div className="hidden md:block">
            <CategoryTreeTable
              tree={tree}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
              onOpenCreateChildModal={openCreateChildModal}
              onOpenEditModal={openEditModal}
              onOpenDeleteDialog={openDeleteDialog}
              onOpenDetailDrawer={openDetailDrawer}
              onToggleStatus={handleToggleStatus}
            />
          </div>

          {/* Mobile Category Cards (< 768px) */}
          <div className="block md:hidden">
            <CategoryCardList
              tree={tree}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
              onOpenCreateChildModal={openCreateChildModal}
              onOpenEditModal={openEditModal}
              onOpenDeleteDialog={openDeleteDialog}
              onOpenDetailDrawer={openDetailDrawer}
              onToggleStatus={handleToggleStatus}
            />
          </div>
        </>
      )}

      {/* 4. Category Form Modal (Create / Edit / Create Child) */}
      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={closeFormModal}
        mode={formMode}
        category={selectedCategory}
        parentCategory={parentForNewChild}
        allCategories={flatCategories}
        onSave={handleSaveCategory}
        isLoading={isUpdating}
      />

      {/* 5. Smart Delete Dialog */}
      <CategoryDeleteDialog
        isOpen={isDeleteOpen}
        onClose={closeDeleteDialog}
        category={categoryToDelete}
        childCount={categoryToDelete ? categoryChildCounts[categoryToDelete.id] || 0 : 0}
        onConfirmDelete={handleDeleteCategory}
        isLoading={isUpdating}
      />

      {/* 6. Category Detail Drawer */}
      <CategoryDetailDrawer
        isOpen={isDetailOpen}
        onClose={closeDetailDrawer}
        category={categoryDetail}
        allCategories={flatCategories}
        onOpenEdit={openEditModal}
        onOpenAddChild={openCreateChildModal}
      />
    </div>
  );
};

export default CategoriesContainer;
