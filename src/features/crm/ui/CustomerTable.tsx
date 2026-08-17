import React from "react";
import type { Customer } from "@/types/crm";
import { EButton } from "@/shared-app/designSystem/button";
import ActivationBage from "@/shared-app/activationbage";
import {
  Crown,
  Award,
  Phone,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Mail,
} from "lucide-react";

interface CustomerTableProps {
  customers: Customer[];
  onOpenDetail: (customer: Customer) => void;
  onToggleStatus: (customerId: string) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onOpenDetail,
  onToggleStatus,
}) => {
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "vip":
        return {
          label: "مشتری VIP",
          status: "active" as const,
          icon: <Crown className="w-3 h-3 text-amber-400" />,
          className: "bg-amber-500/10 text-amber-300 border-amber-500/30",
        };
      case "gold":
        return {
          label: "طلایی",
          status: "active" as const,
          icon: <Award className="w-3 h-3 text-yellow-400" />,
          className: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
        };
      case "silver":
        return {
          label: "نقره‌ای",
          status: "info" as const,
          icon: <Award className="w-3 h-3 text-slate-300" />,
          className: "bg-slate-500/10 text-slate-300 border-slate-500/20",
        };
      default:
        return {
          label: "برنزی",
          status: "info" as const,
          icon: <Award className="w-3 h-3 text-orange-400" />,
          className: "bg-orange-500/10 text-orange-300 border-orange-500/20",
        };
    }
  };

  return (
    <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          {/* Table Header */}
          <thead className="bg-slate-950/80 text-slate-400 uppercase border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 font-semibold">مشتری</th>
              <th className="py-3.5 px-4 font-semibold">اطلاعات تماس</th>
              <th className="py-3.5 px-4 font-semibold text-center">سطح وفاداری</th>
              <th className="py-3.5 px-4 font-semibold text-center">تعداد سفارش</th>
              <th className="py-3.5 px-4 font-semibold">مجموع خریدها</th>
              <th className="py-3.5 px-4 font-semibold text-center">وضعیت دسترسی</th>
              <th className="py-3.5 px-4 font-semibold text-center">عملیات</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {customers.map((cust) => {
              const tierInfo = getTierBadge(cust.tier);
              const isBlocked = cust.status === "blocked";

              return (
                <tr
                  key={cust.id}
                  id={`customer-row-${cust.id}`}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  {/* 1. Customer Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          cust.avatar ||
                          `https://api.dicebear.com/7.x/bottts/svg?seed=${cust.id}`
                        }
                        alt={cust.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-800 shrink-0"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm">
                          {cust.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {cust.city ? `ساکن ${cust.city}` : "عضو رسمی"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 2. Contact */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1">
                      <a
                        href={`tel:${cust.phone}`}
                        className="inline-flex items-center gap-1.5 font-mono text-slate-200 hover:text-indigo-400 transition-colors"
                        dir="ltr"
                      >
                        <Phone className="w-3 h-3 text-indigo-400" />
                        <span>{cust.phone}</span>
                      </a>
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 truncate max-w-[180px]">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{cust.email}</span>
                      </span>
                    </div>
                  </td>

                  {/* 3. Loyalty Tier */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${tierInfo.className}`}
                    >
                      {tierInfo.icon}
                      <span>{tierInfo.label}</span>
                    </span>
                  </td>

                  {/* 4. Total Orders */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-white font-mono text-sm">
                      {cust.totalOrders.toLocaleString("fa-IR")}
                    </span>
                    <span className="text-[10px] text-slate-400 block">سفارش ثبت‌شده</span>
                  </td>

                  {/* 5. Total Spent */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-emerald-400 text-sm">
                        {cust.totalSpent.toLocaleString("fa-IR")} تومان
                      </span>
                      <span className="text-[10px] text-slate-400">
                        آخرین خرید:{" "}
                        {new Date(cust.lastOrderDate).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                  </td>

                  {/* 6. Access Status */}
                  <td className="py-3.5 px-4 text-center">
                    <ActivationBage
                      label={isBlocked ? "مسدود شده" : "حساب فعال"}
                      status={isBlocked ? "inactive" : "active"}
                      className="text-xs"
                    />
                  </td>

                  {/* 7. Action Buttons */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <EButton
                        variant="secondary"
                        size="sm"
                        onClick={() => onOpenDetail(cust)}
                        icon={<Eye className="w-3.5 h-3.5" />}
                        className="text-xs px-2.5"
                      >
                        پروفایل
                      </EButton>

                      <button
                        type="button"
                        onClick={() => onToggleStatus(cust.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isBlocked
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                        }`}
                        title={isBlocked ? "رفع مسدودی حساب" : "مسدودسازی حساب مشتری"}
                      >
                        {isBlocked ? (
                          <ShieldCheck className="w-4 h-4" />
                        ) : (
                          <ShieldAlert className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;
