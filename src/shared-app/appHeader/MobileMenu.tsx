import React from "react";
import type { MobileDrawerProps, AppRoute } from "./types";
import {
  TrendingUp,
  Users,
  Tag,
  Package,
  Truck,
  LogOut,
  HardDrive,
  ShieldCheck,
  X,
} from "lucide-react";
import ActivationBage from "@/shared-app/activationbage";
import EButton from "@/shared-app/designSystem/button";
import { AdminAvatar } from "@/entities/auth";

export const MobileMenu: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentRoute,
  onNavigate,
  user,
  isAuthenticated = false,
  onLogout,
  isLoggingOut = false,
  rememberMe = false,
}) => {
  if (!isOpen) return null;

  const handleNav = (route: AppRoute) => {
    onNavigate(route);
    onClose();
  };

  const getRoleLabel = () => {
    if (!user) return "";
    switch (user.role) {
      case "super_admin":
        return "مدیر ارشد سامانه";
      case "inventory_manager":
        return "مدیر انبار و زنجیره تأمین";
      case "support_agent":
        return "کارشناس پشتیبانی";
      default:
        return user.role;
    }
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full bg-slate-900 border-b border-slate-800 p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>منوی سامانه مدیریت دینووا</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="بستن منو"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Card if authenticated */}
        {isAuthenticated && user && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-3">
              <AdminAvatar user={user} className="w-10 h-10 rounded-xl border border-slate-700" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-white truncate">
                  {user.fullName}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {user.email}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
              <ActivationBage
                label={getRoleLabel()}
                status={user.role === "super_admin" ? "active" : "info"}
                className="text-[11px]"
              />

              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <HardDrive className="w-3 h-3 text-indigo-400" />
                <span>{rememberMe ? "حافظه پایدار" : "حافظه موقت"}</span>
              </span>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <div className="flex flex-col gap-1.5 py-1">
          <button
            type="button"
            onClick={() => handleNav("dashboard")}
            className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              currentRoute === "dashboard"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4" />
              <span>داشبورد تحلیلی و آمار</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
              اسپرینت ۴
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleNav("customers")}
            className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              currentRoute === "customers"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>باشگاه مشتریان (CRM)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
              VIP
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleNav("coupons")}
            className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              currentRoute === "coupons"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Tag className="w-4 h-4" />
              <span>کدهای تخفیف و پروموشن</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              جدید
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleNav("orders")}
            className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              currentRoute === "orders"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4" />
              <span>مرسولات و سفارش‌ها</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
              اسپرینت ۳
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleNav("products")}
            className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              currentRoute === "products"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>کاتالوگ محصولات و انبارداری</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
              اسپرینت ۲
            </span>
          </button>
        </div>

        {/* Logout button on mobile */}
        {isAuthenticated && onLogout && (
          <div className="pt-2 border-t border-slate-800">
            <EButton
              variant="destructive"
              size="md"
              onClick={() => {
                onLogout();
                onClose();
              }}
              isLoading={isLoggingOut}
              className="w-full text-xs justify-center"
              icon={<LogOut className="w-4 h-4" />}
            >
              خروج از حساب کاربری
            </EButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
