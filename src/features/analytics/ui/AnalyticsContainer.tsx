import React from "react";
import { useAnalytics } from "../hooks/useAnalytics";
import KpiSummaryCards from "./KpiSummaryCards";
import SalesTrendChart from "./SalesTrendChart";
import CategoryShareChart from "./CategoryShareChart";
import RecentOrdersWidget from "./RecentOrdersWidget";
import TopCustomersWidget from "./TopCustomersWidget";
import AnalyticsSkeleton from "./AnalyticsSkeleton";
import HeaderPages from "@/shared-app/headerPages";
import { EButton } from "@/shared-app/designSystem/button";
import type { TimeRangeFilter } from "@/types/analytics";
import {
  TrendingUp,
  RefreshCw,
  Calendar,
  Users,
  Tag,
  Truck,
  Package,
} from "lucide-react";

interface AnalyticsContainerProps {
  onNavigate?: (route: "orders" | "products" | "customers" | "coupons") => void;
}

export const AnalyticsContainer: React.FC<AnalyticsContainerProps> = ({ onNavigate }) => {
  const {
    timeRange,
    metrics,
    isLoading,
    handleTimeRangeChange,
    handleRefresh,
  } = useAnalytics();

  const timeRangeOptions: { id: TimeRangeFilter; label: string }[] = [
    { id: "7d", label: "۷ روز گذشته" },
    { id: "30d", label: "۳۰ روز اخیر" },
    { id: "90d", label: "۳ ماهه (فصلی)" },
    { id: "1y", label: "یک‌ساله (سال جاری)" },
  ];

  return (
    <div id="analytics-container" className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
      {/* 1. Header with Time Range Switcher & Refresh */}
      <HeaderPages
        title="داشبورد تحلیلی و شاخص‌های کلیدی فروشگاه"
        subtitle="بررسی آمار فروش، نرخ رشد، سهم دسته‌بندی‌ها و رفتار مشتریان (اسپرینت ۴)"
      >
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time Range Switcher */}
          <div className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs">
            {timeRangeOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                id={`time-range-${opt.id}`}
                onClick={() => handleTimeRangeChange(opt.id)}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === opt.id
                    ? "bg-indigo-600 text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Refresh button */}
          <EButton
            variant="secondary"
            size="md"
            onClick={handleRefresh}
            isLoading={isLoading}
            icon={<RefreshCw className="w-4 h-4" />}
            className="text-xs"
          >
            تازه‌سازی
          </EButton>
        </div>
      </HeaderPages>

      {/* 2. Quick Navigation Shortcuts to All Sprints */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate("orders")}
          className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between text-right cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">مرسولات و سفارش‌ها</div>
              <div className="text-[10px] text-slate-400">رهگیری و فاکتورها</div>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate && onNavigate("products")}
          className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/40 transition-all flex items-center justify-between text-right cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 group-hover:scale-105 transition-transform">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">کاتالوگ و انبارداری</div>
              <div className="text-[10px] text-slate-400">موجودی و کالاها</div>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate && onNavigate("customers")}
          className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-between text-right cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">باشگاه مشتریان (CRM)</div>
              <div className="text-[10px] text-slate-400">سطوح وفاداری VIP</div>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate && onNavigate("coupons")}
          className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between text-right cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">کدهای تخفیف</div>
              <div className="text-[10px] text-slate-400">جشنواره و پروموشن</div>
            </div>
          </div>
        </button>
      </div>

      {/* 3. Main Dashboard Content Area */}
      {isLoading && !metrics ? (
        <AnalyticsSkeleton />
      ) : (
        <div className="flex flex-col gap-6">
          {/* KPI Stat Cards */}
          <KpiSummaryCards metrics={metrics} />

          {/* Charts Row: Trend Chart (8 cols) + Category Share (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <SalesTrendChart
                data={metrics?.salesTrend || []}
                title={`روند درآمد و فروش (${
                  timeRange === "7d"
                    ? "۷ روز اخیر"
                    : timeRange === "30d"
                    ? "۳۰ روز اخیر"
                    : timeRange === "90d"
                    ? "فصل جاری"
                    : "سال جاری"
                })`}
              />
            </div>

            <div className="lg:col-span-4">
              <CategoryShareChart
                data={metrics?.categorySalesShare || []}
              />
            </div>
          </div>

          {/* Bottom Snippets: Recent Orders & Top VIP Customers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentOrdersWidget
              orders={metrics?.recentOrdersSnippet || []}
              onViewAllOrders={() => onNavigate && onNavigate("orders")}
            />

            <TopCustomersWidget
              customers={metrics?.topCustomersSnippet || []}
              onViewAllCustomers={() => onNavigate && onNavigate("customers")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsContainer;
