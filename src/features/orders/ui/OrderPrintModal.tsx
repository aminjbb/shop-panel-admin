import React from "react";
import type { Order } from "@/types/order";
import BottomSheet from "@/shared-app/bottomSheet";
import { EButton } from "@/shared-app/designSystem/button";
import { Printer, ShieldCheck, CheckCircle2, Phone, MapPin, Receipt, X } from "lucide-react";

export interface OrderPrintModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderPrintModal: React.FC<OrderPrintModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const formatToman = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount);
  };

  const formatFullDate = (isoString?: string) => {
    if (!isoString) return "-";
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return isoString;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const fullAddress = `${order.customer.address.province}، ${order.customer.address.city}، ${order.customer.address.street}${
    order.customer.address.plaque ? `، پلاک ${order.customer.address.plaque}` : ""
  }${order.customer.address.unit ? `، واحد ${order.customer.address.unit}` : ""}`;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2">
          <Printer className="w-5 h-5 text-indigo-400" />
          <span>پیش‌نمایش و چاپ فاکتور فروش ({order.orderNumber})</span>
        </div>
      }
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <span className="text-xs text-slate-400 hidden sm:inline">
            فاکتور رسمی فروشگاه با استاندارد پرینت A4 و A5
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <EButton variant="outlined" size="md" onClick={onClose} className="flex-1 sm:flex-initial text-xs">
              بستن
            </EButton>
            <EButton
              variant="primary"
              size="md"
              onClick={handlePrint}
              icon={<Printer className="w-4 h-4" />}
              className="flex-1 sm:flex-initial text-xs font-semibold"
            >
              ارسال به پرینتر (Print)
            </EButton>
          </div>
        </div>
      }
    >
      {/* Printable Invoice Container (Light style mimicking real paper invoice) */}
      <div
        id="printable-invoice"
        className="p-6 sm:p-8 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 flex flex-col gap-6 text-xs font-sans select-text"
      >
        {/* Header: Company & Invoice Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-950">فروشگاه آنلاین دینووا</h2>
              <p className="text-[11px] text-slate-600">فاکتور رسمی تحویل کالا و خدمات</p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end text-left font-mono">
            <div className="text-sm font-bold text-slate-950">
              شماره سفارش: <span className="text-indigo-600 font-bold">{order.orderNumber}</span>
            </div>
            <div className="text-xs text-slate-600 font-sans mt-0.5">
              تاریخ ثبت: {formatFullDate(order.createdAt)}
            </div>
            {order.payment.transactionId && (
              <div className="text-[11px] text-slate-500 font-sans">
                کد پیگیری پرداخت: {order.payment.transactionId}
              </div>
            )}
          </div>
        </div>

        {/* Customer & Shipping Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="font-bold text-slate-900 block mb-1 text-xs">اطلاعات خریدار:</span>
            <div className="text-slate-700 space-y-0.5">
              <div>نام: <strong className="text-slate-900">{order.customer.name}</strong></div>
              <div>شماره همراه: <span className="font-mono">{order.customer.phone}</span></div>
              {order.customer.email && <div>ایمیل: <span className="font-mono text-[11px]">{order.customer.email}</span></div>}
            </div>
          </div>

          <div>
            <span className="font-bold text-slate-900 block mb-1 text-xs">نشانی پستی گیرنده:</span>
            <p className="text-slate-700 leading-relaxed text-xs">
              {fullAddress}
            </p>
            <div className="mt-1">
              کد پستی: <strong className="font-mono tracking-wider">{order.customer.address.postalCode}</strong>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-right text-xs">
            <thead>
              <tr className="border-b-2 border-slate-300 bg-slate-100 text-slate-800 font-bold">
                <th className="py-2.5 px-3 w-12 text-center">ردیف</th>
                <th className="py-2.5 px-3">شرح کالا / مشخصات</th>
                <th className="py-2.5 px-3 text-center w-20">تعداد</th>
                <th className="py-2.5 px-3 text-left w-32">قیمت واحد (تومان)</th>
                <th className="py-2.5 px-3 text-left w-36">جمع کل (تومان)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {order.items.map((it, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-3 text-center font-mono">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{it.title}</div>
                    <div className="text-[11px] text-slate-500">{it.variant}</div>
                  </td>
                  <td className="py-3 px-3 text-center font-bold">{it.quantity}</td>
                  <td className="py-3 px-3 text-left font-mono">{formatToman(it.unitPrice)}</td>
                  <td className="py-3 px-3 text-left font-bold font-mono">
                    {formatToman(it.unitPrice * it.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-300">
          <div className="text-slate-600 text-xs leading-relaxed max-w-sm">
            <span className="font-bold text-slate-800 block mb-1">روش ارسال و وضعیت:</span>
            <span>حامل: {order.fulfillment.courierName || "پست پیشتاز"}</span>
            {order.fulfillment.trackingCode && (
              <span className="block font-mono">کد رهگیری: {order.fulfillment.trackingCode}</span>
            )}
          </div>

          <div className="w-full sm:w-72 space-y-1.5 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between text-slate-700">
              <span>جمع اقلام:</span>
              <span className="font-mono">{formatToman(order.totalAmount)} تومان</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>تخفیف:</span>
                <span className="font-mono">- {formatToman(order.discountAmount)} تومان</span>
              </div>
            )}
            <div className="flex justify-between text-slate-700">
              <span>هزینه حمل:</span>
              <span>
                {order.shippingFee === 0 ? "رایگان" : `${formatToman(order.shippingFee)} تومان`}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-300 flex justify-between font-bold text-sm text-slate-950">
              <span>مبلغ پرداختی:</span>
              <span className="text-indigo-600 font-mono">{formatToman(order.finalPayable)} تومان</span>
            </div>
          </div>
        </div>

        {/* Footer Signatures & Barcode */}
        <div className="pt-6 border-t border-dashed border-slate-300 flex items-center justify-between text-slate-500 text-[11px]">
          <div>مهر و امضای فروشگاه دینووا</div>
          <div className="font-mono text-center">
            <div className="tracking-[6px] text-xs font-bold text-slate-800">||| | |||| ||| |||| |</div>
            <span>{order.orderNumber}</span>
          </div>
          <div>امضای تحویل گیرنده</div>
        </div>
      </div>
    </BottomSheet>
  );
};

export default OrderPrintModal;
