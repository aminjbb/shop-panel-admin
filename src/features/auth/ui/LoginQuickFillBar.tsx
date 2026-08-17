import React from "react";
import type { LoginQuickFillBarProps } from "../types";
import { EButton } from "@/shared-app/designSystem/button";
import { ShieldAlert, Package, Headphones, AlertTriangle, KeyRound } from "lucide-react";

export const LoginQuickFillBar: React.FC<LoginQuickFillBarProps> = ({
  onSelectPreset,
  onSimulateError,
  disabled = false,
}) => {
  return (
    <div className="mt-6 pt-5 border-t border-white/10">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-white/70">
          <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
          <span>تکمیل سریع تست (Quick Fill Dev Bar):</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
          Mock Preset
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Super Admin */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectPreset("admin@dynova.io", "AdminPassword123")}
          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/10 hover:border-indigo-500/40 text-start transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">مدیر ارشد</div>
            <div className="text-[10px] text-white/50 truncate">super_admin</div>
          </div>
        </button>

        {/* Inventory Manager */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectPreset("inventory@dynova.io", "InventoryPass123")}
          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/10 hover:border-amber-500/40 text-start transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Package className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">مدیر انبار</div>
            <div className="text-[10px] text-white/50 truncate">inventory_manager</div>
          </div>
        </button>

        {/* Support Agent */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectPreset("support@dynova.io", "SupportPass123")}
          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/10 hover:border-emerald-500/40 text-start transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Headphones className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">پشتیبانی</div>
            <div className="text-[10px] text-white/50 truncate">support_agent</div>
          </div>
        </button>
      </div>

      {/* Edge Case 500 error button */}
      <div className="mt-2.5">
        <EButton
          variant="outlined"
          size="sm"
          disabled={disabled}
          onClick={onSimulateError}
          className="w-full text-xs text-rose-300 border-rose-500/20 hover:bg-rose-500/10 hover:border-rose-500/40 justify-center gap-2"
          icon={<AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
        >
          شبیه‌سازی خطای ۵۰۰ سرور (Server Error Simulation)
        </EButton>
      </div>
    </div>
  );
};

export default LoginQuickFillBar;
