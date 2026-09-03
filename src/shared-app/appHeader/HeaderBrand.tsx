import React, { type ReactNode } from "react";
import { Shield } from "lucide-react";

export interface HeaderBrandProps {
  logo?: ReactNode;
  brandName?: string;
  badgeLabel?: string;
  subtitle?: string;
  onClick?: () => void;
}

export const HeaderBrand: React.FC<HeaderBrandProps> = ({
  logo,
  brandName = "سامانه مدیریت دینووا (Dynova)",
  badgeLabel = "API Connected",
  subtitle = "Sprint 1 • Secure Access",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 select-none ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {logo || (
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white border border-indigo-500/30 shrink-0">
          <Shield className="w-5 h-5" />
        </div>
      )}

      {/* Hide brand name and details on mobile to prevent horizontal overflow */}
      <div className="min-w-0 hidden sm:block">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-white truncate">
            {brandName}
          </span>
          {badgeLabel && (
            <span className="hidden md:inline-flex text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium whitespace-nowrap">
              {badgeLabel}
            </span>
          )}
        </div>
        {subtitle && (
          <div className="text-[11px] text-slate-400 truncate hidden lg:block">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderBrand;
