import React from "react";
import type { FulfillmentStatus, PaymentStatus, OrderCounts } from "@/types/order";
import { SearchBox } from "@/shared-app/designSystem/searchBox";
import { ESelect, type SelectOption } from "@/shared-app/designSystem/select";
import { EButton } from "@/shared-app/designSystem/button";
import { RotateCcw, Filter, Clock, PackageCheck, Truck, CheckCircle2, XCircle, Layers } from "lucide-react";

export interface OrderFilterBarProps {
  currentStatus: FulfillmentStatus | "all";
  onStatusChange: (status: FulfillmentStatus | "all") => void;
  currentPaymentStatus: PaymentStatus | "all";
  onPaymentStatusChange: (status: PaymentStatus | "all") => void;
  searchTerm: string;
  onSearchChange: (query: string) => void;
  counts: OrderCounts;
  onResetMockData: () => void;
  isResetting?: boolean;
  className?: string;
}

export const OrderFilterBar: React.FC<OrderFilterBarProps> = ({
  currentStatus,
  onStatusChange,
  currentPaymentStatus,
  onPaymentStatusChange,
  searchTerm,
  onSearchChange,
  counts,
  onResetMockData,
  isResetting = false,
  className = "",
}) => {
  const tabs: Array<{
    id: FulfillmentStatus | "all";
    label: string;
    count: number;
    icon: React.ReactNode;
  }> = [
    {
      id: "all",
      label: "همه سفارش‌ها",
      count: counts.all,
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: "processing",
      label: "در حال پردازش",
      count: counts.processing,
      icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
    },
    {
      id: "ready_to_ship",
      label: "آماده ارسال",
      count: counts.ready_to_ship,
      icon: <PackageCheck className="w-3.5 h-3.5 text-blue-400" />,
    },
    {
      id: "shipped",
      label: "ارسال شده",
      count: counts.shipped,
      icon: <Truck className="w-3.5 h-3.5 text-purple-400" />,
    },
    {
      id: "delivered",
      label: "تحویل شده",
      count: counts.delivered,
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
    },
    {
      id: "canceled",
      label: "لغو شده",
      count: counts.canceled,
      icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
    },
  ];

  const paymentOptions: SelectOption[] = [
    { value: "all", label: "همه وضعیت‌های پرداخت" },
    { value: "paid", label: "پرداخت موفق (Paid)" },
    { value: "pending", label: "در انتظار پرداخت (Pending)" },
    { value: "failed", label: "پرداخت ناموفق (Failed)" },
    { value: "refunded", label: "مسترد شده (Refunded)" },
  ];

  return (
    <div className={`flex flex-col gap-3.5 ${className}`}>
      {/* 1. Horizontal Status Tabs with responsive scrollbar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar sm:flex-wrap">
        {tabs.map((tab) => {
          const isActive = currentStatus === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              id={`order-tab-${tab.id}`}
              onClick={() => onStatusChange(tab.id)}
              className={`
                flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap 
                transition-all duration-150 cursor-pointer shrink-0 border
                ${
                  isActive
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20 font-semibold"
                    : "bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 hover:border-slate-700"
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`
                  text-[11px] px-1.5 py-0.2 rounded-full font-mono font-medium transition-colors
                  ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-800 text-slate-400"
                  }
                `}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Secondary Filter Bar: Search, Payment Status Dropdown, and Reset */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <SearchBox
            value={searchTerm}
            onSearch={onSearchChange}
            placeholder="جستجوی شماره سفارش، نام مشتری، شماره همراه، کد رهگیری، شهر..."
            className="w-full"
          />
        </div>

        {/* Payment status filter & Reset button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-48 sm:w-52">
            <ESelect
              value={currentPaymentStatus}
              onValueChange={(val) => onPaymentStatusChange(val as PaymentStatus | "all")}
              options={paymentOptions}
            />
          </div>

          <EButton
            variant="secondary"
            size="md"
            onClick={onResetMockData}
            isLoading={isResetting}
            title="بازنشانی داده‌های ماک سفارش‌ها به حالت اولیه"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            className="shrink-0 text-xs text-slate-300 hover:text-white"
          >
            <span className="hidden md:inline">ریست دیتای ماک</span>
          </EButton>
        </div>
      </div>
    </div>
  );
};

export default OrderFilterBar;
