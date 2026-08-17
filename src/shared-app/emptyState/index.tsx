import React, { type ReactNode } from "react";
import { PackageX } from "lucide-react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "موردی یافت نشد",
  description = "هیچ رکوردی مطابق با فیلترها یا عبارت جستجوی فعلی وجود ندارد.",
  icon,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mb-4">
        {icon || <PackageX className="w-7 h-7 text-indigo-400" />}
      </div>

      <h3 className="text-base font-bold text-white mb-1.5">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>

      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
