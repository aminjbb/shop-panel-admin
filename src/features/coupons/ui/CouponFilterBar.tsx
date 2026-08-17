import React from "react";
import type { CouponStatus, CouponType } from "@/types/crm";
import { SearchBox } from "@/shared-app/designSystem/searchBox";
import { ESelect } from "@/shared-app/designSystem/select";
import { EButton } from "@/shared-app/designSystem/button";
import { Plus, RotateCcw, Tag, CheckCircle2, Clock, Ban } from "lucide-react";

interface CouponFilterBarProps {
  currentStatus: CouponStatus | "all";
  onStatusChange: (status: CouponStatus | "all") => void;
  currentType: CouponType | "all";
  onTypeChange: (type: CouponType | "all") => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  counts: {
    all: number;
    active: number;
    expired: number;
    disabled: number;
  };
  onOpenCreate: () => void;
  onResetMockData: () => void;
}

export const CouponFilterBar: React.FC<CouponFilterBarProps> = ({
  currentStatus,
  onStatusChange,
  currentType,
  onTypeChange,
  searchTerm,
  onSearchChange,
  counts,
  onOpenCreate,
  onResetMockData,
}) => {
  const statusTabs: {
    id: CouponStatus | "all";
    label: string;
    count: number;
    icon: React.ReactNode;
  }[] = [
    { id: "all", label: "همه کوپن‌ها", count: counts.all, icon: <Tag className="w-3.5 h-3.5" /> },
    { id: "active", label: "کوپن‌های فعال", count: counts.active, icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: "expired", label: "منقضی‌شده", count: counts.expired, icon: <Clock className="w-3.5 h-3.5 text-rose-400" /> },
    { id: "disabled", label: "غیرفعال‌شده", count: counts.disabled, icon: <Ban className="w-3.5 h-3.5 text-slate-400" /> },
  ];

  const typeOptions = [
    { value: "all", label: "نوع تخفیف: همه" },
    { value: "percentage", label: "درصدی (%)" },
    { value: "fixed_amount", label: "مبلغ نقدی ثابت (تومان)" },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
      {/* Top Row: Tabs + Action Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
          {statusTabs.map((tab) => {
            const isActive = currentStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                id={`coupon-status-tab-${tab.id}`}
                onClick={() => onStatusChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Create Coupon Button */}
        <EButton
          variant="primary"
          size="md"
          onClick={onOpenCreate}
          icon={<Plus className="w-4 h-4" />}
          className="text-xs shrink-0 justify-center shadow-md shadow-indigo-600/20"
        >
          ایجاد کد تخفیف جدید
        </EButton>
      </div>

      {/* Bottom Row: Search Box, Type Selector, Reset Mock */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="sm:col-span-6 lg:col-span-7">
          <SearchBox
            value={searchTerm}
            onSearch={onSearchChange}
            placeholder="جستجوی کد تخفیف، توضیحات یا دسته کالا..."
            className="w-full text-xs"
          />
        </div>

        {/* Type Dropdown */}
        <div className="sm:col-span-3 lg:col-span-3">
          <ESelect
            value={currentType}
            onValueChange={(val) => onTypeChange(val as CouponType | "all")}
            options={typeOptions}
            className="w-full text-xs"
          />
        </div>

        {/* Reset Mock */}
        <div className="sm:col-span-3 lg:col-span-2 flex justify-end">
          <EButton
            variant="secondary"
            size="md"
            onClick={onResetMockData}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            className="w-full text-xs justify-center"
          >
            ریست داده‌ها
          </EButton>
        </div>
      </div>
    </div>
  );
};

export default CouponFilterBar;
