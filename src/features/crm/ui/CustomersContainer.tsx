import React from "react";
import { useCustomers } from "../hooks/useCustomers";
import CustomerFilterBar from "./CustomerFilterBar";
import CustomerTable from "./CustomerTable";
import CustomerCard from "./CustomerCard";
import CustomerDetailModal from "./CustomerDetailModal";
import CustomerSkeletonList from "./CustomerSkeletonList";
import HeaderPages from "@/shared-app/headerPages";
import {
  Users,
  Crown,
  CreditCard,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  UserCheck,
} from "lucide-react";

export const CustomersContainer: React.FC = () => {
  const {
    filters,
    data,
    isLoading,
    isMutating,
    selectedCustomer,
    isDetailModalOpen,
    handleTierTabChange,
    handleStatusFilterChange,
    handleSearch,
    handlePageChange,
    handleOpenDetailModal,
    handleCloseDetailModal,
    handleToggleCustomerStatus,
    handleUpdateTier,
    handleResetMockData,
  } = useCustomers();

  const { customers, total, page, totalPages, counts, stats } = data;

  return (
    <div id="customers-container" className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
      {/* 1. Header with CRM Summary & Description */}
      <HeaderPages
        title="مدیریت باشگاه مشتریان و سطوح وفاداری (CRM)"
        subtitle="مشاهده پرونده خریداران، سابقه سفارش‌ها، ارتقای سطوح VIP و مدیریت دسترسی کاربران"
      />

      {/* 2. Top CRM Quick Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">کل اعضای ثبت‌شده</div>
            <div className="text-lg font-bold text-white mt-0.5 font-mono">
              {stats.totalCustomers.toLocaleString("fa-IR")} کاربر
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">اعضای ویژه (VIP)</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5 font-mono">
              {stats.vipCount.toLocaleString("fa-IR")} مشتری
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Crown className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">میانگین خرید اعضا (LTV)</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              {(stats.averageCustomerValue / 1000000).toFixed(1)} م تومان
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">حساب‌های فعال</div>
            <div className="text-lg font-bold text-sky-400 mt-0.5 font-mono">
              {counts.active.toLocaleString("fa-IR")} فعال
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <CustomerFilterBar
        currentTier={filters.tier || "all"}
        onTierChange={handleTierTabChange}
        currentStatus={filters.status || "all"}
        onStatusChange={handleStatusFilterChange}
        searchTerm={filters.search || ""}
        onSearchChange={handleSearch}
        counts={counts}
        onResetMockData={handleResetMockData}
      />

      {/* 4. Customer Listing */}
      {isLoading ? (
        <CustomerSkeletonList />
      ) : customers.length === 0 ? (
        <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center flex flex-col items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-slate-800/80 text-slate-400">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white">مشتری با این مشخصات یافت نشد</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            فیلترها یا عبارت جستجو را تغییر دهید تا مشتریان مربوطه نمایش داده شوند.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Desktop Table */}
          <CustomerTable
            customers={customers}
            onOpenDetail={handleOpenDetailModal}
            onToggleStatus={handleToggleCustomerStatus}
          />

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
            {customers.map((cust) => (
              <CustomerCard
                key={cust.id}
                customer={cust}
                onOpenDetail={handleOpenDetailModal}
                onToggleStatus={handleToggleCustomerStatus}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <div className="text-slate-400">
                نمایش صفحه <span className="font-bold text-white font-mono">{page}</span> از{" "}
                <span className="font-bold text-white font-mono">{totalPages}</span> (مجموع{" "}
                <span className="font-mono text-indigo-400 font-bold">{total}</span> مشتری)
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

      {/* 5. Customer Profile Modal / BottomSheet */}
      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onToggleStatus={handleToggleCustomerStatus}
        onUpdateTier={handleUpdateTier}
        isLoading={isMutating}
      />
    </div>
  );
};

export default CustomersContainer;
