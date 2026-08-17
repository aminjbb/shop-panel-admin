import React from "react";
import type { ReviewStatus } from "@/types/feedback";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

export interface ReviewStatusBadgeProps {
  status: ReviewStatus;
  className?: string;
}

export const ReviewStatusBadge: React.FC<ReviewStatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const configs: Record<
    ReviewStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    pending: {
      label: "در انتظار بررسی",
      bg: "bg-amber-500/10",
      text: "text-amber-300",
      border: "border-amber-500/30",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    approved: {
      label: "تایید و منتشر شده",
      bg: "bg-emerald-500/10",
      text: "text-emerald-300",
      border: "border-emerald-500/30",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    rejected: {
      label: "رد شده",
      bg: "bg-rose-500/10",
      text: "text-rose-300",
      border: "border-rose-500/30",
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
  };

  const config = configs[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-xs select-none ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default ReviewStatusBadge;
