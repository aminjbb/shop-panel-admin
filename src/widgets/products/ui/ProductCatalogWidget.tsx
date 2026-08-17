import React from "react";
import useProducts from "@/features/products/hooks/useProducts";
import ProductTable from "@/features/products/ui/ProductTable";
import ProductCardsList from "@/features/products/ui/ProductCardsList";
import ProductFilterBar from "@/features/products/ui/ProductFilterBar";
import ProductFilterDrawer from "@/features/products/ui/ProductFilterDrawer";
import ProductFormModal from "@/features/products/ui/ProductFormModal";
import ProductDeleteDialog from "@/features/products/ui/ProductDeleteDialog";
import ProductSkeletonList from "@/features/products/ui/ProductSkeletonList";
import StatCard from "@/shared-app/statCard";
import EPagination from "@/shared-app/designSystem/pagination";
import EmptyState from "@/shared-app/emptyState";
import AllertMassage from "@/shared-app/allertMassage";
import EButton from "@/shared-app/designSystem/button";
import {
  Package,
  Boxes,
  AlertTriangle,
  PackageX,
  RotateCcw,
  Plus,
} from "lucide-react";

export const ProductCatalogWidget: React.FC = () => {
  const {
    products,
    totalCount,
    currentPage,
    pageSize,
    totalPages,
    activeFiltersCount,
    filters,
    isLoading,
    isMutating,
    error,
    isFormModalOpen,
    editingProduct,
    isDeleteDialogOpen,
    productToDelete,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    onSearch,
    onCategoryChange,
    onStockStatusChange,
    onSortChange,
    onPageChange,
    onResetFilters,
    onOpenCreateModal,
    onOpenEditModal,
    onCloseFormModal,
    onSaveProduct,
    onOpenDeleteDialog,
    onCloseDeleteDialog,
    onConfirmDelete,
    onQuickStockUpdate,
    onResetToDefaultMock,
  } = useProducts();

  // Quick Stats Computations
  const totalStockSum = products.reduce((acc, p) => acc + p.totalStock, 0);
  const lowStockCount = products.filter((p) => p.stockStatus === "low_stock").length;
  const outOfStockCount = products.filter((p) => p.stockStatus === "out_of_stock").length;

  return (
    <div className="space-y-6">
      {/* Top Stats Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="کل عناوین کاتالوگ"
          value={totalCount}
          subtitle="تعداد کل اقلام فعال در انبار"
          icon={<Package className="w-4 h-4" />}
        />

        <StatCard
          title="مجموع موجودی انبار"
          value={new Intl.NumberFormat("fa-IR").format(totalStockSum)}
          subtitle="مجموع شمارش فیزیکی اقلام"
          icon={<Boxes className="w-4 h-4" />}
        />

        <StatCard
          title="کالاهای نیازمند شارژ"
          value={lowStockCount}
          subtitle="موجودی زیر ۱۰ عدد"
          icon={<AlertTriangle className="w-4 h-4" />}
          badge={
            lowStockCount > 0 ? (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                توجه
              </span>
            ) : undefined
          }
        />

        <StatCard
          title="کالاهای ناموجود"
          value={outOfStockCount}
          subtitle="اتمام موجودی در انبار"
          icon={<PackageX className="w-4 h-4" />}
          badge={
            outOfStockCount > 0 ? (
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                صفر
              </span>
            ) : undefined
          }
        />
      </div>

      {/* Main Catalog Card */}
      <div className="glass-card p-4 sm:p-6 space-y-5 bg-slate-900 border border-slate-800">
        {/* Header toolbar & reset button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              لیست محصولات و مدیریت موجودی
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              مدیریت تنوع کالاها، قیمت‌گذاری و کنترل بلادرنگ موجودی انبار (بر بستر
              LocalStorage)
            </p>
          </div>

          <button
            type="button"
            onClick={onResetToDefaultMock}
            disabled={isLoading || isMutating}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white py-1.5 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            title="بازنشانی پایگاه داده ماک به داده‌های اولیه"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازنشانی دیتای ماک</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <ProductFilterBar
          search={filters.search}
          onSearch={onSearch}
          category={filters.category}
          onCategoryChange={onCategoryChange}
          stockStatus={filters.stockStatus}
          onStockStatusChange={onStockStatusChange}
          sortBy={filters.sortBy}
          onSortChange={onSortChange}
          onResetFilters={onResetFilters}
          activeFiltersCount={activeFiltersCount}
          onOpenCreateModal={onOpenCreateModal}
          onOpenMobileFilters={() => setIsFilterDrawerOpen(true)}
        />

        {/* Error Alert */}
        {error && (
          <AllertMassage
            variant="danger"
            title="خطا در عملیات"
            message={error}
            className="my-3"
          />
        )}

        {/* Main Content: Responsive Table / Cards or Loading / Empty states */}
        {isLoading ? (
          <ProductSkeletonList />
        ) : products.length === 0 ? (
          <EmptyState
            title="هیچ کالایی یافت نشد"
            description={
              activeFiltersCount > 0
                ? "با فیلترهای انتخابی یا عبارت جستجوی فعلی کالایی پیدا نشد. می‌توانید فیلترها را پاکسازی کنید."
                : "کاتالوگ انبار در حال حاضر خالی است. با افزودن اولین محصول شروع کنید."
            }
            action={
              activeFiltersCount > 0 ? (
                <EButton
                  variant="secondary"
                  size="md"
                  onClick={onResetFilters}
                  icon={<RotateCcw className="w-4 h-4" />}
                >
                  پاکسازی تمام فیلترها
                </EButton>
              ) : (
                <EButton
                  variant="primary"
                  size="md"
                  onClick={onOpenCreateModal}
                  icon={<Plus className="w-4 h-4" />}
                >
                  افزودن اولین محصول
                </EButton>
              )
            }
          />
        ) : (
          <div className="space-y-4">
            {/* Mobile View (< 768px): Card Stack (No horizontal scrolling) */}
            <div className="block md:hidden">
              <ProductCardsList
                products={products}
                onEdit={onOpenEditModal}
                onDelete={onOpenDeleteDialog}
                onQuickStockUpdate={onQuickStockUpdate}
              />
            </div>

            {/* Desktop & Tablet View (>= 768px): High density Data Table */}
            <div className="hidden md:block">
              <ProductTable
                products={products}
                onEdit={onOpenEditModal}
                onDelete={onOpenDeleteDialog}
                onQuickStockUpdate={onQuickStockUpdate}
              />
            </div>

            {/* Pagination Controls */}
            <EPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>

      {/* Mobile Filters Drawer / BottomSheet */}
      <ProductFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        selectedCategory={filters.category}
        onCategoryChange={onCategoryChange}
        selectedStockStatus={filters.stockStatus}
        onStockStatusChange={onStockStatusChange}
        selectedSort={filters.sortBy}
        onSortChange={onSortChange}
        onResetFilters={onResetFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Product Add / Edit Modal / BottomSheet */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={onCloseFormModal}
        product={editingProduct}
        onSave={onSaveProduct}
        isLoading={isMutating}
      />

      {/* Product Delete Confirmation Dialog */}
      <ProductDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={onCloseDeleteDialog}
        product={productToDelete}
        onConfirm={onConfirmDelete}
        isLoading={isMutating}
      />
    </div>
  );
};

export default ProductCatalogWidget;
