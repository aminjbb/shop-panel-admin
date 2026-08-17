import React from "react";
import type { SidebarNavProps, NavItemConfig, AppRoute } from "./types";
import {
  TrendingUp,
  Users,
  Tag,
  Truck,
  Package,
  Settings,
  ShieldCheck,
  ChevronLeft,
  MessageSquare,
  Headphones,
  FolderTree,
  LayoutTemplate,
} from "lucide-react";

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentRoute,
  onNavigate,
  isCollapsed = false,
  onItemClick,
}) => {
  const navItems: NavItemConfig[] = [
    {
      id: "dashboard",
      label: "داشبورد تحلیلی و آمار",
      subLabel: "شاخص‌های فروش، نمودارها و نرخ رشد",
      icon: <TrendingUp className="w-5 h-5 shrink-0" />,
      badge: "اسپرینت ۴",
      badgeVariant: "active",
      requiresAuth: true,
    },
    {
      id: "homepage",
      label: "صفحه‌ساز و بنرها",
      subLabel: "چیدمان، هیرو، شگفت‌انگیزها و ردیف‌ها",
      icon: <LayoutTemplate className="w-5 h-5 shrink-0" />,
      badge: "اسپرینت ۸",
      badgeVariant: "active",
      requiresAuth: true,
    },
    {
      id: "categories",
      label: "دسته‌بندی و ویژگی‌ها",
      subLabel: "سلسله‌مراتب درختی و ساختار کالا",
      icon: <FolderTree className="w-5 h-5 shrink-0" />,
      badge: "اسپرینت ۷",
      badgeVariant: "active",
      requiresAuth: true,
    },
    {
      id: "products",
      label: "کاتالوگ و انبارداری",
      subLabel: "مدیریت کالاها، واریانت‌ها و موجودی",
      icon: <Package className="w-5 h-5 shrink-0" />,
      badge: "اسپرینت ۲",
      badgeVariant: "default",
      requiresAuth: true,
    },
    {
      id: "feedback",
      label: "نظرات و بازخورد کالاها",
      subLabel: "بررسی، انتشار و پاسخ‌دهی به نظرات",
      icon: <MessageSquare className="w-5 h-5 shrink-0" />,
      badge: "اسپرینت ۶",
      badgeVariant: "active",
      requiresAuth: true,
    },
    {
      id: "support",
      label: "میز پشتیبانی و تیکت‌ها",
      subLabel: "گفتگوی آنلاین، اولویت‌بندی و پیگیری",
      icon: <Headphones className="w-5 h-5 shrink-0" />,
      badge: "آنلاین",
      badgeVariant: "info",
      requiresAuth: true,
    },
    {
      id: "customers",
      label: "باشگاه مشتریان (CRM)",
      subLabel: "مدیریت اعضا، سطوح وفاداری و رفتار خرید",
      icon: <Users className="w-5 h-5 shrink-0" />,
      badge: "VIP",
      badgeVariant: "warning",
      requiresAuth: true,
    },
    {
      id: "coupons",
      label: "کدهای تخفیف و پروموشن",
      subLabel: "جشنواره‌ها، کدهای درصدی و ریالی",
      icon: <Tag className="w-5 h-5 shrink-0" />,
      badge: "جدید",
      badgeVariant: "default",
      requiresAuth: true,
    },
    {
      id: "orders",
      label: "مرسولات و سفارش‌ها",
      subLabel: "رهگیری پستی، فاکتور و وضعیت ارسال",
      icon: <Truck className="w-5 h-5 shrink-0" />,
      badge: "اسپرینت ۳",
      badgeVariant: "info",
      requiresAuth: true,
    },
    {
      id: "settings",
      label: "تنظیمات، لجستیک و دسترسی‌ها",
      subLabel: "مالیات، روش‌های ارسال و پرسنل (RBAC)",
      icon: <Settings className="w-5 h-5 shrink-0" />,
      badge: "اسپرینت ۵",
      badgeVariant: "active",
      requiresAuth: true,
    },
  ];

  const handleItemClick = (route: AppRoute) => {
    onNavigate(route);
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <nav className="flex flex-col gap-1.5 w-full">
      {navItems.map((item) => {
        const isActive = currentRoute === item.id;

        if (isCollapsed) {
          return (
            <button
              key={item.id}
              type="button"
              id={`sidebar-nav-${item.id}`}
              onClick={() => handleItemClick(item.id)}
              title={`${item.label} ${item.subLabel ? `(${item.subLabel})` : ""}`}
              className={`relative flex items-center justify-center w-full h-11 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800"
              }`}
            >
              {item.icon}
              {isActive && (
                <span className="absolute right-0 top-2 bottom-2 w-1 bg-white rounded-l-full" />
              )}
            </button>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            id={`sidebar-nav-${item.id}`}
            onClick={() => handleItemClick(item.id)}
            title={`${item.label} ${item.subLabel ? `(${item.subLabel})` : ""}`}
            className={`group relative flex items-center justify-between w-full p-2.5 sm:p-3 rounded-xl transition-all duration-200 cursor-pointer text-right gap-2 overflow-hidden ${
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold"
                : "text-slate-300 hover:text-white hover:bg-slate-900/90 border border-transparent hover:border-slate-800/80"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
              <div
                className={`p-2 rounded-lg transition-colors shrink-0 ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-800/80 text-slate-400 group-hover:text-indigo-400 group-hover:bg-slate-800"
                }`}
              >
                {item.icon}
              </div>

              <div className="flex flex-col items-start min-w-0 flex-1 overflow-hidden">
                <span className="text-xs sm:text-sm font-medium tracking-tight truncate w-full block text-start">
                  {item.label}
                </span>
                {item.subLabel && (
                  <span
                    className={`text-[11px] truncate w-full block text-start ${
                      isActive ? "text-indigo-100/90" : "text-slate-400"
                    }`}
                  >
                    {item.subLabel}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  }`}
                >
                  {item.badge}
                </span>
              )}
              <ChevronLeft
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive
                    ? "text-white translate-x-0.5"
                    : "text-slate-600 group-hover:text-slate-400"
                }`}
              />
            </div>
          </button>
        );
      })}
    </nav>
  );
};

export default SidebarNav;
