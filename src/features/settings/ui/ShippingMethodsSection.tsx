import React, { useState } from "react";
import type {
  ShippingMethod,
  CreateShippingMethodPayload,
} from "@/types/settings";
import { EButton } from "@/shared-app/designSystem/button";
import { ETextField } from "@/shared-app/designSystem/textField";
import { ESelect } from "@/shared-app/designSystem/select";
import { ESwitch } from "@/shared-app/designSystem/switch";
import { BottomSheet } from "@/shared-app/bottomSheet";
import EmptyState from "@/shared-app/emptyState";
import { ShippingMethodTable } from "./ShippingMethodTable";
import {
  Truck,
  Plus,
  Zap,
  Clock,
  MapPin,
  Save,
  CheckCircle2,
  Coins,
} from "lucide-react";

export interface ShippingMethodsSectionProps {
  shippingMethods: ShippingMethod[];
  isLoading: boolean;
  isSubmitting: boolean;
  onToggleStatus: (id: string) => void;
  onCreateMethod: (payload: CreateShippingMethodPayload) => Promise<{ success: boolean; error?: string }>;
  onUpdateMethod: (id: string, payload: Partial<ShippingMethod>) => Promise<{ success: boolean; error?: string }>;
  onDeleteMethod: (id: string) => Promise<{ success: boolean }>;
}

