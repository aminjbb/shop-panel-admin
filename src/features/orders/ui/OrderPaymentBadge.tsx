import React from "react";
import type { PaymentStatus, PaymentMethod } from "@/types/order";
import { CheckCircle, AlertTriangle, XCircle, RotateCcw } from "lucide-react";

export interface OrderPaymentBadgeProps {
  status: PaymentStatus;
  method?: PaymentMethod;
  className?: string;
  size?: "sm" | "md";
  showMethod?: boolean;
}

export const OrderPaymentBadge: React.FC<OrderPaymentBadgeProps> = ({
  status,
  method,
  className = "",
  size = "md",
  showMethod = false,
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case "paid":
        return {
          label: "پرداخت شده",
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
          icon: <CheckCircle className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />,
        };
      case "pending":
        return {
          label: "در انتظار پرداخت",
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
          icon: <AlertTriangle className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />,
        };
      case "failed":
        return {
          label: "ناموفق",
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-300",
          icon: <XCircle className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />,
        };
      case "refunded":
        return {
          label: "مسترد شده",
          bg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-300",
          icon: <RotateCcw className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />,
        };
      default:
        return {
          label: status,
          bg: "bg-slate-800 border-slate-700 text-slate-300",
          icon: null,
        };
    }
  };

  const getMethodLabel = (m?: PaymentMethod) => {
    switch (m) {
      case "online":
        return "درگاه آنلاین";
      case "cash_on_delivery":
        return "پرداخت در محل";
      case "card_to_card":
        return "کارت به کارت";
      default:
        return "";
    }
  };

  const config = getBadgeConfig();
  const sizeClasses =
    size === "sm" ? "text-[11px] px-2 py-0.5 gap-1" : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border transition-colors select-none ${sizeClasses} ${config.bg} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
      {showMethod && method && (
        <span className="opacity-75 text-[10px] border-r border-current pe-1.5 me-0.5">
          {getMethodLabel(method)}
        </span>
      )}
    </span>
  );
};

export default OrderPaymentBadge;
