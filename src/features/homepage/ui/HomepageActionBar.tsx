import React from "react";
import SearchBox from "@/shared-app/designSystem/searchBox";
import ESelect from "@/shared-app/designSystem/select";
import EButton from "@/shared-app/designSystem/button";
import {
  Plus,
  RotateCcw,
  Eye,
  SlidersHorizontal,
  LayoutTemplate,
} from "lucide-react";

interface HomepageActionBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (status: "all" | "active" | "inactive") => void;
  onOpenAddModal: () => void;
  onOpenPreview: () => void;
  onResetDefaults: () => void;
  isUpdating?: boolean;
}

const TYPE_OPTIONS = [
  { value: "all", label: "همه انواع سکشن‌ها" },
  { value: "hero_banner", label: "اسلایدر بنر هیرو" },
  { value: "flash_deals", label: "پیشنهادهای شگفت‌انگیز" },
  { value: "banner_grid_2", label: "بنرهای تبلیغاتی ۲ ستونه" },
  { value: "banner_grid_3", label: "بنرهای تبلیغاتی ۳ ستونه" },
  { value: "product_grid", label: "ردیف کالاهای منتخب" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "active", label: "فقط فعال‌ها" },
  { value: "inactive", label: "فقط غیرفعال‌ها" },
];

export const HomepageActionBar: React.FC<HomepageActionBarProps> = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  onOpenAddModal,
  onOpenPreview,
  onResetDefaults,
  isUpdating = false,
}) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/20 space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="flex-1 max-w-full sm:max-w-xs">
            <SearchBox
              value={searchQuery}
              onSearch={onSearchChange}
              placeholder="جستجو در عناوین و توضیحات سکشن‌ها..."
            />
          </div>

          <div className="w-full sm:w-52">
            <ESelect
              value={typeFilter}
              onValueChange={onTypeFilterChange}
              options={TYPE_OPTIONS}
              placeholder="فیلتر نوع سکشن"
            />
          </div>

          <div className="w-full sm:w-40">
            <ESelect
              value={statusFilter}
              onValueChange={(val) =>
                onStatusFilterChange(val as "all" | "active" | "inactive")
              }
              options={STATUS_OPTIONS}
              placeholder="وضعیت انتشار"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          <EButton
            variant="outlined"
            size="sm"
            onClick={onResetDefaults}
            isLoading={isUpdating}
            icon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
            title="بازنشانی به چیدمان پیش‌فرض فروشگاه"
          >
            بازنشانی چیدمان
          </EButton>

          <EButton
            variant="secondary"
            size="sm"
            onClick={onOpenPreview}
            icon={<Eye className="w-4 h-4 text-cyan-400" />}
            className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/40"
          >
            پیش‌نمایش زنده فروشگاه
          </EButton>

          <EButton
            variant="primary"
            size="sm"
            onClick={onOpenAddModal}
            icon={<Plus className="w-4 h-4" />}
            className="shadow-lg shadow-indigo-600/30"
          >
            افزودن سکشن جدید
          </EButton>
        </div>
      </div>
    </div>
  );
};

export default HomepageActionBar;