export const ShippingMethodsSection: React.FC<ShippingMethodsSectionProps> = ({
  shippingMethods,
  isLoading,
  isSubmitting,
  onToggleStatus,
  onCreateMethod,
  onUpdateMethod,
  onDeleteMethod,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState<number>(45000);
  const [estimatedDays, setEstimatedDays] = useState("2");
  const [iconName, setIconName] = useState<ShippingMethod["iconName"]>("truck");
  const [isActive, setIsActive] = useState(true);
  const [coveredCitiesText, setCoveredCitiesText] = useState("all");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenCreate = () => {
    setEditingMethod(null);
    setTitle("");
    setCost(45000);
    setEstimatedDays("2");
    setIconName("truck");
    setIsActive(true);
    setCoveredCitiesText("all");
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (method: ShippingMethod) => {
    setEditingMethod(method);
    setTitle(method.title);
    setCost(method.cost);
    setEstimatedDays(method.estimatedDays);
    setIconName(method.iconName);
    setIsActive(method.isActive);
    setCoveredCitiesText(
      method.coveredCities.includes("all") ? "all" : method.coveredCities.join("، ")
    );
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMethod(null);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "عنوان روش ارسال الزامی است.";
    if (!estimatedDays.trim() || Number(estimatedDays) < 0 || Number(estimatedDays) > 365) errs.estimatedDays = "تعداد روز باید بین صفر تا ۳۶۵ باشد.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const cities =
      coveredCitiesText.trim() === "all" || !coveredCitiesText.trim()
        ? ["all"]
        : coveredCitiesText
            .split(/[,،]+/)
            .map((c) => c.trim())
            .filter(Boolean);

    const payload: CreateShippingMethodPayload = {
      title: title.trim(),
      cost: Number(cost) || 0,
      estimatedDays: estimatedDays.trim(),
      iconName,
      isActive,
      coveredCities: cities.length > 0 ? cities : ["all"],
    };

    if (editingMethod) {
      const res = await onUpdateMethod(editingMethod.id, payload);
      if (res.success) handleCloseModal();
    } else {
      const res = await onCreateMethod(payload);
      if (res.success) handleCloseModal();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar with Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-400" />
            <span>تعرفه‌ها و روش‌های ارسال فعال در درگاه خرید (PBI-5.3)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            تعریف قیمت پایه، زمان‌بندی تحویل، محدودیت‌های جغرافیایی و شروط ارسال رایگان
          </p>
        </div>

        <EButton
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          icon={<Plus className="w-4 h-4" />}
          className="text-xs font-bold whitespace-nowrap shadow-sm shadow-indigo-600/20 w-full sm:w-auto"
        >
          افزودن روش ارسال جدید
        </EButton>
      </div>

      {/* Table or Empty State */}
      {shippingMethods.length === 0 && !isLoading ? (
        <EmptyState
          icon={<Truck className="w-10 h-10 text-slate-500" />}
          title="هیچ روش ارسالی تعریف نشده است"
          description="برای فعال‌سازی فرآیند تسویه حساب مشتریان، حداقل یک روش ارسال ایجاد کنید."
          action={
            <EButton
              variant="primary"
              size="md"
              onClick={handleOpenCreate}
              icon={<Plus className="w-4 h-4" />}
              className="text-xs font-bold"
            >
              تعریف اولین روش ارسال
            </EButton>
          }
        />
      ) : (
        <ShippingMethodTable
          shippingMethods={shippingMethods}
          onToggleStatus={onToggleStatus}
          onEdit={handleOpenEdit}
          onDelete={onDeleteMethod}
        />
      )}

      {/* Create / Edit BottomSheet Modal */}
      <BottomSheet
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Truck className="w-4 h-4" />
            </div>
            <span>{editingMethod ? "ویرایش روش ارسال" : "تعریف روش ارسال جدید"}</span>
          </div>
        }
        subtitle="مشخصات، هزینه و مناطق تحت پوشش این روش ارسال را تعیین فرمایید."
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <EButton
              variant="outlined"
              size="md"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="text-xs"
            >
              انصراف
            </EButton>

            <EButton
              variant="primary"
              size="md"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              icon={<Save className="w-4 h-4" />}
              className="text-xs font-bold px-6"
            >
              {editingMethod ? "ذخیره تغییرات" : "افزودن روش ارسال"}
            </EButton>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ETextField
              label="عنوان روش ارسال"
              required
              value={title}
              onValueChange={setTitle}
              placeholder="مثال: پست پیشتاز سراسری"
              error={Boolean(errors.title)}
              helperText={errors.title}
              leftIcon={<Truck className="w-4 h-4" />}
            />

            <ESelect
              label="آیکون نمایشی روش"
              value={iconName}
              onValueChange={(val) => setIconName(val as ShippingMethod["iconName"])}
              options={[
                { value: "truck", label: "کامیون / پست (Truck)" },
                { value: "motorcycle", label: "پیک موتوری (Motorcycle)" },
                { value: "store", label: "تحویل از فروشگاه (Store)" },
                { value: "package", label: "بسته / تیپاکس (Package)" },
              ]}
            />

            <ETextField
              label="هزینه پایه ارسال (تومان)"
              required
              type="number"
              inputMode="numeric"
              value={cost.toString()}
              onValueChange={(val) => setCost(Number(val) || 0)}
              placeholder="45000"
              leftIcon={<Coins className="w-4 h-4" />}
            />

            <ETextField
              label="مدت زمان تقریبی تحویل"
              required
              type="number"
              inputMode="numeric"
              value={estimatedDays}
              onValueChange={setEstimatedDays}
              placeholder="تعداد روز، مثال: 2"
              error={Boolean(errors.estimatedDays)}
              helperText={errors.estimatedDays}
              leftIcon={<Clock className="w-4 h-4" />}
            />

            <div className="sm:col-span-2">
              <ETextField
                label="شهرهای تحت پوشش (با ویرگول جدا کنید یا کلمه 'all' برای تمام کشور)"
                value={coveredCitiesText}
                onValueChange={setCoveredCitiesText}
                placeholder="all یا تهران، کرج، شیراز"
                helperText="کلمه all به منزله پوشش سراسری کلیه استان‌ها و شهرهاست."
                leftIcon={<MapPin className="w-4 h-4" />}
              />
            </div>

          </div>

          <div className="grid grid-cols-1 gap-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">وضعیت فعال در فروشگاه</span>
                <span className="text-[11px] text-slate-400 block">
                  قابلیت انتخاب توسط مشتریان فعال باشد
                </span>
              </div>
              <ESwitch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>
        </form>
      </BottomSheet>
    </div>
  );
};

export default ShippingMethodsSection;
