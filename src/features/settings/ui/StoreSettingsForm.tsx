import React, { useState, useEffect } from "react";
import type { StoreSettings } from "@/types/settings";
import { EButton } from "@/shared-app/designSystem/button";
import { ETextField } from "@/shared-app/designSystem/textField";
import { ESelect } from "@/shared-app/designSystem/select";
import { ESwitch } from "@/shared-app/designSystem/switch";
import {
  Store,
  Receipt,
  Truck,
  FileText,
  Save,
  Building2,
  Phone,
  Mail,
  MapPin,
  Coins,
  Percent,
} from "lucide-react";

export interface StoreSettingsFormProps {
  settings: StoreSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  onSave: (settings: StoreSettings) => Promise<{ success: boolean; error?: string }>;
}

export const StoreSettingsForm: React.FC<StoreSettingsFormProps> = ({
  settings,
  isLoading,
  isSaving,
  onSave,
}) => {
  const [formData, setFormData] = useState<StoreSettings>({
    storeName: "",
    legalName: "",
    supportPhone: "",
    supportEmail: "",
    address: "",
    currency: "IRT",
    taxRate: 10,
    freeShippingThreshold: 1500000,
    orderPrefix: "DYN-",
    enableOrderTracking: true,
    invoiceFooterNote: "",
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  if (isLoading) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3 text-slate-400 text-xs animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span>در حال فراخوانی تنظیمات فروشگاه...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Store Identity & Contact Information */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">هویت برند و اطلاعات تماس فروشگاه</h3>
            <p className="text-xs text-slate-400">نام نمایشی، شماره پشتیبانی و آدرس درج‌شده در فاکتورهای رسمی مشتریان</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ETextField
            label="نام تجاری فروشگاه (Brand Name)"
            required
            value={formData.storeName}
            onValueChange={(val) => setFormData((p) => ({ ...p, storeName: val }))}
            placeholder="مثال: فروشگاه اینترنتی داینوا"
            leftIcon={<Store className="w-4 h-4" />}
          />

          <ETextField
            label="نام حقوقی / نام شرکت ثبتی"
            required
            value={formData.legalName}
            onValueChange={(val) => setFormData((p) => ({ ...p, legalName: val }))}
            placeholder="مثال: شرکت تجارت الکترونیک داینوا پیشرو"
            leftIcon={<Building2 className="w-4 h-4" />}
          />

          <ETextField
            label="شماره تماس پشتیبانی مشتریان"
            required
            value={formData.supportPhone}
            onValueChange={(val) => setFormData((p) => ({ ...p, supportPhone: val }))}
            placeholder="۰۲۱-۸۸۹۹۰۰۱۱"
            leftIcon={<Phone className="w-4 h-4" />}
          />

          <ETextField
            label="ایمیل سازمانی پشتیبانی"
            required
            type="email"
            value={formData.supportEmail}
            onValueChange={(val) => setFormData((p) => ({ ...p, supportEmail: val }))}
            placeholder="support@dynova.store"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div className="sm:col-span-2">
            <ETextField
              label="نشانی پستی دفتر مرکزی و انبار"
              required
              multiline
              rows={2}
              value={formData.address}
              onValueChange={(val) => setFormData((p) => ({ ...p, address: val }))}
              placeholder="تهران، خیابان ولیعصر..."
              leftIcon={<MapPin className="w-4 h-4" />}
            />
          </div>
        </div>
      </div>

      {/* 2. Financial, Currency & Tax Configuration (PBI-5.2) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">تنظیمات مالیاتی، ارز پیش‌فرض و سفارش‌ها</h3>
            <p className="text-xs text-slate-400">نرخ ارزش افزوده قانونی، حداقل سقف ارسال رایگان و پیشوند شماره فاکتور</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ESelect
            label="واحد پولی رسمی فروشگاه"
            value={formData.currency}
            onValueChange={(val) => setFormData((p) => ({ ...p, currency: val as "IRT" | "IRR" }))}
            options={[
              { value: "IRT", label: "تومان ایران (IRT) - پیش‌فرض" },
              { value: "IRR", label: "ریال ایران (IRR)" },
            ]}
          />

          <ETextField
            label="نرخ مالیات بر ارزش افزوده (٪)"
            type="number"
            inputMode="numeric"
            value={formData.taxRate.toString()}
            onValueChange={(val) => setFormData((p) => ({ ...p, taxRate: Number(val) || 0 }))}
            placeholder="10"
            helperText="درصد مالیات ارزش افزوده روی اقلام فاکتور"
            leftIcon={<Percent className="w-4 h-4" />}
          />

          <ETextField
            label="سقف خرید جهت ارسال رایگان (تومان)"
            type="number"
            inputMode="numeric"
            value={formData.freeShippingThreshold.toString()}
            onValueChange={(val) =>
              setFormData((p) => ({ ...p, freeShippingThreshold: Number(val) || 0 }))
            }
            placeholder="1500000"
            helperText="سفارش‌های بالاتر از این مبلغ رایگان ارسال می‌شوند"
            leftIcon={<Coins className="w-4 h-4" />}
          />

          <ETextField
            label="پیشوند شماره سفارش (Order Prefix)"
            value={formData.orderPrefix}
            onValueChange={(val) => setFormData((p) => ({ ...p, orderPrefix: val }))}
            placeholder="DYN-"
            helperText="مثال: DYN-10492"
            className="font-mono"
          />

          <div className="sm:col-span-2 flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white block">رهگیری زنده و عمومی سفارش‌ها</span>
              <span className="text-[11px] text-slate-400 block">
                به مشتریان اجازه می‌دهد با کد پیگیری و شماره موبایل وضعیت را استعلام کنند.
              </span>
            </div>
            <ESwitch
              checked={formData.enableOrderTracking}
              onCheckedChange={(checked: boolean) =>
                setFormData((p) => ({ ...p, enableOrderTracking: checked }))
              }
            />
          </div>
        </div>

        <div>
          <ETextField
            label="متن پیش‌فرض فوتر فاکتور چاپی / پیش‌فاکتور"
            multiline
            rows={2}
            value={formData.invoiceFooterNote}
            onValueChange={(val) => setFormData((p) => ({ ...p, invoiceFooterNote: val }))}
            placeholder="پیام تشکر یا شرایط گارانتی درج‌شده در زیر فاکتور رسمی..."
            leftIcon={<FileText className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <EButton
          variant="primary"
          size="lg"
          type="submit"
          isLoading={isSaving}
          icon={<Save className="w-4 h-4" />}
          className="text-xs font-bold px-8 shadow-lg shadow-indigo-600/20"
        >
          ذخیره کلیه تنظیمات فروشگاه
        </EButton>
      </div>
    </form>
  );
};

export default StoreSettingsForm;
