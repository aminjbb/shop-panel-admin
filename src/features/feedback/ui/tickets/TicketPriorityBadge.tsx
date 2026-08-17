import React from "react";
import type { TicketPriority } from "@/types/feedback";
import { AlertCircle, Flame, ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface TicketPriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

export const TicketPriorityBadge: React.FC<TicketPriorityBadgeProps> = ({
  priority,
  className = "",
}) => {
  const configs: Record<
    TicketPriority,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    urgent: {
      label: "فوری / اضطراری",
      bg: "bg-rose-500/15",
      text: "text-rose-300 font-semibold",
      border: "border-rose-500/40",
      icon: <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />,
    },
    high: {
      label: "اولویت بالا",
      bg: "bg-amber-500/10",
      text: "text-amber-300",
      border: "border-amber-500/30",
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />,
    },
    medium: {
      label: "اولویت متوسط",
      bg: "bg-indigo-500/10",
      text: "text-indigo-300",
      border: "border-indigo-500/30",
      icon: <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />,
    },
    low: {
      label: "اولویت کم",
      bg: "bg-slate-800/80",
      text: "text-slate-400",
      border: "border-slate-700",
      icon: <ArrowDownRight className="w-3.5 h-3.5 text-slate-500" />,
    },
  };

  const config = configs[priority] || configs.medium;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-xs select-none ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default TicketPriorityBadge;
