import React from "react";
import type { ProductSortOption } from "@/types/product";
import { PRODUCT_CATEGORIES } from "../api/mockProductService";
import BottomSheet from "@/shared-app/bottomSheet";
import ESelect from "@/shared-app/designSystem/select";
import EButton from "@/shared-app/designSystem/button";
import { Filter, RotateCcw, Check } from "lucide-react";

export interface ProductFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStockStatus: string;
  onStockStatusChange: (status: string) => void;
  selectedSort: ProductSortOption;
  onSortChange: (sort: ProductSortOption) => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
}

export const ProductFilterDrawer: React.FC<ProductFilterDrawerProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  selectedStockStatus,
  onStockStatusChange,
  selectedSort,
  onSortChange,
  onResetFilters,
  activeFiltersCount,
}) => {
  const categoryOptions = [
    { value: "all", label: "همه دسته‌بندی‌ها" },
    ...PRODUCT_CATEGORIES.map((c) => ({ value: c.id, label: c.label })),
  ];

  const stockStatusOptions = [
    { value: "all", label: "تمام وضعیت‌های موجودی" },
    { value: "in_stock", label: "موجود در انبار" },
    { value: "low_stock", label: "موجودی اندک (زیر ۱۰ عدد)" },
    { value: "out_of_stock", label: "ناموجود" },
  ];

  const sortOptions = [
    { value: "createdAt_desc", label: "جدیدترین محصولات" },
    { value: "createdAt_asc", label: "قدیمی‌ترین محصولات" },
    { value: "price_asc", label: "ارزان‌ترین به گران‌ترین" },
    { value: "price_desc", label: "گران‌ترین به ارزان‌ترین" },
    { value: "stock_desc", label: "بیشترین موجودی انبار" },
    { value: "stock_asc", label: "کمترین موجودی انبار" },
    { value: "title_asc", label: "حروف الفبا (الف تا ی)" },
  ];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>فیلتر و مرتب‌سازی محصولات</span>
          {activeFiltersCount > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {activeFiltersCount} فیلتر فعال
            </span>
          )}
        </div>
      }
      subtitle="انتخاب فیلترهای پیشرفته و تنظیم چیدمان داده‌ها"
      size="md"
      footer={
        <div className="flex items-center gap-3">
          <EButton
            variant="primary"
            size="md"
            onClick={onClose}
            className="flex-1 justify-center text-xs"
            icon={<Check className="w-4 h-4" />}
          >
            اعمال و مشاهده نتایج
          </EButton>

          {activeFiltersCount > 0 && (
            <EButton
              variant="secondary"
              size="md"
              onClick={() => {
                onResetFilters();
                onClose();
              }}
              className="text-xs"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              پاکسازی
            </EButton>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Category selector */}
        <ESelect
          label="دسته‌بندی محصول"
          value={selectedCategory}
          onValueChange={onCategoryChange}
          options={categoryOptions}
        />

        {/* Stock status selector */}
        <ESelect
          label="وضعیت موجودی کالا"
          value={selectedStockStatus}
          onValueChange={onStockStatusChange}
          options={stockStatusOptions}
        />

        {/* Sort selector */}
        <ESelect
          label="مرتب‌سازی نتایج بر اساس"
          value={selectedSort}
          onValueChange={(val) => onSortChange(val as ProductSortOption)}
          options={sortOptions}
        />
      </div>
    </BottomSheet>
  );
};

export default ProductFilterDrawer;
