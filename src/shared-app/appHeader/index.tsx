import React from "react";
import type { AppHeaderProps } from "./types";
import HeaderUserMenu from "./HeaderUserMenu";
import NotificationCenter from "./NotificationCenter";
import {
  Menu,
  ShieldCheck,
  Package,
  TrendingUp,
  Truck,
  LogIn,
  Users,
  Tag,
  MessageSquare,
  Headphones,
  Settings,
  FolderTree,
  LayoutTemplate,
} from "lucide-react";

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentRoute,
  onNavigate,
  user,
  isAuthenticated = false,
  onLogout,
  isLoggingOut = false,
  rememberMe = false,
  className = "",
  onOpenMobileMenu,
}) => {
  const getPageInfo = () => {
    switch (currentRoute) {
      case "dashboard":
        return {
          title: "داشبورد تحلیلی و آمار فروشگاه",
          badge: "اسپرینت ۴",
          icon: <TrendingUp className="w-4 h-4 text-indigo-400" />,
        };
      case "homepage":
        return {
          title: "صفحه‌ساز بصری و مدیریت صفحه اصلی",
          badge: "اسپرینت ۸",
          icon: <LayoutTemplate className="w-4 h-4 text-indigo-400" />,
        };
      case "feedback":
        return {
          title: "نظرات کاربران و امتیازات کالاها",
          badge: "اسپرینت ۶",
          icon: <MessageSquare className="w-4 h-4 text-indigo-400" />,
        };
      case "support":
        return {
          title: "میز پشتیبانی مشتریان و تیکت‌ها",
          badge: "اسپرینت ۶",
          icon: <Headphones className="w-4 h-4 text-indigo-400" />,
        };
      case "customers":
        return {
          title: "باشگاه مشتریان و مدیریت ارتباط (CRM)",
          badge: "اسپرینت ۴",
          icon: <Users className="w-4 h-4 text-indigo-400" />,
        };
      case "coupons":
        return {
          title: "مدیریت کدهای تخفیف و پروموشن‌ها",
          badge: "اسپرینت ۴",
          icon: <Tag className="w-4 h-4 text-indigo-400" />,
        };
      case "orders":
        return {
          title: "مدیریت مرسولات و سفارش‌ها",
          badge: "اسپرینت ۳",
          icon: <Truck className="w-4 h-4 text-indigo-400" />,
        };
      case "products":
        return {
          title: "کاتالوگ محصولات و انبارداری",
          badge: "اسپرینت ۲",
          icon: <Package className="w-4 h-4 text-indigo-400" />,
        };
      case "categories":
        return {
          title: "مدیریت دسته‌بندی‌ها و ساختار کالا",
          badge: "اسپرینت ۷",
          icon: <FolderTree className="w-4 h-4 text-indigo-400" />,
        };
      case "settings":
        return {
          title: "تنظیمات، لجستیک و دسترسی‌ها",
          badge: "اسپرینت ۵",
          icon: <Settings className="w-4 h-4 text-indigo-400" />,
        };
      case "login":
        return {
          title: "احراز هویت و نشست‌ها",
          badge: "دسترسی",
          icon: <LogIn className="w-4 h-4 text-indigo-400" />,
        };
      default:
        return {
          title: "سامانه مدیریت دینووا",
          badge: "ادمین",
          icon: <ShieldCheck className="w-4 h-4 text-indigo-400" />,
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <header
      id="app-top-header"
      className={`glass-nav py-2.5 px-4 sm:px-6 sticky top-0 z-20 w-full border-b border-slate-800/90 bg-slate-950/90 backdrop-blur-md ${className}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Right side (RTL): Hamburger (mobile) + Page Title & Breadcrumb */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Button */}
          {onOpenMobileMenu && (
            <button
              type="button"
              id="mobile-hamburger-btn"
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="باز کردن منوی سایدبار"
              title="باز کردن منو"
            >
              <Menu className="w-5 h-5 text-indigo-400" />
            </button>
          )}

          {/* Page breadcrumb */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 p-1.5 px-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
              {pageInfo.icon}
              <span className="font-semibold text-white">{pageInfo.title}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                {pageInfo.badge}
              </span>
            </div>

            {/* Mobile Title */}
            <div className="sm:hidden flex items-center gap-1.5 text-xs font-semibold text-white">
              {pageInfo.icon}
              <span>{pageInfo.title}</span>
            </div>
          </div>
        </div>

        {/* Left side (RTL): Notification Bell, Quick Nav pills & User profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Center */}
          {isAuthenticated && <NotificationCenter onNavigate={onNavigate} />}

          {/* User Menu if Authenticated */}
          {isAuthenticated && user && (
            <HeaderUserMenu
              user={user}
              rememberMe={rememberMe}
              onLogout={onLogout}
              isLoggingOut={isLoggingOut}
            />
          )}

          {!isAuthenticated && currentRoute !== "login" && (
            <button
              type="button"
              onClick={() => onNavigate("login")}
              className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
            >
              ورود
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
