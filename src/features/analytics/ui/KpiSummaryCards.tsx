import React from "react";
import type { DashboardMetrics } from "@/types/analytics";
import {
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface KpiSummaryCardsProps {
  metrics: DashboardMetrics | null;
}

export const KpiSummaryCards: React.FC<KpiSummaryCardsProps> = ({ metrics }) => {
  if (!metrics) return null;

  const { kpis } = metrics;

  const cardConfigs = [
    {
      id: "revenue",
      title: "فروش کل و درآمد خالص",
      value: kpis.revenue.formattedValue,
      rawAmount: `${metrics.totalRevenue.toLocaleString("fa-IR")} تومان`,
      metric: kpis.revenue,
      icon: <TrendingUp className="w-5 h-5 text-indigo-400" />,
      iconBg: "bg-indigo-600/10 border-indigo-500/20",
      accentBorder: "hover:border-indigo-500/40",
    },
    {
      id: "orders",
      title: "تعداد کل سفارش‌ها",
      value: kpis.orders.formattedValue,
      rawAmount: `${metrics.totalOrdersCount} تراکنش پردازش شده`,
      metric: kpis.orders,
      icon: <ShoppingBag className="w-5 h-5 text-sky-400" />,
      iconBg: "bg-sky-600/10 border-sky-500/20",
      accentBorder: "hover:border-sky-500/40",
    },
    {
      id: "aov",
      title: "میانگین سبد خرید (AOV)",
      value: kpis.aov.formattedValue,
      rawAmount: "ارزش هر سفارش در این دوره",
      metric: kpis.aov,
      icon: <CreditCard className="w-5 h-5 text-emerald-400" />,
      iconBg: "bg-emerald-600/10 border-emerald-500/20",
      accentBorder: "hover:border-emerald-500/40",
    },
    {
      id: "customers",
      title: "مشتریان جدید و جذب‌شده",
      value: kpis.customers.formattedValue,
      rawAmount: "عضویت در باشگاه مشتریان",
      metric: kpis.customers,
      icon: <Users className="w-5 h-5 text-amber-400" />,
      iconBg: "bg-amber-600/10 border-amber-500/20",
      accentBorder: "hover:border-amber-500/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cardConfigs.map((card) => {
        const isPos = card.metric.isPositive;
        return (
          <div
            key={card.id}
            id={`kpi-card-${card.id}`}
            className={`p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 transition-all duration-200 ${card.accentBorder} flex flex-col justify-between shadow-lg relative overflow-hidden`}
          >
            {/* Top Row: Title + Icon */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs text-slate-400 font-medium truncate">
                {card.title}
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${card.iconBg}`}
              >
                {card.icon}
              </div>
            </div>

            {/* Middle Row: Main Metric Value */}
            <div className="space-y-1">
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {card.value}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {card.rawAmount}
              </div>
            </div>

            {/* Bottom Row: Percentage Comparison Badge */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  isPos
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}
              >
                {isPos ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                <span>%{card.metric.changePercentage.toLocaleString("fa-IR")}</span>
              </div>

              <span className="text-[11px] text-slate-400">
                {card.metric.comparisonLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KpiSummaryCards;
