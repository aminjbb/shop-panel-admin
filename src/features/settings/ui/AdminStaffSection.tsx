import React, { useState } from "react";
import type {
  AdminStaff,
  AdminRole,
  StaffFilterParams,
  CreateStaffPayload,
} from "@/types/settings";
import { EButton } from "@/shared-app/designSystem/button";
import { EPagination } from "@/shared-app/designSystem/pagination";
import EmptyState from "@/shared-app/emptyState";
import StaffFilterBar from "./StaffFilterBar";
import StaffTable from "./StaffTable";
import StaffCard from "./StaffCard";
import StaffModal from "./StaffModal";
import { ShieldCheck, UserPlus, Users } from "lucide-react";

export interface AdminStaffSectionProps {
  staff: AdminStaff[];
  total: number;
  page: number;
  totalPages: number;
  counts: {
    all: number;
    super_admin: number;
    inventory_manager: number;
    support_agent: number;
    active: number;
    inactive: number;
  };
  filterParams: StaffFilterParams;
  isLoading: boolean;
  isSubmitting: boolean;
  onSearchChange: (search: string) => void;
  onRoleChange: (role: AdminRole | "all") => void;
  onStatusChange: (status: StaffFilterParams["status"]) => void;
  onPageChange: (page: number) => void;
  onCreateStaff: (payload: CreateStaffPayload) => Promise<{ success: boolean }>;
  onUpdateRole: (id: string, role: AdminRole) => Promise<{ success: boolean }>;
  onToggleStatus: (id: string) => Promise<{ success: boolean }>;
  onDeleteStaff: (id: string) => Promise<{ success: boolean }>;
}

export const AdminStaffSection: React.FC<AdminStaffSectionProps> = ({
  staff,
  total,
  page,
  totalPages,
  counts,
  filterParams,
  isLoading,
  isSubmitting,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onPageChange,
  onCreateStaff,
  onUpdateRole,
  onToggleStatus,
  onDeleteStaff,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      {/* Section Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white">
                مدیریت مدیران و سطوح دسترسی (RBAC)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                {counts.active} مدیر فعال
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              تعریف حساب همکاران، تخصیص نقش‌های سیستمی و مدیریت دسترسی‌های بخش‌های مختلف پنل
            </p>
          </div>
        </div>

        <EButton
          onClick={() => setIsModalOpen(true)}
          icon={<UserPlus className="w-4 h-4" />}
          className="text-xs font-bold px-4 self-start sm:self-auto"
        >
          تعریف مدیر جدید
        </EButton>
      </div>

      {/* Filter Bar */}
      <StaffFilterBar
        searchTerm={filterParams.search || ""}
        currentRole={filterParams.role || "all"}
        currentStatus={filterParams.status || "all"}
        counts={counts}
        onSearchChange={onSearchChange}
        onRoleChange={onRoleChange}
        onStatusChange={onStatusChange}
      />

      {/* Content Rendering */}
      {isLoading && staff.length === 0 ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 w-full rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : staff.length === 0 ? (
        <EmptyState
          title="مدیری مطابق با فیلترها یافت نشد"
          description="می‌توانید عبارت جستجو یا فیلتر نقش و وضعیت را تغییر دهید یا مدیر جدیدی اضافه کنید."
          icon={<Users className="w-8 h-8 text-indigo-400" />}
          action={
            <EButton
              onClick={() => setIsModalOpen(true)}
              icon={<UserPlus className="w-4 h-4" />}
              className="text-xs font-bold mt-2"
            >
              افزودن مدیر جدید
            </EButton>
          }
        />
      ) : (
        <>
          {/* Desktop Table View (>= 768px) */}
          <div className="hidden md:block">
            <StaffTable
              staff={staff}
              onUpdateRole={onUpdateRole}
              onToggleStatus={onToggleStatus}
              onDelete={onDeleteStaff}
            />
          </div>

          {/* Mobile Card View (< 768px) */}
          <div className="md:hidden flex flex-col gap-3">
            {staff.map((member) => (
              <StaffCard
                key={member.id}
                member={member}
                onUpdateRole={onUpdateRole}
                onToggleStatus={onToggleStatus}
                onDelete={onDeleteStaff}
              />
            ))}
          </div>

          {/* Pagination */}
          <EPagination
            currentPage={page}
            totalPages={totalPages}
            totalCount={total}
            pageSize={filterParams.limit || 10}
            onPageChange={onPageChange}
          />
        </>
      )}

      {/* Add / Invite Staff Modal */}
      <StaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onCreateStaff}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AdminStaffSection;
