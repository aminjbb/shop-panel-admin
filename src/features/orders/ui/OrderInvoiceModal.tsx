import React from "react";
import type { Order } from "@/types/order";
import BottomSheet from "@/shared-app/bottomSheet";
import OrderFulfillmentBadge from "./OrderFulfillmentBadge";
import OrderPaymentBadge from "./OrderPaymentBadge";
import { EButton } from "@/shared-app/designSystem/button";
import useToastStore from "@/shared-app/designSystem/toast/store";
import {
  FileText,
  Printer,
  Copy,
  Phone,
  Mail,
  MapPin,
  Truck,
  CreditCard,
  Check,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  Receipt,
  User,
} from "lucide-react";

export interface OrderInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenStatusDialog: (order: Order) => void;
  onPrintInvoice: (order: Order) => void;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
  onOpenStatusDialog,
  onPrintInvoice,
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

  const handleCopy = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      useToastStore.success(`${label} در حافظه کپی شد`);
    }
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
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">
                فاکتور سفارش {order.orderNumber}
              </span>
              <OrderFulfillmentBadge status={order.fulfillment.status} size="sm" />
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              ثبت شده در: {formatFullDate(order.createdAt)}
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <EButton
              variant="secondary"
              size="md"
              onClick={() => onPrintInvoice(order)}
              icon={<Printer className="w-4 h-4" />}
              className="flex-1 sm:flex-initial text-xs"
            >
              چاپ فاکتور
            </EButton>

            <EButton
              variant="primary"
              size="md"
              onClick={() => {
                onClose();
                onOpenStatusDialog(order);
              }}
              icon={<Truck className="w-4 h-4" />}
              className="flex-1 sm:flex-initial text-xs"
            >
              تغییر وضعیت مرسوله
            </EButton>
          </div>

          <EButton
            variant="outlined"
            size="md"
            onClick={onClose}
            className="w-full sm:w-auto text-xs"
          >
            بستن پنجره
          </EButton>
        </div>
      }
    >
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
        {/* ========================================================================= */}
        {/* COLUMN 1: Items List & Financial Summary (7 cols on lg)                   */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Items Section */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>اقلام خریداری شده ({order.items.length} کالا)</span>
              </span>
              <span className="text-[11px] text-slate-400">
                مجموع تعداد: {order.items.reduce((s, i) => s + i.quantity, 0)} عدد
              </span>
            </div>

            <div className="flex flex-col divide-y divide-slate-800/60">
              {order.items.map((item, index) => (
                <div key={index} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-800 bg-slate-900 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate mb-0.5">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate mb-1">
                      {item.variant}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-400">
                        {item.quantity} × {formatToman(item.unitPrice)} تومان
                      </span>
                    </div>
                  </div>

                  <div className="text-left font-bold text-white text-xs whitespace-nowrap">
                    {formatToman(item.unitPrice * item.quantity)} تومان
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4">
            <h4 className="text-xs font-bold text-white mb-3 pb-2 border-b border-slate-800 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>صورت‌حساب و محاسبات مالی</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>جمع کل اقلام:</span>
                <span className="font-medium">{formatToman(order.totalAmount)} تومان</span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>تخفیف ویژه اعمال‌شده:</span>
                  <span className="font-medium">- {formatToman(order.discountAmount)} تومان</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-300">
                <span>هزینه بسته‌بندی و ارسال:</span>
                <span>
                  {order.shippingFee === 0 ? (
                    <span className="text-emerald-400 font-medium">رایگان</span>
                  ) : (
                    `${formatToman(order.shippingFee)} تومان`
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-sm font-bold text-white">
                <span className="text-indigo-300">مبلغ نهایی قابل پرداخت:</span>
                <div className="text-base text-emerald-400">
                  {formatToman(order.finalPayable)} <span className="text-xs text-slate-400 font-normal">تومان</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 2: Customer Address, Payment & Courier Info (5 cols on lg)         */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Customer & Address Card */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span>اطلاعات گیرنده و نشانی پستی</span>
              </span>

              <button
                type="button"
                onClick={() => handleCopy(fullAddress, "نشانی کامل پستی")}
                className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>کپی آدرس</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">نام و نام خانوادگی:</span>
                <span className="font-semibold text-white">{order.customer.name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">شماره تماس:</span>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="font-mono text-indigo-400 hover:underline flex items-center gap-1"
                    title="تماس مستقیم با مشتری"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{order.customer.phone}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.customer.phone, "شماره تماس")}
                    className="text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {order.customer.email && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ایمیل:</span>
                  <span className="font-mono text-slate-300 text-[11px] truncate max-w-[180px]">
                    {order.customer.email}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-slate-400 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>آدرس پستی تحویل:</span>
                </div>
                <p className="text-slate-200 text-xs leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  {fullAddress}
                </p>
              </div>

              <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">کد پستی ۱۰ رقمی:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white tracking-widest">
                    {order.customer.address.postalCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.customer.address.postalCode, "کد پستی")}
                    className="text-slate-400 hover:text-white cursor-pointer"
                    title="کپی کد پستی"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Courier Info Card */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white pb-2.5 border-b border-slate-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>وضعیت پرداخت و حمل و نقل</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">وضعیت پرداخت:</span>
                <OrderPaymentBadge
                  status={order.payment.status}
                  method={order.payment.method}
                  showMethod
                  size="sm"
                />
              </div>

              {order.payment.transactionId && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">شناسه تراکنش بانکی:</span>
                  <span className="font-mono text-slate-300 text-[11px]">
                    {order.payment.transactionId}
                  </span>
                </div>
              )}

              {order.payment.gateway && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">درگاه پرداخت:</span>
                  <span className="text-slate-300">{order.payment.gateway}</span>
                </div>
              )}

              {/* Carrier & Tracking */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">شرکت حمل‌ونقل:</span>
                  <span className="text-white font-medium">
                    {order.fulfillment.courierName || "تخصیص نیافته"}
                  </span>
                </div>

                {order.fulfillment.trackingCode && (
                  <div className="flex items-center justify-between bg-purple-950/20 border border-purple-500/30 p-2.5 rounded-lg">
                    <span className="text-purple-300 text-xs">کد پیگیری مرسوله:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-purple-200 tracking-wider">
                        {order.fulfillment.trackingCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(order.fulfillment.trackingCode!, "کد پیگیری")}
                        className="text-purple-400 hover:text-white cursor-pointer"
                        title="کپی کد رهگیری"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {order.fulfillment.dispatchedAt && (
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>زمان ارسال به پست:</span>
                    <span>{formatFullDate(order.fulfillment.dispatchedAt)}</span>
                  </div>
                )}

                {order.fulfillment.deliveredAt && (
                  <div className="flex items-center justify-between text-[11px] text-emerald-400">
                    <span>زمان تحویل به خریدار:</span>
                    <span>{formatFullDate(order.fulfillment.deliveredAt)}</span>
                  </div>
                )}

                {order.fulfillment.notes && (
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                    <span className="font-semibold text-slate-400 block mb-0.5">
                      یادداشت انبار / مرسوله:
                    </span>
                    {order.fulfillment.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

export default OrderInvoiceModal;
