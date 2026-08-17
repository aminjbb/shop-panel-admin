import React, { useState } from "react";
import type { AdminRole, CreateStaffPayload } from "@/types/settings";
import { BottomSheet } from "@/shared-app/bottomSheet";
import { EButton } from "@/shared-app/designSystem/button";
import { ETextField } from "@/shared-app/designSystem/textField";
import { ESelect } from "@/shared-app/designSystem/select";
import { ESwitch } from "@/shared-app/designSystem/switch";
import { UserPlus, Shield, ShieldCheck, Headphones, Mail, User, Phone } from "lucide-react";

export interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateStaffPayload) => Promise<{ success: boolean }>;
  isSubmitting?: boolean;
}

export const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isSubmitting = false,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<AdminRole>("support_agent");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setRole("support_agent");
    setIsActive(true);
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) {
      errs.fullName = "نام و نام خانوادگی الزامی است.";
    }
    if (!email.trim() || !email.includes("@")) {
      errs.email = "آدرس ایمیل معتبر الزامی است.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateStaffPayload = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      role,
      status: isActive ? "active" : "inactive",
    };

    const res = await onSave(payload);
    if (res.success) {
      resetForm();
      onClose();
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title={
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-indigo-400" />
          <span>تعریف مدیر جدید و صدور سطح دسترسی</span>
        </div>
      }
      subtitle="ارسال دعوت‌نامه ورود به پنل مدیریت برای همکاران"
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 sm:p-5">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">
            نام و نام خانوادگی: <span className="text-rose-400">*</span>
          </label>
          <ETextField
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. آرش طاهری"
            className="w-full text-xs"
            error={!!errors.fullName}
          />
          {errors.fullName && (
            <span className="text-[11px] text-rose-400">{errors.fullName}</span>
          )}
        </div>

        {/* Corporate Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">
            آدرس ایمیل سازمانی: <span className="text-rose-400">*</span>
          </label>
          <ETextField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. arash.t@dynova.ir"
            className="w-full text-xs text-left font-mono"
            dir="ltr"
            error={!!errors.email}
          />
          {errors.email && (
            <span className="text-[11px] text-rose-400">{errors.email}</span>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">
            شماره موبایل جهت احراز هویت:
          </label>
          <ETextField
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. ۰۹۱۲۰۰۰۰۰۰۰"
            className="w-full text-xs"
          />
        </div>

        {/* Role Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">
            نقش سیستمی و سطح دسترسی: <span className="text-rose-400">*</span>
          </label>
          <ESelect
            value={role}
            onValueChange={(val) => setRole(val as AdminRole)}
            options={[
              { value: "super_admin", label: "مدیر کل سیستم (دسترسی نامحدود)" },
              { value: "inventory_manager", label: "مدیر انبارداری و کالاها" },
              { value: "support_agent", label: "کارشناس پشتیبانی و سفارش‌ها" },
            ]}
            className="w-full text-xs"
          />
        </div>

        {/* Role Permissions Preview */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
          <span className="font-semibold text-white">دسترسی‌های مجاز این نقش:</span>
          {role === "super_admin" && (
            <p className="text-[11px] text-purple-300">
              دسترسی کامل به امور مالی، گزارشات، تنظیمات، لجستیک و مدیریت کاربران.
            </p>
          )}
          {role === "inventory_manager" && (
            <p className="text-[11px] text-cyan-300">
              ویرایش محصولات، کنترل انبار، قیمت‌گذاری و مدیریت دسته‌بندی‌ها.
            </p>
          )}
          {role === "support_agent" && (
            <p className="text-[11px] text-amber-300">
              مشاهده سفارشات، تغییر وضعیت ارسال، بررسی باشگاه مشتریان و کدهای تخفیف.
            </p>
          )}
        </div>

        {/* Status Switch */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-xs font-semibold text-white">
            فعال بودن حساب کاربری پس از ایجاد:
          </span>
          <ESwitch
            checked={isActive}
            onCheckedChange={(checked) => setIsActive(checked)}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <EButton
            type="button"
            variant="secondary"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-xs text-slate-400"
          >
            انصراف
          </EButton>
          <EButton
            type="submit"
            isLoading={isSubmitting}
            className="text-xs font-bold px-5"
          >
            ثبت و صدور دسترسی
          </EButton>
        </div>
      </form>
    </BottomSheet>
  );
};

export default StaffModal;
