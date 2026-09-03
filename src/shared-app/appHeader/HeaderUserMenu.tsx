import React from "react";
import type { HeaderUserMenuProps } from "./types";
import ActivationBage from "@/shared-app/activationbage";
import EButton from "@/shared-app/designSystem/button";
import { LogOut } from "lucide-react";
import { AdminAvatar } from "@/entities/auth";

export const HeaderUserMenu: React.FC<HeaderUserMenuProps> = ({
  user,
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
        return "پشتیبانی";
      default:
        return user.role;
    }
  };

  const getRoleStatus = () => {
    switch (user.role) {
      case "super_admin":
        return "active";
      case "inventory_manager":
        return "info";
      case "support_agent":
        return "info";
      default:
        return "archived";
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* User Avatar and Info */}
      <div className="flex items-center gap-2.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative">
          <AdminAvatar user={user} className="w-7 h-7 rounded-lg border border-slate-700" iconClassName="w-4 h-4" />
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-slate-900" />
        </div>

        <div className="hidden md:flex flex-col text-start">
          <span className="text-xs font-semibold text-white leading-none">
            {user.fullName}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {user.email}
          </span>
        </div>

        <ActivationBage
          label={getRoleLabel()}
          status={getRoleStatus() as "active" | "info" | "archived"}
          className="hidden lg:inline-flex text-[11px] py-0.5"
        />
      </div>

      {/* Logout button */}
      {onLogout && (
        <EButton
          variant="secondary"
          size="sm"
          onClick={onLogout}
          isLoading={isLoggingOut}
          className="text-xs text-rose-300 hover:text-rose-200 border-rose-500/30 hover:bg-rose-500/10"
          icon={<LogOut className="w-3.5 h-3.5" />}
        >
          <span className="hidden sm:inline">خروج</span>
        </EButton>
      )}
    </div>
  );
};

export default HeaderUserMenu;
