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

interface CouponCardProps {
  coupon: DiscountCoupon;
  onEdit: (coupon: DiscountCoupon) => void;
  onDelete: (couponId: string) => void;
  onToggleStatus: (couponId: string) => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    useToastStore.success(`کد «${coupon.code}» کپی شد.`);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active":
        return { label: "فعال", status: "active" as const };
      case "expired":
        return { label: "منقضی", status: "inactive" as const };
      default:
        return { label: "غیرفعال", status: "inactive" as const };
    }
  };

  const statusInfo = getStatusInfo(coupon.status);
  const usagePercent = Math.min(
    100,
    Math.round((coupon.usedCount / coupon.usageLimit) * 100)
  );
  const isPercentage = coupon.type === "percentage";

  return (
    <div
      id={`coupon-card-${coupon.id}`}
      className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col gap-3.5"
    >
      {/* 1. Header: Code + Copy + Switch Status */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
            <Tag className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-mono font-bold text-white text-sm tracking-wider truncate">
              {coupon.code}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="p-1 rounded-md bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
              title="کپی کردن کد"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ESwitch
            checked={coupon.status === "active"}
            onCheckedChange={() => onToggleStatus(coupon.id)}
          />
          <ActivationBage
            label={statusInfo.label}
            status={statusInfo.status}
            className="text-[10px] px-1.5 py-0"
          />
        </div>
      </div>

      {/* 2. Body: Value + Description */}
      <div className="flex items-center justify-between gap-2">
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
              <span>{coupon.value.toLocaleString("fa-IR")} تومان</span>
            </>
          )}
        </span>

        <span className="text-[11px] text-slate-400">
          {coupon.minOrderValue && coupon.minOrderValue > 0
            ? `حداقل ${(coupon.minOrderValue / 1000000).toFixed(1)} م تومان`
            : "بدون سقف خرید"}
        </span>
      </div>

      {coupon.description && (
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {coupon.description}
        </p>
      )}

      {/* 3. Usage Bar */}
      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">مصرف شده: {coupon.usedCount} از {coupon.usageLimit}</span>
          <span className="text-indigo-400 font-bold font-mono">%{usagePercent}</span>
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

      {/* 4. Footer: Expiry + Actions */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>اعتبار تا: {new Date(coupon.endDate).toLocaleDateString("fa-IR")}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(coupon)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="ویرایش"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(coupon.id)}
            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
            title="حذف"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
