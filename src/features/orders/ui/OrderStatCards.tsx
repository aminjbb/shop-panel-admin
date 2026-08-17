import React from "react";
import type { OrderStats } from "@/types/order";
import { DollarSign, Clock, Truck, CheckCircle, Package } from "lucide-react";

export interface OrderStatCardsProps {
  stats: OrderStats;
  className?: string;
  onFilterClick?: (status: "processing" | "shipped" | "delivered" | "all") => void;
}

export const OrderStatCards: React.FC<OrderStatCardsProps> = ({
  stats,
  className = "",
  onFilterClick,
}) => {
  const formatToman = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
  };

  const cards = [
    {
      id: "revenue",
      title: "درآمد کل پرداخت‌شده",
      value: formatToman(stats.totalRevenue),
      subtext: `${new Intl.NumberFormat("fa-IR").format(stats.totalOrdersCount)} سفارش کل`,
      icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
      bgIcon: "bg-emerald-500/10 border-emerald-500/20",
      accent: "text-emerald-400",
      filterKey: "all" as const,
    },
    {
      id: "pending",
      title: "در انتظار آماده‌سازی و انبار",
      value: `${new Intl.NumberFormat("fa-IR").format(stats.pendingFulfillmentCount)} سفارش`,
      subtext: "نیاز به بررسی و بسته‌بندی",
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      bgIcon: "bg-amber-500/10 border-amber-500/20",
      accent: "text-amber-400",
      filterKey: "processing" as const,
    },
    {
      id: "shipped",
      title: "مرسولات در مسیر پست",
      value: `${new Intl.NumberFormat("fa-IR").format(stats.shippedCount)} مرسوله`,
      subtext: "تحویل به ناوگان حمل‌ونقل",
      icon: <Truck className="w-5 h-5 text-purple-400" />,
      bgIcon: "bg-purple-500/10 border-purple-500/20",
      accent: "text-purple-400",
      filterKey: "shipped" as const,
    },
    {
      id: "delivered",
      title: "تحویل قطعی به مشتری",
      value: `${new Intl.NumberFormat("fa-IR").format(stats.deliveredCount)} مرسوله`,
      subtext: "تکمیل موفق زنجیره سفارش",
      icon: <CheckCircle className="w-5 h-5 text-indigo-400" />,
      bgIcon: "bg-indigo-500/10 border-indigo-500/20",
      accent: "text-indigo-400",
      filterKey: "delivered" as const,
    },
  ];

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 ${className}`}>
      {cards.map((c) => (
        <div
          key={c.id}
          onClick={() => onFilterClick && onFilterClick(c.filterKey)}
          className={`p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm flex flex-col justify-between transition-all duration-200 ${
            onFilterClick
              ? "hover:border-slate-700 hover:bg-slate-900 cursor-pointer active:scale-[0.99]"
              : ""
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-medium text-slate-400 truncate">{c.title}</span>
            <div className={`p-2 rounded-lg border shrink-0 ${c.bgIcon}`}>{c.icon}</div>
          </div>

          <div>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight">
              {c.value}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 truncate">{c.subtext}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatCards;
