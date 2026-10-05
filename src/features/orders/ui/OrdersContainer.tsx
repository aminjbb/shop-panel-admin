import React from "react";
import { useOrders } from "../hooks/useOrders";
import { useAuth } from "@/entities/auth";
import OrderStatCards from "./OrderStatCards";
import OrderFilterBar from "./OrderFilterBar";
import OrderTable from "./OrderTable";
import OrderCard from "./OrderCard";
import OrderInvoiceModal from "./OrderInvoiceModal";
import OrderStatusDialog from "./OrderStatusDialog";
import OrderPrintModal from "./OrderPrintModal";
import OrderSkeletonList from "./OrderSkeletonList";
import HeaderPages from "@/shared-app/headerPages";
import EmptyState from "@/shared-app/emptyState";
import AllertMassage from "@/shared-app/allertMassage";
import { EPagination } from "@/shared-app/designSystem/pagination";
import { EButton } from "@/shared-app/designSystem/button";
import {
  Truck,
  RotateCcw,
  ShoppingBag,
  Inbox,
  FilterX,
  RefreshCw,
} from "lucide-react";

export const OrdersContainer: React.FC = () => {
  const { user } = useAuth();
  const canUpdateFulfillment = user?.role !== "support_agent";
  const {
    filters,
    data,
    isLoading,
    isMutating,
    error,
    selectedOrderForInvoice,
    isInvoiceModalOpen,
    selectedOrderForStatus,
    isStatusDialogOpen,
    selectedOrderForPrint,
    isPrintModalOpen,
    handleStatusTabChange,
    handlePaymentFilterChange,
    handleSearch,
    handlePageChange,
    handleOpenInvoice,
    handleCloseInvoice,
    handleOpenStatusDialog,
    handleCloseStatusDialog,
    handleOpenPrintModal,
    handleClosePrintModal,
    handleUpdateFulfillment,
    fetchOrders,
  } = useOrders();

  const isFiltered =
    filters.status !== "all" ||
    filters.paymentStatus !== "all" ||
    Boolean(filters.search && filters.search.trim());

  return (
    <div id="orders-container" className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <HeaderPages
        title="مدیریت مرسولات و سفارش‌ها"
        subtitle={`رهگیری چرخه حیات سفارش، تغییر وضعیت ارسال، صدور بارنامه و فاکتور آنلاین (${data.total} سفارش در دیتابیس)`}
      >
        <div className="flex items-center gap-2">
          <EButton
            variant="secondary"
            size="md"
            onClick={() => { void fetchOrders(); }}
            isLoading={isLoading}
            icon={<RefreshCw className="w-4 h-4" />}
            className="text-xs"
          >
            تازه‌سازی
          </EButton>
        </div>
      </HeaderPages>

      {/* 2. Top Summary Stat Cards */}
      <OrderStatCards
        stats={data.stats}
        onFilterClick={(status) => handleStatusTabChange(status)}
      />

      {/* 3. Filter Bar (Status Tabs, Search, Payment Filter, Reset) */}
      <OrderFilterBar
        currentStatus={filters.status || "all"}
        onStatusChange={handleStatusTabChange}
        currentPaymentStatus={filters.paymentStatus || "all"}
        onPaymentStatusChange={handlePaymentFilterChange}
        searchTerm={filters.search || ""}
        onSearchChange={handleSearch}
        counts={data.counts}
      />

      {/* 4. Main Content Area */}
      {error ? (
        <AllertMassage title="خطا در دریافت سفارش‌ها" message={error} variant="danger" />
      ) : isLoading ? (
        <OrderSkeletonList />
      ) : data.orders.length === 0 ? (
        /* Empty State */
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center flex flex-col items-center justify-center min-h-[300px]">
          <EmptyState
            title={isFiltered ? "سفارشی با این مشخصات یافت نشد" : "هنوز سفارشی ثبت نشده است"}
            description={
              isFiltered
                ? "لطفاً عبارت جستجو را تغییر دهید یا فیلتر وضعیت را به «همه سفارش‌ها» تغییر دهید."
                : "پس از ثبت سفارش در فروشگاه، اطلاعات آن در این بخش نمایش داده می‌شود."
            }
            icon={isFiltered ? <FilterX className="w-10 h-10 text-slate-500" /> : <Inbox className="w-10 h-10 text-indigo-400" />}
            action={
              isFiltered ? (
                <EButton
                  variant="primary"
                  size="md"
                  onClick={() => {
                    handleStatusTabChange("all");
                    handlePaymentFilterChange("all");
                    handleSearch("");
                  }}
                  icon={<RotateCcw className="w-4 h-4" />}
                  className="text-xs mt-2"
                >
                  پاکسازی فیلترها
                </EButton>
              ) : undefined
            }
          />
        </div>
      ) : (
        /* Data Present: Responsive Table on Desktop (>= 768px) and Cards on Mobile (< 768px) */
        <div className="flex flex-col gap-4">
          {/* Desktop Table */}
          <OrderTable
            orders={data.orders}
            onOpenInvoice={handleOpenInvoice}
            onOpenStatusDialog={handleOpenStatusDialog}
            onPrintInvoice={handleOpenPrintModal}
            canUpdateFulfillment={canUpdateFulfillment}
          />

          {/* Mobile Cards List */}
          <div className="md:hidden flex flex-col gap-3">
            {data.orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onOpenInvoice={handleOpenInvoice}
                onOpenStatusDialog={handleOpenStatusDialog}
                onPrintInvoice={handleOpenPrintModal}
                canUpdateFulfillment={canUpdateFulfillment}
              />
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 mt-2">
              <span className="text-xs text-slate-400">
                نمایش {(data.page - 1) * data.limit + 1} تا{" "}
                {Math.min(data.page * data.limit, data.total)} از مجموع {data.total} سفارش
              </span>

              <EPagination
                currentPage={data.page}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. Modals & Drawers                                                       */}
      {/* ========================================================================= */}
      {/* Invoice Details Modal */}
      <OrderInvoiceModal
        order={selectedOrderForInvoice}
        isOpen={isInvoiceModalOpen}
        onClose={handleCloseInvoice}
        onOpenStatusDialog={handleOpenStatusDialog}
        onPrintInvoice={handleOpenPrintModal}
        canUpdateFulfillment={canUpdateFulfillment}
      />

      {/* Fulfillment Status Change Dialog */}
      <OrderStatusDialog
        order={selectedOrderForStatus}
        isOpen={isStatusDialogOpen}
        onClose={handleCloseStatusDialog}
        onConfirm={handleUpdateFulfillment}
        isLoading={isMutating}
      />

      {/* Print Preview Modal */}
      <OrderPrintModal
        order={selectedOrderForPrint}
        isOpen={isPrintModalOpen}
        onClose={handleClosePrintModal}
      />
    </div>
  );
};

export default OrdersContainer;
