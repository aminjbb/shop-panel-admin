import React, { useState, useEffect } from "react";
import type {
  DiscountCoupon,
  CreateCouponPayload,
  UpdateCouponPayload,
  CouponType,
  CouponStatus,
} from "@/types/crm";
import { BottomSheet } from "@/shared-app/bottomSheet";
import { EButton } from "@/shared-app/designSystem/button";
import { ETextField } from "@/shared-app/designSystem/textField";
import { ESelect } from "@/shared-app/designSystem/select";
import { Tag, Sparkles, AlertCircle } from "lucide-react";

interface CouponFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: DiscountCoupon | null;
  mode: "create" | "edit";
  onSubmitCreate: (payload: CreateCouponPayload) => Promise<void>;
  onSubmitUpdate: (id: string, payload: UpdateCouponPayload) => Promise<void>;
  isLoading?: boolean;
}

export const CouponFormModal: React.FC<CouponFormModalProps> = ({
  isOpen,
  onClose,
  coupon,
  mode,
  onSubmitCreate,
  onSubmitUpdate,
  isLoading = false,
}) => {
  const [code, setCode] = useState("");
  const [type, setType] = useState<CouponType>("percentage");
  const [value, setValue] = useState<number>(15);
  const [minOrderValue, setMinOrderValue] = useState<number>(1000000);
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [status, setStatus] = useState<CouponStatus>("active");
  const [applicableCategory, setApplicableCategory] = useState("همه کالاها");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (coupon && mode === "edit") {
      setCode(coupon.code);
      setType(coupon.type);
      setValue(coupon.value);
      setMinOrderValue(coupon.minOrderValue || 0);
      setUsageLimit(coupon.usageLimit || 100);
      setStartDate(coupon.startDate ? coupon.startDate.split("T")[0] : "");
      setEndDate(coupon.endDate ? coupon.endDate.split("T")[0] : "");
      setStatus(coupon.status);
      setApplicableCategory(coupon.applicableCategory || "همه کالاها");
      setDescription(coupon.description || "");
    } else {
      // Default initial for Create
      const today = new Date().toISOString().split("T")[0];
      const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      setCode("");
      setType("percentage");
      setValue(20);
      setMinOrderValue(1500000);
      setUsageLimit(100);
      setStartDate(today);
      setEndDate(nextMonth);
      setStatus("active");
      setApplicableCategory("همه کالاها");
      setDescription("");
    }
    setErrors({});
  }, [coupon, mode, isOpen]);

  const generateRandomCode = () => {
    const prefixes = ["DYNOVA", "OFF", "SUPER", "VIP", "FESTIVAL"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(100 + Math.random() * 900);
    setCode(`${prefix}-${num}`);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!code.trim()) {
      newErrors.code = "وارد کردن کد تخفیف الزامی است.";
    }
    if (type === "percentage" && (value <= 0 || value > 100)) {
      newErrors.value = "درصد تخفیف باید بین ۱ تا ۱۰۰ باشد.";
    }
    if (type === "fixed_amount" && value <= 0) {
      newErrors.value = "مبلغ تخفیف باید بزرگتر از صفر باشد.";
    }
    if (!endDate) {
      newErrors.endDate = "تاریخ پایان اعتبار الزامی است.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formattedStartDate = startDate
      ? new Date(startDate).toISOString()
      : new Date().toISOString();
    const formattedEndDate = new Date(`${endDate}T23:59:59.000Z`).toISOString();

    if (mode === "create") {
      await onSubmitCreate({
        code: code.toUpperCase().trim(),
        type,
        value,
        minOrderValue,
        usageLimit,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        status,
        applicableCategory,
        description,
      });
    } else if (coupon) {
      await onSubmitUpdate(coupon.id, {
        code: code.toUpperCase().trim(),
        type,
        value,
        minOrderValue,
        usageLimit,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        status,
        applicableCategory,
        description,
      });
    }
  };

  const categoryOptions = [
    { value: "همه کالاها", label: "همه محصولات و دسته‌بندی‌ها" },
    { value: "صوتی و تصویری", label: "صوتی و هدفون" },
    { value: "ساعت هوشمند", label: "ساعت و گجت‌های پوشیدنی" },
    { value: "شارژر و پاوربانک", label: "پاوربانک و کابل" },
    { value: "لوازم جانبی", label: "لوازم جانبی و پایه‌ها" },
  ];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-indigo-400" />
          <span>{mode === "create" ? "ایجاد کد تخفیف جدید" : "ویرایش کد تخفیف"}</span>
        </div>
      }
      subtitle={
        mode === "create"
          ? "تعریف کد تخفیف درصدی یا ریالی با سقف مصرف و تاریخ انقضا"
          : `ویرایش مشخصات کوپن «${coupon?.code}»`
      }
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2">
          <EButton variant="secondary" size="md" onClick={onClose} disabled={isLoading}>
            انصراف
          </EButton>
          <EButton
            variant="primary"
            size="md"
            onClick={handleSubmit}
            isLoading={isLoading}
            className="shadow-md shadow-indigo-600/30"
          >
            {mode === "create" ? "ثبت و فعال‌سازی کوپن" : "ذخیره تغییرات"}
          </EButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-right">
        {/* 1. Code Input + Random Generator */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-300">
            کد تخفیف (لاتین): <span className="text-rose-400">*</span>
          </label>
          <div className="flex items-center gap-2">
            <ETextField
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUMMER2026"
              className="font-mono uppercase font-bold tracking-wider"
              dir="ltr"
            />
            <button
              type="button"
              onClick={generateRandomCode}
              className="px-3 py-2 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>تولید تصادفی</span>
            </button>
          </div>
          {errors.code && (
            <span className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" />
              {errors.code}
            </span>
          )}
        </div>

        {/* 2. Type & Value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300">
              نوع تخفیف:
            </label>
            <ESelect
              value={type}
              onValueChange={(val) => setType(val as CouponType)}
              options={[
                { value: "percentage", label: "درصدی (%)" },
                { value: "fixed_amount", label: "مبلغ ثابت نقدی (تومان)" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300">
              {type === "percentage" ? "میزان درصد تخفیف (٪):" : "مبلغ تخفیف (تومان):"}
            </label>
            <ETextField
              type="number"
              value={value.toString()}
              onChange={(e) => setValue(Number(e.target.value))}
              min={1}
              max={type === "percentage" ? 100 : undefined}
            />
            {errors.value && (
              <span className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.value}
              </span>
            )}
          </div>
        </div>

        {/* 3. Min Order Value & Usage Limit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300">
              حداقل مبلغ سفارش (تومان):
            </label>
            <ETextField
              type="number"
              value={minOrderValue.toString()}
              onChange={(e) => setMinOrderValue(Number(e.target.value))}
              placeholder="0 برای بدون محدودیت"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300">
              حداکثر سقف استفاده (ظرفیت):
            </label>
            <ETextField
              type="number"
              value={usageLimit.toString()}
              onChange={(e) => setUsageLimit(Number(e.target.value))}
              min={1}
            />
          </div>
        </div>

        {/* 4. Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300">
              تاریخ شروع:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300">
              تاریخ انقضا: <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
            />
            {errors.endDate && (
              <span className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {errors.endDate}
              </span>
            )}
          </div>
        </div>

        {/* 5. Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300">
              دسته کالای مشمول:
            </label>
            <ESelect
              value={applicableCategory}
              onValueChange={(val) => setApplicableCategory(val)}
              options={categoryOptions}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300">
              وضعیت انتشار:
            </label>
            <ESelect
              value={status}
              onValueChange={(val) => setStatus(val as CouponStatus)}
              options={[
                { value: "active", label: "فعال و آماده اعمال" },
                { value: "disabled", label: "غیرفعال موقت" },
              ]}
            />
          </div>
        </div>

        {/* 6. Description */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-300">
            توضیحات و شرایط استفاده:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="مثال: ویژه جشنواره تابستانه با اعمال روی تمامی هدفون‌ها"
            rows={2}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </form>
    </BottomSheet>
  );
};

export default CouponFormModal;
