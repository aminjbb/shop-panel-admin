import React, { useState, useEffect } from "react";
import type {
  Order,
  FulfillmentStatus,
  UpdateFulfillmentPayload,
} from "@/types/order";
import { AVAILABLE_COURIERS } from "../api/mockOrderService";
import BottomSheet from "@/shared-app/bottomSheet";
import { EButton } from "@/shared-app/designSystem/button";
import { ETextField } from "@/shared-app/designSystem/textField";
import { ESelect, type SelectOption } from "@/shared-app/designSystem/select";
import {
  Truck,
  Clock,
  PackageCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Hash,
} from "lucide-react";

export interface OrderStatusDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (orderId: string, payload: UpdateFulfillmentPayload) => Promise<void>;
  isLoading?: boolean;
}

export const OrderStatusDialog: React.FC<OrderStatusDialogProps> = ({
  order,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<FulfillmentStatus>("processing");
  const [courierName, setCourierName] = useState<string>("");
  const [trackingCode, setTrackingCode] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<{ courier?: string; trackingCode?: string }>({});

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.fulfillment.status);
      setCourierName(order.fulfillment.courierName || AVAILABLE_COURIERS[0].name);
      setTrackingCode(order.fulfillment.trackingCode || "");
      setNotes(order.fulfillment.notes || "");
      setErrors({});
    }
  }, [order, isOpen]);

  if (!order) return null;

  const statusOptions: Array<{
    id: FulfillmentStatus;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      id: "processing",
      title: "در حال پردازش",
      description: "سفارش در حال جمع‌آوری اقلام و کنترل کیفی در انبار است.",
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      color: "border-amber-500/30 bg-amber-500/5",
    },
    {
      id: "ready_to_ship",
      title: "آماده ارسال",
      description: "بسته‌بندی نهایی انجام شده و فاکتور چسبانده شده است.",
      icon: <PackageCheck className="w-5 h-5 text-blue-400" />,
      color: "border-blue-500/30 bg-blue-500/5",
    },
    {
      id: "shipped",
      title: "ارسال شده (تحویل به پست/پیک)",
      description: "بسته به شرکت پستی یا پیک تحویل داده شده و کد رهگیری صادر شد.",
      icon: <Truck className="w-5 h-5 text-purple-400" />,
      color: "border-purple-500/30 bg-purple-500/5",
    },
    {
      id: "delivered",
      title: "تحویل شده به مشتری",
      description: "مرسوله با موفقیت توسط خریدار تحویل گرفته شد.",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      color: "border-emerald-500/30 bg-emerald-500/5",
    },
    {
      id: "canceled",
      title: "لغو سفارش",
      description: "سفارش به درخواست کاربر یا عدم موجودی لغو گردید.",
      icon: <XCircle className="w-5 h-5 text-rose-400" />,
      color: "border-rose-500/30 bg-rose-500/5",
    },
  ];

  const courierSelectOptions: SelectOption[] = AVAILABLE_COURIERS.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { courier?: string; trackingCode?: string } = {};

    // Validate mandatory tracking and courier if shipped
    if (selectedStatus === "shipped") {
      if (!courierName.trim()) {
        newErrors.courier = "انتخاب شرکت حمل‌ونقل الزامی است.";
      }
      if (!trackingCode.trim()) {
        newErrors.trackingCode = "ورود کد پیگیری یا بارنامه مرسوله الزامی است.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await onConfirm(order.id, {
      status: selectedStatus,
      courierName: selectedStatus === "shipped" || selectedStatus === "delivered" ? courierName : undefined,
      trackingCode: selectedStatus === "shipped" || selectedStatus === "delivered" ? trackingCode.trim() : undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              تغییر وضعیت مرسوله سفارش {order.orderNumber}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              مشتری: {order.customer.name} • شهر: {order.customer.address.city}
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <EButton
            variant="outlined"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="text-xs"
          >
            انصراف
          </EButton>

          <EButton
            variant="primary"
            size="md"
            onClick={handleSubmit}
            isLoading={isLoading}
            icon={<CheckCircle2 className="w-4 h-4" />}
            className="text-xs font-semibold px-5"
          >
            ثبت و اعمال تغییرات
          </EButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Status Selection Cards */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-white">
            وضعیت جدید مرسوله را انتخاب کنید:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {statusOptions.map((st) => {
              const isSelected = selectedStatus === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => {
                    setSelectedStatus(st.id);
                    if (st.id === "shipped" && !courierName) {
                      setCourierName(AVAILABLE_COURIERS[0].name);
                    }
                  }}
                  className={`
                    p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3
                    ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/30 shadow-md"
                        : "border-slate-800 bg-slate-950/60 hover:bg-slate-900 hover:border-slate-700"
                    }
                  `}
                >
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                    {st.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{st.title}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-xs shadow-indigo-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {st.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Courier and Tracking Code (Mandatory when 'shipped', Optional when 'delivered') */}
        {(selectedStatus === "shipped" || selectedStatus === "delivered") && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 flex flex-col gap-3.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 pb-2 border-b border-slate-800">
              <Truck className="w-4 h-4" />
              <span>مشخصات شرکت حمل‌ونقل و کد رهگیری پستی</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Courier Selection */}
              <div>
                <ESelect
                  label="نام شرکت حمل‌ونقل / پیک"
                  value={courierName}
                  onValueChange={(val) => {
                    setCourierName(val);
                    if (errors.courier) setErrors((prev) => ({ ...prev, courier: undefined }));
                  }}
                  options={courierSelectOptions}
                  error={!!errors.courier}
                  helperText={errors.courier}
                  required
                />
              </div>

              {/* Tracking Code */}
              <div>
                <ETextField
                  label="کد پیگیری یا شماره بارنامه"
                  placeholder="مثال: PST-94820184 یا TPX-102938"
                  value={trackingCode}
                  onValueChange={(val) => {
                    setTrackingCode(val);
                    if (errors.trackingCode) {
                      setErrors((prev) => ({ ...prev, trackingCode: undefined }));
                    }
                  }}
                  error={!!errors.trackingCode}
                  helperText={errors.trackingCode}
                  leftIcon={<Hash className="w-4 h-4 text-slate-400" />}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Notes input */}
        <div>
          <ETextField
            label="یادداشت و توضیحات تکمیلی (اختیاری)"
            placeholder="مثال: ارسال هماهنگ شد، تحویل در ساعات عصر به نگهبانی ساختمان..."
            value={notes}
            onValueChange={setNotes}
            multiline
            rows={2}
          />
        </div>
      </form>
    </BottomSheet>
  );
};

export default OrderStatusDialog;
