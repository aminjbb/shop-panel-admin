import React from "react";
import { useCoupons } from "../hooks/useCoupons";
import CouponFilterBar from "./CouponFilterBar";
import CouponTable from "./CouponTable";
import CouponCard from "./CouponCard";
import CouponFormModal from "./CouponFormModal";
import CouponSkeletonList from "./CouponSkeletonList";
import HeaderPages from "@/shared-app/headerPages";
import {
  Tag,
  CheckCircle2,
  Clock,
  Ban,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export const CouponsContainer: React.FC = () => {
  const {
    filters,
    data,
    isLoading,
    isMutating,
    selectedCoupon,
    isFormModalOpen,
    formMode,
    handleStatusTabChange,
    handleTypeFilterChange,
    handleSearch,
    handlePageChange,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseFormModal,
    handleCreateCoupon,
    handleUpdateCoupon,
    handleToggleCouponStatus,
    handleDeleteCoupon,
    handleResetMockData,
  } = useCoupons();

  const { coupons, total, page, totalPages, counts } = data;

  return (
    <div id="coupons-container" className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
      {/* 1. Header with Coupon Summary & Description */}
      <HeaderPages
        title="مدیریت کدهای تخفیف و پروموشن‌ها"
        subtitle="تعریف کمپین‌های تخفیفی درصدی و نقدی، تنظیم سقف استفاده، تاریخ انقضا و دسته‌بندی کالاها"
      />

      {/* 2. Top Summary Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">کل کدهای تخفیف</div>
            <div className="text-lg font-bold text-white mt-0.5 font-mono">
              {counts.all.toLocaleString("fa-IR")} کوپن
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">کوپن‌های فعال</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5 font-mono">
              {counts.active.toLocaleString("fa-IR")} آماده اعمال
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">منقضی‌شده‌ها</div>
            <div className="text-lg font-bold text-rose-400 mt-0.5 font-mono">
              {counts.expired.toLocaleString("fa-IR")} کد منقضی
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">متوقف‌شده‌ها</div>
            <div className="text-lg font-bold text-slate-300 mt-0.5 font-mono">
              {counts.disabled.toLocaleString("fa-IR")} غیرفعال
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-700">
            <Ban className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <CouponFilterBar
        currentStatus={filters.status || "all"}
        onStatusChange={handleStatusTabChange}
        currentType={filters.type || "all"}
        onTypeChange={handleTypeFilterChange}
        searchTerm={filters.search || ""}
        onSearchChange={handleSearch}
        counts={counts}
        onOpenCreate={handleOpenCreateModal}
        onResetMockData={handleResetMockData}
      />

      {/* 4. Coupons Listing */}
      {isLoading ? (
        <CouponSkeletonList />
      ) : coupons.length === 0 ? (
        <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center flex flex-col items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-slate-800/80 text-slate-400">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white">کد تخفیفی با این شرایط یافت نشد</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            می‌توانید فیلترها را تغییر داده یا با کلیک بر روی دکمه «ایجاد کد تخفیف جدید» کوپن جدیدی تعریف کنید.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Desktop Table */}
          <CouponTable
            coupons={coupons}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteCoupon}
            onToggleStatus={handleToggleCouponStatus}
          />

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
            {coupons.map((c) => (
              <CouponCard
                key={c.id}
                coupon={c}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteCoupon}
                onToggleStatus={handleToggleCouponStatus}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <div className="text-slate-400">
                نمایش صفحه <span className="font-bold text-white font-mono">{page}</span> از{" "}
                <span className="font-bold text-white font-mono">{totalPages}</span> (مجموع{" "}
                <span className="font-mono text-indigo-400 font-bold">{total}</span> کوپن)
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>قبلی</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 transition-colors cursor-pointer"
                >
                  <span>بعدی</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Create / Edit Coupon Modal */}
      <CouponFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        coupon={selectedCoupon}
        mode={formMode}
        onSubmitCreate={handleCreateCoupon}
        onSubmitUpdate={handleUpdateCoupon}
        isLoading={isMutating}
      />
    </div>
  );
};

export default CouponsContainer;
