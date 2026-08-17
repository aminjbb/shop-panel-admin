import React from "react";
import type { FulfillmentStatus } from "@/types/order";
import {
  Clock,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export interface OrderFulfillmentBadgeProps {
  status: FulfillmentStatus;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md";
}

export const OrderFulfillmentBadge: React.FC<OrderFulfillmentBadgeProps> = ({
  status,
  className = "",
  showIcon = true,
  size = "md",
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case "processing":
        return {
          label: "در حال پردازش",
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
          dot: "bg-amber-400",
          icon: <Clock className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />,
        };
      case "ready_to_ship":
        return {
          label: "آماده ارسال",
          bg: "bg-blue-500/10 border-blue-500/30 text-blue-300",
          dot: "bg-blue-400",
          icon: <PackageCheck className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />,
        };
      case "shipped":
        return {
          label: "ارسال شده",
          bg: "bg-purple-500/10 border-purple-500/30 text-purple-300",
          dot: "bg-purple-400",
          icon: <Truck className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />,
        };
      case "delivered":
        return {
          label: "تحویل شده",
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
          dot: "bg-emerald-400",
          icon: <CheckCircle2 className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />,
        };
      case "canceled":
        return {
          label: "لغو شده",
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-300",
          dot: "bg-rose-400",
          icon: <XCircle className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />,
        };
      default:
        return {
          label: status,
          bg: "bg-slate-800 border-slate-700 text-slate-300",
          dot: "bg-slate-400",
          icon: null,
        };
    }
  };

  const config = getBadgeConfig();
  const sizeClasses =
    size === "sm" ? "text-[11px] px-2 py-0.5 gap-1" : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border transition-colors select-none ${sizeClasses} ${config.bg} ${className}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default OrderFulfillmentBadge;
