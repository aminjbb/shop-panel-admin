import React from "react";
import type { TicketStatus } from "@/types/feedback";
import { Clock, RefreshCw, UserCheck, CheckCircle2 } from "lucide-react";

export interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

export const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const configs: Record<
    TicketStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    open: {
      label: "تیکت جدید (باز)",
      bg: "bg-indigo-500/10",
      text: "text-indigo-300",
      border: "border-indigo-500/30",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    in_progress: {
      label: "در حال بررسی",
      bg: "bg-amber-500/10",
      text: "text-amber-300",
      border: "border-amber-500/30",
      icon: <RefreshCw className="w-3.5 h-3.5" />,
    },
    waiting_customer: {
      label: "در انتظار پاسخ مشتری",
      bg: "bg-purple-500/10",
      text: "text-purple-300",
      border: "border-purple-500/30",
      icon: <UserCheck className="w-3.5 h-3.5" />,
    },
    closed: {
      label: "بسته شده",
      bg: "bg-slate-800/80",
      text: "text-slate-400",
      border: "border-slate-700",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
  };

  const config = configs[status] || configs.open;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-xs select-none ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default TicketStatusBadge;
