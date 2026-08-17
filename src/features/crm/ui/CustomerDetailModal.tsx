import React from "react";
import type { Customer, CustomerTier } from "@/types/crm";
import { BottomSheet } from "@/shared-app/bottomSheet";
import { EButton } from "@/shared-app/designSystem/button";
import { ESelect } from "@/shared-app/designSystem/select";
import ActivationBage from "@/shared-app/activationbage";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Crown,
  Award,
  CreditCard,
  ShoppingBag,
  ShieldCheck,
  ShieldAlert,
  FileText,
} from "lucide-react";

interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus: (customerId: string) => void;
  onUpdateTier: (customerId: string, tier: CustomerTier) => void;
  isLoading?: boolean;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  isOpen,
  onClose,
  onToggleStatus,
  onUpdateTier,
  isLoading = false,
}) => {
  if (!customer) return null;

  const isBlocked = customer.status === "blocked";

  const tierOptions = [
    { value: "vip", label: "مشتری ویژه VIP (تخفیف‌های انحصاری)" },
    { value: "gold", label: "سطح طلایی Gold (ارسال رایگان)" },
    { value: "silver", label: "سطح نقره‌ای Silver (کد تخفیف فصلی)" },
    { value: "bronze", label: "سطح برنزی Bronze (عضو عادی)" },
  ];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" />
          <span>پروفایل و اطلاعات باشگاه مشتریان</span>
        </div>
      }
      subtitle={`شناسه کاربری: ${customer.id} • ${customer.name}`}
      size="lg"
      footer={
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <a
              href={`tel:${customer.phone}`}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>برقراری تماس</span>
            </a>

            <EButton
              variant={isBlocked ? "primary" : "destructive"}
              size="md"
              onClick={() => onToggleStatus(customer.id)}
              isLoading={isLoading}
              icon={isBlocked ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              className="text-xs"
            >
              {isBlocked ? "رفع مسدودی حساب" : "مسدودسازی حساب"}
            </EButton>
          </div>

          <EButton variant="secondary" size="md" onClick={onClose} className="text-xs">
            بستن پنجره
          </EButton>
        </div>
      }
    >
      <div className="flex flex-col gap-5 text-right">
        {/* 1. Header Profile Banner */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={
                customer.avatar ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${customer.id}`
              }
              alt={customer.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 bg-slate-800 shadow-lg"
            />
            <div className="space-y-1 text-center sm:text-right">
              <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <span>{customer.name}</span>
                <ActivationBage
                  label={isBlocked ? "مسدود شده" : "فعال"}
                  status={isBlocked ? "inactive" : "active"}
                  className="text-xs"
                />
              </h3>
              <p className="text-xs text-slate-400 font-mono" dir="ltr">
                {customer.phone}
              </p>
            </div>
          </div>

          {/* Tier Change Selector */}
          <div className="w-full sm:w-64 space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">
              تغییر سطح باشگاه وفاداری:
            </label>
            <ESelect
              value={customer.tier}
              onValueChange={(val) => onUpdateTier(customer.id, val as CustomerTier)}
              options={tierOptions}
              className="w-full text-xs"
            />
          </div>
        </div>

        {/* 2. Key Metrics Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>مجموع خرید:</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-emerald-400">
              {customer.totalSpent.toLocaleString("fa-IR")} تومان
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
              <span>سفارش‌های موفق:</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white font-mono">
              {customer.totalOrders.toLocaleString("fa-IR")} سفارش
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>تاریخ عضویت:</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-200">
              {new Date(customer.createdAt).toLocaleDateString("fa-IR")}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>موقعیت جغرافیایی:</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-200">
              {customer.city || "ثبت نشده"}
            </div>
          </div>
        </div>

        {/* 3. Detailed Contact & CRM Notes */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3 text-xs">
          <div className="font-bold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
            <Mail className="w-4 h-4 text-indigo-400" />
            <span>اطلاعات تماس و کانال‌های ارتباطی</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
            <div>
              <span className="text-slate-400">آدرس ایمیل: </span>
              <span className="font-mono text-white">{customer.email}</span>
            </div>
            <div>
              <span className="text-slate-400">آخرین سفارش ثبت‌شده: </span>
              <span className="text-white">
                {new Date(customer.lastOrderDate).toLocaleDateString("fa-IR")}
              </span>
            </div>
          </div>
        </div>

        {/* 4. CRM Staff Notes */}
        {customer.notes && (
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-1.5 text-xs">
            <div className="font-bold text-indigo-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>یادداشت کارشناس CRM:</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{customer.notes}</p>
          </div>
        )}
      </div>
    </BottomSheet>
  );
};

export default CustomerDetailModal;
