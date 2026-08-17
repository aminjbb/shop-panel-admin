import React from "react";
import type { RecentOrderSnippet } from "@/types/analytics";
import { ShoppingBag, ChevronLeft, PackageCheck, Clock, CheckCircle2, XCircle } from "lucide-react";

interface RecentOrdersWidgetProps {
  orders: RecentOrderSnippet[];
  onViewAllOrders?: () => void;
}

export const RecentOrdersWidget: React.FC<RecentOrdersWidgetProps> = ({
  orders,
  onViewAllOrders,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return {
          label: "در حال پردازش",
          className: "bg-amber-500/10 text-amber-300 border-amber-500/20",
          icon: <Clock className="w-3 h-3" />,
        };
      case "ready_to_ship":
        return {
          label: "آماده ارسال",
          className: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
          icon: <PackageCheck className="w-3 h-3" />,
        };
      case "shipped":
        return {
          label: "ارسال شده",
          className: "bg-sky-500/10 text-sky-300 border-sky-500/20",
          icon: <CheckCircle2 className="w-3 h-3" />,
        };
      case "delivered":
        return {
          label: "تحویل شده",
          className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
          icon: <CheckCircle2 className="w-3 h-3" />,
        };
      case "canceled":
        return {
          label: "لغو شده",
          className: "bg-rose-500/10 text-rose-300 border-rose-500/20",
          icon: <XCircle className="w-3 h-3" />,
        };
      default:
        return {
          label: status,
          className: "bg-slate-800 text-slate-300 border-slate-700",
          icon: null,
        };
    }
  };

  return (
    <div
      id="recent-orders-widget"
      className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              آخرین سفارش‌های ثبت‌شده
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">۵ تراکنش اخیر فروشگاه</p>
          </div>
        </div>

        {onViewAllOrders && (
          <button
            type="button"
            onClick={onViewAllOrders}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer font-medium"
          >
            <span>مشاهده همه</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Orders List */}
      <div className="divide-y divide-slate-800/60 my-2">
        {orders.map((ord) => {
          const badge = getStatusBadge(ord.status);
          return (
            <div
              key={ord.id}
              className="py-3 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">
                    {ord.orderNumber}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="font-medium text-slate-300 truncate">
                    {ord.customer}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>{ord.date}</span>
                  <span>({ord.itemsCount} قلم کالا)</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="font-bold text-white">
                  {ord.amount.toLocaleString("fa-IR")} تومان
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${badge.className}`}
                >
                  {badge.icon}
                  <span>{badge.label}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-2 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 text-center">
        همگام‌سازی بلادرنگ با سفارش‌های اسپرینت ۳
      </div>
    </div>
  );
};

export default RecentOrdersWidget;
