import React from "react";
import type { CustomerTier, CustomerStatus } from "@/types/crm";
import { SearchBox } from "@/shared-app/designSystem/searchBox";
import { ESelect } from "@/shared-app/designSystem/select";
import { EButton } from "@/shared-app/designSystem/button";
import { RotateCcw, Crown, Award, Users } from "lucide-react";

interface CustomerFilterBarProps {
  currentTier: CustomerTier | "all";
  onTierChange: (tier: CustomerTier | "all") => void;
  currentStatus: CustomerStatus | "all";
  onStatusChange: (status: CustomerStatus | "all") => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  counts: {
    all: number;
    vip: number;
    gold: number;
    silver: number;
    bronze: number;
    active: number;
    blocked: number;
  };
  onResetMockData: () => void;
}

export const CustomerFilterBar: React.FC<CustomerFilterBarProps> = ({
  currentTier,
  onTierChange,
  currentStatus,
  onStatusChange,
  searchTerm,
  onSearchChange,
  counts,
  onResetMockData,
}) => {
  const tierTabs: {
    id: CustomerTier | "all";
    label: string;
    count: number;
    icon?: React.ReactNode;
  }[] = [
    { id: "all", label: "همه اعضا", count: counts.all, icon: <Users className="w-3.5 h-3.5" /> },
    { id: "vip", label: "مشتریان VIP", count: counts.vip, icon: <Crown className="w-3.5 h-3.5 text-amber-400" /> },
    { id: "gold", label: "سطح طلایی", count: counts.gold, icon: <Award className="w-3.5 h-3.5 text-yellow-400" /> },
    { id: "silver", label: "سطح نقره‌ای", count: counts.silver, icon: <Award className="w-3.5 h-3.5 text-slate-300" /> },
    { id: "bronze", label: "سطح برنزی", count: counts.bronze, icon: <Award className="w-3.5 h-3.5 text-orange-400" /> },
  ];

  const statusOptions = [
    { value: "all", label: `وضعیت: همه (${counts.all})` },
    { value: "active", label: `حساب فعال (${counts.active})` },
    { value: "blocked", label: `مسدود شده (${counts.blocked})` },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
      {/* Top Row: Tier Tabs (Horizontal Scroll on Mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
        {tierTabs.map((tab) => {
          const isActive = currentTier === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              id={`customer-tier-tab-${tab.id}`}
              onClick={() => onTierChange(tab.id)}
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

      {/* Bottom Row: Search Box, Status Select, Reset Mock Data */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="sm:col-span-6 lg:col-span-7">
          <SearchBox
            value={searchTerm}
            onSearch={onSearchChange}
            placeholder="جستجوی نام مشتری، شماره موبایل، ایمیل یا شهر..."
            className="w-full text-xs"
          />
        </div>

        {/* Status Dropdown */}
        <div className="sm:col-span-3 lg:col-span-3">
          <ESelect
            value={currentStatus}
            onValueChange={(val) => onStatusChange(val as CustomerStatus | "all")}
            options={statusOptions}
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
            ریست دیتای CRM
          </EButton>
        </div>
      </div>
    </div>
  );
};

export default CustomerFilterBar;
