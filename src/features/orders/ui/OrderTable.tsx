import React from "react";
import type { Order } from "@/types/order";
import OrderFulfillmentBadge from "./OrderFulfillmentBadge";
import OrderPaymentBadge from "./OrderPaymentBadge";
import { EButton } from "@/shared-app/designSystem/button";
import {
  FileText,
  Truck,
  Printer,
  Copy,
  ExternalLink,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";

export interface OrderTableProps {
  orders: Order[];
  onOpenInvoice: (order: Order) => void;
  onOpenStatusDialog: (order: Order) => void;
  onPrintInvoice: (order: Order) => void;
  onCopyTracking?: (code: string) => void;
  className?: string;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onOpenInvoice,
  onOpenStatusDialog,
  onPrintInvoice,
  onCopyTracking,
  className = "",
}) => {
  const formatToman = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount);
  };

  const formatPersianDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("fa-IR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div
      id="desktop-orders-table-wrapper"
      className={`hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg backdrop-blur-xs ${className}`}
    >
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="border-b border-slate-800/90 bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <th className="py-3.5 px-4">شماره و تاریخ سفارش</th>
            <th className="py-3.5 px-4">اطلاعات خریدار</th>
            <th className="py-3.5 px-4">اقلام سفارش</th>
            <th className="py-3.5 px-4">مبلغ نهایی (تومان)</th>
            <th className="py-3.5 px-4">وضعیت پرداخت</th>
            <th className="py-3.5 px-4">وضعیت مرسوله</th>
            <th className="py-3.5 px-4 text-center">عملیات و لاگ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-xs">
          {orders.map((order) => {
            const totalItemsCount = order.items.reduce((sum, it) => sum + it.quantity, 0);

            return (
              <tr
                key={order.id}
                id={`order-row-${order.id}`}
                className="hover:bg-slate-800/40 transition-colors group"
              >
                {/* 1. Order Number & Date */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => onOpenInvoice(order)}
                      className="font-mono font-bold text-indigo-400 hover:text-indigo-300 text-sm tracking-tight text-right hover:underline flex items-center gap-1 cursor-pointer w-fit"
                    >
                      <span>{order.orderNumber}</span>
                    </button>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{formatPersianDate(order.createdAt)}</span>
                    </div>
                  </div>
                </td>

                {/* 2. Customer Info */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-col gap-0.5 min-w-[130px]">
                    <span className="font-semibold text-white">{order.customer.name}</span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Phone className="w-3 h-3 shrink-0 text-slate-500" />
                      <span className="font-mono dir-ltr text-right">{order.customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate max-w-[180px]">
                      <MapPin className="w-3 h-3 shrink-0 text-slate-500" />
                      <span>
                        {order.customer.address.province}، {order.customer.address.city}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 3. Items thumbnail & summary */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2 rtl:space-x-reverse shrink-0">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.thumbnail}
                          alt={item.title}
                          title={`${item.title} (${item.quantity} عدد)`}
                          className="w-8 h-8 rounded-lg object-cover border-2 border-slate-900 ring-1 ring-slate-700/50 bg-slate-800"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-8 h-8 rounded-lg bg-slate-800 border-2 border-slate-900 ring-1 ring-slate-700/50 flex items-center justify-center text-[10px] font-bold text-slate-300">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col text-[11px]">
                      <span className="font-medium text-slate-200 truncate max-w-[150px]">
                        {order.items[0]?.title}
                      </span>
                      <span className="text-slate-400">
                        {totalItemsCount} کالا ({order.items.length} قلم)
                      </span>
                    </div>
                  </div>
                </td>

                {/* 4. Final Payable */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-col gap-0.5">
                    <div className="font-bold text-white text-sm">
                      {formatToman(order.finalPayable)} <span className="text-[11px] text-slate-400 font-normal">تومان</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <span className="text-[10px] text-emerald-400">
                        {formatToman(order.discountAmount)} تخفیف
                      </span>
                    )}
                  </div>
                </td>

                {/* 5. Payment Status */}
                <td className="py-3.5 px-4">
                  <OrderPaymentBadge status={order.payment.status} method={order.payment.method} />
                </td>

                {/* 6. Fulfillment Status */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-col gap-1 items-start">
                    <OrderFulfillmentBadge status={order.fulfillment.status} />
                    {order.fulfillment.courierName && (
                      <span className="text-[10px] text-slate-400 truncate max-w-[130px]" title={order.fulfillment.courierName}>
                        {order.fulfillment.courierName}
                      </span>
                    )}
                    {order.fulfillment.trackingCode && (
                      <span
                        className="font-mono text-[10px] text-indigo-300 bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-500/20 truncate max-w-[130px]"
                        title={`کد رهگیری: ${order.fulfillment.trackingCode}`}
                      >
                        {order.fulfillment.trackingCode}
                      </span>
                    )}
                  </div>
                </td>

                {/* 7. Actions */}
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <EButton
                      variant="secondary"
                      size="sm"
                      onClick={() => onOpenInvoice(order)}
                      title="مشاهده فاکتور کامل و نشانی"
                      icon={<FileText className="w-3.5 h-3.5 text-indigo-400" />}
                      className="px-2.5 py-1 text-xs"
                    >
                      فاکتور
                    </EButton>

                    <EButton
                      variant="outlined"
                      size="sm"
                      onClick={() => onOpenStatusDialog(order)}
                      title="تغییر وضعیت مرسوله و ثبت کد رهگیری"
                      icon={<Truck className="w-3.5 h-3.5 text-amber-400" />}
                      className="px-2.5 py-1 text-xs"
                    >
                      وضعیت
                    </EButton>

                    <button
                      type="button"
                      onClick={() => onPrintInvoice(order)}
                      title="چاپ پیش‌نمایش فاکتور"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      aria-label="چاپ فاکتور"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
