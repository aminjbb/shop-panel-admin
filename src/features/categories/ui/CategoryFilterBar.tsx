import React from "react";
import SearchBox from "@/shared-app/designSystem/searchBox";
import ESelect from "@/shared-app/designSystem/select";
import EButton from "@/shared-app/designSystem/button";
import {
  Plus,
  ChevronsDown,
  ChevronsUp,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface CategoryFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (val: "all" | "active" | "inactive") => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onOpenCreateModal: () => void;
  onResetDefaults: () => void;
  isUpdating?: boolean;
}

const STATUS_OPTIONS = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "active", label: "فقط فعال‌ها" },
  { value: "inactive", label: "فقط غیرفعال‌ها" },
];

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onExpandAll,
  onCollapseAll,
  onOpenCreateModal,
  onResetDefaults,
  isUpdating = false,
}) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/20 space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left: Search & Status Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="flex-1 max-w-full sm:max-w-md">
            <SearchBox
              value={search}
              onSearch={onSearchChange}
              placeholder="جستجو در عنوان، اسلاگ، توضیحات یا ویژگی‌ها..."
            />
          </div>

          <div className="w-full sm:w-44">
            <ESelect
              value={statusFilter}
              onValueChange={(val) =>
                onStatusFilterChange(val as "all" | "active" | "inactive")
              }
              options={STATUS_OPTIONS}
              placeholder="فیلتر وضعیت"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          <EButton
            variant="outlined"
            size="sm"
            onClick={onExpandAll}
            icon={<ChevronsDown className="w-4 h-4 text-indigo-400" />}
            title="باز کردن تمام شاخه‌ها"
          >
            باز کردن همه
          </EButton>

          <EButton
            variant="outlined"
            size="sm"
            onClick={onCollapseAll}
            icon={<ChevronsUp className="w-4 h-4 text-slate-400" />}
            title="بستن تمام شاخه‌ها"
          >
            بستن همه
          </EButton>

          <EButton
            variant="outlined"
            size="sm"
            onClick={onResetDefaults}
            isLoading={isUpdating}
            icon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
            title="بازنشانی به داده‌های اولیه ماک"
          >
            بازنشانی
          </EButton>

          <EButton
            variant="primary"
            size="sm"
            onClick={onOpenCreateModal}
            icon={<Plus className="w-4 h-4" />}
            className="shadow-lg shadow-indigo-600/30"
          >
            دسته‌بندی جدید
          </EButton>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilterBar;
