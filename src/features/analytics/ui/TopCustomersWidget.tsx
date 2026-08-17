import React from "react";
import type { TopCustomerSnippet } from "@/types/analytics";
import { Crown, ChevronLeft, Award } from "lucide-react";

interface TopCustomersWidgetProps {
  customers?: TopCustomerSnippet[];
  onViewAllCustomers?: () => void;
}

export const TopCustomersWidget: React.FC<TopCustomersWidgetProps> = ({
  customers = [],
  onViewAllCustomers,
}) => {
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "vip":
        return {
          label: "مشتری VIP",
          className: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        };
      case "gold":
        return {
          label: "سطح طلایی",
          className: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
        };
      case "silver":
        return {
          label: "سطح نقره‌ای",
          className: "bg-slate-400/10 text-slate-300 border-slate-400/20",
        };
      default:
        return {
          label: "سطح برنزی",
          className: "bg-orange-500/10 text-orange-300 border-orange-500/20",
        };
    }
  };

  return (
    <div
      id="top-customers-widget"
      className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              برترین مشتریان باشگاه وفاداری
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">بیشترین حجم خرید در دینووا</p>
          </div>
        </div>

        {onViewAllCustomers && (
          <button
            type="button"
            onClick={onViewAllCustomers}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer font-medium"
          >
            <span>باشگاه CRM</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Customer items */}
      <div className="divide-y divide-slate-800/60 my-2">
        {customers.map((c, idx) => {
          const tier = getTierBadge(c.tier);
          return (
            <div
              key={c.id}
              className="py-3 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={
                      c.avatar ||
                      `https://api.dicebear.com/7.x/bottts/svg?seed=${c.id}`
                    }
                    alt={c.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-800"
                  />
                  {idx === 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[9px] font-black">
                      ۱
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white truncate">
                      {c.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {c.totalOrders} سفارش موفق ثبت‌شده
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="font-bold text-emerald-400">
                  {c.totalSpent.toLocaleString("fa-IR")} ت
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${tier.className}`}
                >
                  <Award className="w-3 h-3" />
                  <span>{tier.label}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-2 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 text-center">
        رتبه‌بندی خودکار بر اساس حجم تراکنش‌ها
      </div>
    </div>
  );
};

export default TopCustomersWidget;
