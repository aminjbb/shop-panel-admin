import React from "react";
import type { DashboardHeaderProps } from "../types";
import HeaderPages from "@/shared-app/headerPages";
import ActivationBage from "@/shared-app/activationbage";
import EButton from "@/shared-app/designSystem/button";
import { LogOut, Shield, HardDrive } from "lucide-react";
import { AdminAvatar } from "@/entities/auth";

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  rememberMe,
  onLogout,
  isLoggingOut,
}) => {
  const getRoleBadge = () => {
    switch (user.role) {
      case "super_admin":
        return <ActivationBage label="مدیر ارشد سامانه (Super Admin)" status="active" />;
      case "inventory_manager":
        return <ActivationBage label="مدیر موجودی و انبار (Inventory)" status="info" />;
      case "support_agent":
        return <ActivationBage label="کارشناس پشتیبانی (Support)" status="info" />;
      default:
        return <ActivationBage label={user.role} status="archived" />;
    }
  };

  return (
    <div className="glass-card p-6 border-white/10 mb-6">
      <HeaderPages
        title={`خوش آمدید، ${user.fullName}`}
        subtitle="سامانه مدیریت یکپارچه دینووا"
      >
        <div className="flex items-center gap-3 flex-wrap">
          {getRoleBadge()}

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70">
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            <span>ذخیره: {rememberMe ? "localStorage (پایدار)" : "sessionStorage (تب جاری)"}</span>
          </span>

          <EButton
            variant="destructive"
            size="md"
            onClick={onLogout}
            isLoading={isLoggingOut}
            icon={<LogOut className="w-4 h-4" />}
          >
            خروج از حساب (Logout)
          </EButton>
        </div>
      </HeaderPages>

      {/* User profile quick info bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-3.5">
          <AdminAvatar user={user} className="w-12 h-12 rounded-2xl border-2 border-indigo-500/40" iconClassName="w-6 h-6" />
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{user.fullName}</span>
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-xs text-white/50">{user.email}</div>
          </div>
        </div>

        <div className="text-xs text-white/50 text-start sm:text-end">
          <div>شناسه کاربری: <span className="font-mono text-white/80">{user.id}</span></div>
          <div className="mt-0.5">آخرین ورود ثبت‌شده: <span className="text-white/80">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("fa-IR") : "ثبت نشده"}</span></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
