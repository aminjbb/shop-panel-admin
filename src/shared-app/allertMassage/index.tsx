import React, { type ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

export type AllertVariant = "warning" | "danger" | "info" | "success";

export interface AllertMassageProps {
  icon?: ReactNode;
  title?: string;
  message: ReactNode;
  variant?: AllertVariant;
  className?: string;
  onClose?: () => void;
}

export const AllertMassage: React.FC<AllertMassageProps> = ({
  icon,
  title,
  message,
  variant = "danger",
  className = "",
  onClose,
}) => {
  const variantStyles: Record<AllertVariant, { bg: string; border: string; text: string; iconColor: string; defaultIcon: ReactNode }> = {
    danger: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      text: "text-rose-200",
      iconColor: "text-rose-400",
      defaultIcon: <AlertCircle className="w-5 h-5 shrink-0" />,
    },
    warning: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-200",
      iconColor: "text-amber-400",
      defaultIcon: <AlertTriangle className="w-5 h-5 shrink-0" />,
    },
    info: {
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/30",
      text: "text-indigo-200",
      iconColor: "text-indigo-400",
      defaultIcon: <Info className="w-5 h-5 shrink-0" />,
    },
    success: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-200",
      iconColor: "text-emerald-400",
      defaultIcon: <CheckCircle2 className="w-5 h-5 shrink-0" />,
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-sm transition-all duration-200 ${style.bg} ${style.border} ${className}`}
    >
      <div className={`mt-0.5 ${style.iconColor}`}>
        {icon || style.defaultIcon}
      </div>

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-xs font-semibold text-white mb-0.5">{title}</h4>
        )}
        <div className={`text-xs leading-relaxed ${style.text}`}>{message}</div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-white/40 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="بستن پیام"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default AllertMassage;
