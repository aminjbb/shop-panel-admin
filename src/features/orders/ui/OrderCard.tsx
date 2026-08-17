import React from "react";
import type { Order } from "@/types/order";
import OrderFulfillmentBadge from "./OrderFulfillmentBadge";
import OrderPaymentBadge from "./OrderPaymentBadge";
import { EButton } from "@/shared-app/designSystem/button";
import {
  FileText,
  Truck,
  MapPin,
  Clock,
  Phone,
  Printer,
  ChevronLeft,
} from "lucide-react";

export interface OrderCardProps {
  order: Order;
  onOpenInvoice: (order: Order) => void;
  onOpenStatusDialog: (order: Order) => void;
  onPrintInvoice?: (order: Order) => void;
  className?: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onOpenInvoice,
  onOpenStatusDialog,
  onPrintInvoice,
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

  const totalItemsCount = order.items.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div
      id={`order-mobile-card-${order.id}`}
      className={`p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-md flex flex-col gap-3.5 transition-all ${className}`}
    >
      {/* 1. Header: Order number + Date + Fulfillment Status Badge */}
      <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-indigo-400">
              {order.orderNumber}
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              {totalItemsCount} کالا
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{formatPersianDate(order.createdAt)}</span>
          </div>
        </div>

        <OrderFulfillmentBadge status={order.fulfillment.status} size="sm" />
      </div>

      {/* 2. Body: Buyer Info & Location */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold shrink-0 text-[11px]">
            {order.customer.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white truncate">{order.customer.name}</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="truncate">
                {order.customer.address.province}، {order.customer.address.city}
              </span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono dir-ltr text-left">
          {order.customer.phone}
        </div>
      </div>

      {/* 3. Items Preview List */}
      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-3">
        <div className="flex -space-x-2 rtl:space-x-reverse shrink-0">
          {order.items.slice(0, 3).map((item, idx) => (
            <img
              key={idx}
              src={item.thumbnail}
              alt={item.title}
              className="w-10 h-10 rounded-lg object-cover border-2 border-slate-900 bg-slate-800"
            />
          ))}
          {order.items.length > 3 && (
            <div className="w-10 h-10 rounded-lg bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[11px] font-bold text-slate-300">
              +{order.items.length - 3}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 text-xs">
          <div className="text-slate-200 truncate font-medium">{order.items[0]?.title}</div>
          <div className="text-[11px] text-slate-400">
            {order.items.length > 1
              ? `و ${order.items.length - 1} قلم دیگر`
              : order.items[0]?.variant}
          </div>
        </div>
      </div>

      {/* 4. Tracking Code snippet (if present) */}
      {order.fulfillment.trackingCode && (
        <div className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-purple-950/20 border border-purple-500/20 text-purple-300">
          <span className="text-[11px]">کد رهگیری:</span>
          <span className="font-mono font-semibold">{order.fulfillment.trackingCode}</span>
        </div>
      )}

      {/* 5. Pricing & Payment Status */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <OrderPaymentBadge status={order.payment.status} method={order.payment.method} size="sm" />

        <div className="text-left">
          <span className="text-xs text-slate-400 ms-1">مبلغ پرداختی:</span>
          <span className="text-sm font-bold text-white tracking-tight">
            {formatToman(order.finalPayable)}
          </span>
          <span className="text-[10px] text-slate-400 me-1"> تومان</span>
        </div>
      </div>

      {/* 6. Action Buttons (Full-width touch targets) */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
        <EButton
          variant="secondary"
          size="md"
          onClick={() => onOpenInvoice(order)}
          icon={<FileText className="w-4 h-4 text-indigo-400" />}
          className="w-full text-xs justify-center font-semibold"
        >
          فاکتور و آدرس
        </EButton>

        <EButton
          variant="primary"
          size="md"
          onClick={() => onOpenStatusDialog(order)}
          icon={<Truck className="w-4 h-4" />}
          className="w-full text-xs justify-center font-semibold"
        >
          تغییر وضعیت
        </EButton>
      </div>
    </div>
  );
};

export default OrderCard;
