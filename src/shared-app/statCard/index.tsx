import React, { type ReactNode } from "react";

export interface StatCardProps {
  title?: string;
  label?: string;
  value: ReactNode;
  subtitle?: string;
  description?: string;
  icon?: ReactNode;
  iconBgClassName?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
  badge?: ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  label,
  value,
  subtitle,
  description,
  icon,
  iconBgClassName,
  trend,
  className = "",
  badge,
}) => {
  const displayTitle = title || label || "";
  const displaySubtitle = subtitle || description || "";

  return (
    <div
      className={`glass-card-sm p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:border-slate-700 bg-slate-900 border border-slate-800 rounded-2xl ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs text-slate-400 font-medium">{displayTitle}</span>
        {icon && (
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
              iconBgClassName || "bg-indigo-600/10 border-indigo-500/20 text-indigo-400"
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {value}
        </div>
        {badge}
      </div>

      {(displaySubtitle || trend) && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          {displaySubtitle && <span>{displaySubtitle}</span>}
          {trend && (
            <span
              className={`font-semibold ${
                trend.isPositive ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
