import React, { useState } from "react";
import type { DiscountCoupon } from "@/types/crm";
import { ESwitch } from "@/shared-app/designSystem/switch";
import ActivationBage from "@/shared-app/activationbage";
import useToastStore from "@/shared-app/designSystem/toast/store";
import {
  Tag,
  Copy,
  Check,
  Edit2,
  Trash2,
  Calendar,
  Percent,
  Coins,
} from "lucide-react";

interface CouponTableProps {
  coupons: DiscountCoupon[];
  onEdit: (coupon: DiscountCoupon) => void;
  onDelete: (couponId: string) => void;
  onToggleStatus: (couponId: string) => void;
}

export const CouponTable: React.FC<CouponTableProps> = ({
  coupons,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    useToastStore.success(`کد «${code}» در کلیپ‌بورد کپی شد.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active":
        return { label: "فعال", status: "active" as const };
      case "expired":
        return { label: "منقضی شده", status: "inactive" as const };
      default:
        return { label: "غیرفعال", status: "inactive" as const };
    }
  };

  return (
    <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          {/* Table Header */}
          <thead className="bg-slate-950/80 text-slate-400 uppercase border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 font-semibold">کد تخفیف</th>
              <th className="py-3.5 px-4 font-semibold">میزان و نوع تخفیف</th>
              <th className="py-3.5 px-4 font-semibold">حداقل خرید / دسته</th>
              <th className="py-3.5 px-4 font-semibold text-center">ظرفیت و مصرف</th>
              <th className="py-3.5 px-4 font-semibold">مهلت اعتبار</th>
              <th className="py-3.5 px-4 font-semibold text-center">وضعیت</th>
              <th className="py-3.5 px-4 font-semibold text-center">عملیات</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {coupons.map((coupon) => {
              const statusInfo = getStatusInfo(coupon.status);
              const usagePercent = Math.min(
                100,
                Math.round((coupon.usedCount / coupon.usageLimit) * 100)
              );
              const isCopied = copiedId === coupon.id;
              const isPercentage = coupon.type === "percentage";

              return (
                <tr
                  key={coupon.id}
                  id={`coupon-row-${coupon.id}`}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  {/* 1. Code & Copy */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-white text-sm tracking-wider">
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(coupon.code, coupon.id)}
                            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="کپی کردن کد تخفیف"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {coupon.description && (
                          <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                            {coupon.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 2. Type & Value */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isPercentage
                            ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                            : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                        }`}
                      >
                        {isPercentage ? (
                          <>
                            <Percent className="w-3 h-3" />
                            <span>{coupon.value}٪ تخفیف</span>
                          </>
                        ) : (
                          <>
                            <Coins className="w-3 h-3" />
                            <span>{coupon.value.toLocaleString("fa-IR")} ت</span>
                          </>
                        )}
                      </span>
                    </div>
                  </td>

                  {/* 3. Min Order & Category */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-200">
                        {coupon.minOrderValue && coupon.minOrderValue > 0
                          ? `حداقل ${(coupon.minOrderValue / 1000000).toFixed(1)} م تومان`
                          : "بدون سقف خرید"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {coupon.applicableCategory || "تمامی کالاها"}
                      </span>
                    </div>
                  </td>

                  {/* 4. Usage Bar */}
                  <td className="py-3.5 px-4 text-center min-w-[130px]">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">{coupon.usedCount} مصرف</span>
                        <span className="text-white font-bold">{coupon.usageLimit} کل</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            usagePercent >= 90
                              ? "bg-rose-500"
                              : usagePercent >= 60
                              ? "bg-amber-500"
                              : "bg-indigo-500"
                          }`}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* 5. Date Validity */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-300 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>
                        {new Date(coupon.endDate).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                  </td>

                  {/* 6. Status & Switch */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-2">
                      <ESwitch
                        checked={coupon.status === "active"}
                        onCheckedChange={() => onToggleStatus(coupon.id)}
                      />
                      <ActivationBage
                        label={statusInfo.label}
                        status={statusInfo.status}
                        className="text-xs"
                      />
                    </div>
                  </td>

                  {/* 7. Action Buttons */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(coupon)}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                        title="ویرایش کد تخفیف"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(coupon.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="حذف کوپن"
                      >
                        <Trash2 className="w-4 h-4" />
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

export default CouponTable;
