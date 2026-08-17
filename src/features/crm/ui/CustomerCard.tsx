import React from "react";
import type { Customer } from "@/types/crm";
import { EButton } from "@/shared-app/designSystem/button";
import ActivationBage from "@/shared-app/activationbage";
import {
  Phone,
  Eye,
  Crown,
  Award,
  ShoppingBag,
  CreditCard,
  ShieldAlert,
} from "lucide-react";

interface CustomerCardProps {
  customer: Customer;
  onOpenDetail: (customer: Customer) => void;
  onToggleStatus: (customerId: string) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onOpenDetail,
  onToggleStatus,
}) => {
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "vip":
        return {
          label: "مشتری VIP",
          className: "bg-amber-500/15 text-amber-300 border-amber-500/30",
          icon: <Crown className="w-3.5 h-3.5 text-amber-400" />,
        };
      case "gold":
        return {
          label: "سطح طلایی",
          className: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
          icon: <Award className="w-3.5 h-3.5 text-yellow-400" />,
        };
      case "silver":
        return {
          label: "سطح نقره‌ای",
          className: "bg-slate-400/10 text-slate-300 border-slate-400/20",
          icon: <Award className="w-3.5 h-3.5 text-slate-300" />,
        };
      default:
        return {
          label: "سطح برنزی",
          className: "bg-orange-500/10 text-orange-300 border-orange-500/20",
          icon: <Award className="w-3.5 h-3.5 text-orange-400" />,
        };
    }
  };

  const tierInfo = getTierBadge(customer.tier);
  const isBlocked = customer.status === "blocked";

  return (
    <div
      id={`customer-card-${customer.id}`}
      className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col gap-3.5"
    >
      {/* 1. Header: Avatar + Name + Phone + Tier Badge */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={
              customer.avatar ||
              `https://api.dicebear.com/7.x/bottts/svg?seed=${customer.id}`
            }
            alt={customer.name}
            className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-800 shrink-0"
          />

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm truncate">
                {customer.name}
              </span>
              {isBlocked && (
                <span className="p-0.5 rounded bg-rose-500/20 text-rose-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            <a
              href={`tel:${customer.phone}`}
              className="inline-flex items-center gap-1 text-xs text-indigo-400 font-mono mt-0.5"
              dir="ltr"
            >
              <Phone className="w-3 h-3" />
              <span>{customer.phone}</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tierInfo.className}`}
          >
            {tierInfo.icon}
            <span>{tierInfo.label}</span>
          </span>

          <ActivationBage
            label={isBlocked ? "مسدود" : "فعال"}
            status={isBlocked ? "inactive" : "active"}
            className="text-[10px] px-1.5 py-0"
          />
        </div>
      </div>

      {/* 2. Content: 2-column metrics summary box */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
        {/* Total Spent */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <CreditCard className="w-3 h-3 text-emerald-400" />
            <span>مجموع خریدها:</span>
          </div>
          <span className="font-bold text-emerald-400 text-xs sm:text-sm truncate">
            {customer.totalSpent.toLocaleString("fa-IR")} تومان
          </span>
        </div>

        {/* Total Orders */}
        <div className="flex flex-col gap-0.5 border-r border-slate-800/80 pr-2.5">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ShoppingBag className="w-3 h-3 text-indigo-400" />
            <span>تعداد کل سفارش‌ها:</span>
          </div>
          <span className="font-bold text-white text-xs sm:text-sm font-mono">
            {customer.totalOrders.toLocaleString("fa-IR")} سفارش
          </span>
        </div>
      </div>

      {/* 3. Footer: Direct Call Button + View Profile */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <a
          href={`tel:${customer.phone}`}
          className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
          <span>تماس مستقیم</span>
        </a>

        <EButton
          variant="primary"
          size="sm"
          onClick={() => onOpenDetail(customer)}
          icon={<Eye className="w-3.5 h-3.5" />}
          className="text-xs justify-center"
        >
          مشاهده پروفایل
        </EButton>
      </div>
    </div>
  );
};

export default CustomerCard;
