import React from "react";
import type { SidebarUserProfileProps } from "./types";
import { LogOut, HardDrive, Shield } from "lucide-react";
import ActivationBage from "@/shared-app/activationbage";

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  user,
  rememberMe = false,
  isCollapsed = false,
  onLogout,
  isLoggingOut = false,
}) => {
  const getRoleLabel = () => {
    switch (user.role) {
      case "super_admin":
        return "مدیر ارشد";
      case "inventory_manager":
        return "مدیر انبار";
      case "support_agent":
        return "کارشناس";
      default:
        return user.role;
    }
  };

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative group">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-lg object-cover border border-indigo-500/30"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
        </div>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            title="خروج از حساب"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="خروج از حساب"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/90 flex flex-col gap-2.5 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="relative shrink-0">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-xl object-cover border border-indigo-500/30 ring-1 ring-slate-800"
          />
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950"
            title="آنلاین"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold text-white truncate flex items-center gap-1">
            <span>{user.name}</span>
          </div>
          <div className="text-[11px] text-slate-400 truncate dir-ltr text-right">
            {user.email}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1 text-[11px]">
        <ActivationBage
          label={getRoleLabel()}
          status={user.role === "super_admin" ? "active" : "info"}
          className="text-[10px] px-2 py-0.5"
        />

        <span
          className="inline-flex items-center gap-1 text-slate-400"
          title={rememberMe ? "نشست در localStorage ذخیره شده است" : "نشست موقت"}
        >
          <HardDrive className="w-3 h-3 text-indigo-400" />
          <span>{rememberMe ? "پایدار" : "موقت"}</span>
        </span>
      </div>

      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="mt-1 flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg text-xs font-medium text-slate-300 hover:text-rose-300 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{isLoggingOut ? "در حال خروج..." : "خروج از حساب"}</span>
        </button>
      )}
    </div>
  );
};

export default SidebarUserProfile;
