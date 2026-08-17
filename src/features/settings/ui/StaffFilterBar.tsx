import React from "react";
import type { AdminRole, StaffFilterParams } from "@/types/settings";
import SearchBox from "@/shared-app/designSystem/searchBox";
import { ESelect } from "@/shared-app/designSystem/select";
import { Shield, Users, ShieldCheck, Headphones } from "lucide-react";

export interface StaffFilterBarProps {
  searchTerm: string;
  currentRole: AdminRole | "all";
  currentStatus: StaffFilterParams["status"];
  counts: {
    all: number;
    super_admin: number;
    inventory_manager: number;
    support_agent: number;
    active: number;
    inactive: number;
  };
  onSearchChange: (val: string) => void;
  onRoleChange: (val: AdminRole | "all") => void;
  onStatusChange: (val: StaffFilterParams["status"]) => void;
}

export const StaffFilterBar: React.FC<StaffFilterBarProps> = ({
  searchTerm,
  currentRole,
  currentStatus,
  counts,
  onSearchChange,
  onRoleChange,
  onStatusChange,
}) => {
  const roleTabs = [
    { id: "all" as const, label: "همه پرسنل", count: counts.all, icon: <Users className="w-3.5 h-3.5" /> },
    { id: "super_admin" as const, label: "مدیران کل (Super Admin)", count: counts.super_admin, icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: "inventory_manager" as const, label: "مدیران انبارداری", count: counts.inventory_manager, icon: <Shield className="w-3.5 h-3.5" /> },
    { id: "support_agent" as const, label: "کارشناسان پشتیبانی", count: counts.support_agent, icon: <Headphones className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
      {/* Quick Role Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {roleTabs.map((tab) => {
          const isActive = currentRole === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onRoleChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1 border-t border-slate-800/80">
        <div className="sm:col-span-8 lg:col-span-9">
          <SearchBox
            value={searchTerm}
            onSearch={onSearchChange}
            placeholder="جستجوی نام مدیر، آدرس ایمیل یا شماره موبایل..."
            className="w-full text-xs"
          />
        </div>

        <div className="sm:col-span-4 lg:col-span-3">
          <ESelect
            value={currentStatus || "all"}
            onValueChange={(val) => onStatusChange(val as StaffFilterParams["status"])}
            options={[
              { value: "all", label: "تمامی وضعیت‌ها" },
              { value: "active", label: `حساب‌های فعال (${counts.active})` },
              { value: "inactive", label: `حساب‌های غیرفعال (${counts.inactive})` },
            ]}
            className="w-full text-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default StaffFilterBar;
