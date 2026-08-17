import React from "react";
import type { ProductSortOption } from "@/types/product";
import { PRODUCT_CATEGORIES } from "../api/mockProductService";
import SearchBox from "@/shared-app/designSystem/searchBox";
import ESelect from "@/shared-app/designSystem/select";
import EButton from "@/shared-app/designSystem/button";
import { Filter, RotateCcw, Plus, SlidersHorizontal } from "lucide-react";

export interface ProductFilterBarProps {
  search: string;
  onSearch: (value: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  stockStatus: string;
  onStockStatusChange: (status: string) => void;
  sortBy: ProductSortOption;
  onSortChange: (sort: ProductSortOption) => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
  onOpenCreateModal: () => void;
  onOpenMobileFilters: () => void;
  className?: string;
}

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  search,
  onSearch,
  category,
  onCategoryChange,
  stockStatus,
  onStockStatusChange,
  sortBy,
  onSortChange,
  onResetFilters,
  activeFiltersCount,
  onOpenCreateModal,
  onOpenMobileFilters,
  className = "",
}) => {
  const categoryOptions = [
    { value: "all", label: "همه دسته‌بندی‌ها" },
    ...PRODUCT_CATEGORIES.map((c) => ({ value: c.id, label: c.label })),
  ];

  const stockStatusOptions = [
    { value: "all", label: "همه وضعیت‌ها" },
    { value: "in_stock", label: "موجود در انبار" },
    { value: "low_stock", label: "موجودی اندک" },
    { value: "out_of_stock", label: "ناموجود" },
  ];

  const sortOptions = [
    { value: "createdAt_desc", label: "جدیدترین" },
    { value: "createdAt_asc", label: "قدیمی‌ترین" },
    { value: "price_asc", label: "ارزان‌ترین" },
    { value: "price_desc", label: "گران‌ترین" },
    { value: "stock_desc", label: "بیشترین موجودی" },
    { value: "stock_asc", label: "کمترین موجودی" },
    { value: "title_asc", label: "حروف الفبا" },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Primary Row: Search & Add CTA on Mobile / Desktop */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search input with debouncing */}
        <div className="flex-1">
          <SearchBox
            value={search}
            onSearch={onSearch}
            placeholder="جستجو در نام محصول، کد SKU، دسته‌بندی یا واریانت..."
          />
        </div>

        {/* Mobile Filter Drawer Trigger (< 768px) */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className={`
              flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold 
              transition-colors cursor-pointer shrink-0 min-h-[42px]
              ${
                activeFiltersCount > 0
                  ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
              }
            `}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden xs:inline">فیلترها</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <EButton
            variant="primary"
            size="md"
            onClick={onOpenCreateModal}
            className="text-xs shrink-0 min-h-[42px] px-3"
            icon={<Plus className="w-4 h-4" />}
          >
            <span className="hidden xs:inline">محصول جدید</span>
          </EButton>
        </div>

        {/* Desktop Create CTA (>= 768px) */}
        <div className="hidden md:block shrink-0">
          <EButton
            variant="primary"
            size="md"
            onClick={onOpenCreateModal}
            className="text-xs font-semibold"
            icon={<Plus className="w-4 h-4" />}
          >
            افزودن محصول جدید
          </EButton>
        </div>
      </div>

      {/* Desktop Filter Row (>= 768px) */}
      <div className="hidden md:flex items-center gap-3 pt-1">
        {/* Category Dropdown */}
        <div className="w-48">
          <ESelect
            value={category}
            onValueChange={onCategoryChange}
            options={categoryOptions}
            className="py-1.5 text-xs"
          />
        </div>

        {/* Stock Status Dropdown */}
        <div className="w-40">
          <ESelect
            value={stockStatus}
            onValueChange={onStockStatusChange}
            options={stockStatusOptions}
            className="py-1.5 text-xs"
          />
        </div>

        {/* Sort By Dropdown */}
        <div className="w-44">
          <ESelect
            value={sortBy}
            onValueChange={(val) => onSortChange(val as ProductSortOption)}
            options={sortOptions}
            className="py-1.5 text-xs"
          />
        </div>

        {/* Reset button if filters active */}
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 py-2 px-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>پاکسازی فیلترها ({activeFiltersCount})</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductFilterBar;
