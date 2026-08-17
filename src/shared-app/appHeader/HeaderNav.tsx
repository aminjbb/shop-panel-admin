import React from "react";
import type { HeaderNavProps } from "./types";
import { TrendingUp, Users, Tag, Package, Truck } from "lucide-react";

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentRoute,
  onNavigate,
  isAuthenticated = false,
}) => {
  return (
    <nav className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs">
      <button
        type="button"
        id="header-nav-dashboard"
        onClick={() => onNavigate("dashboard")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
          currentRoute === "dashboard"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <TrendingUp className="w-3.5 h-3.5" />
        <span>داشبورد</span>
      </button>

      <button
        type="button"
        id="header-nav-customers"
        onClick={() => onNavigate("customers")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
          currentRoute === "customers"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Users className="w-3.5 h-3.5" />
        <span>مشتریان</span>
      </button>

      <button
        type="button"
        id="header-nav-coupons"
        onClick={() => onNavigate("coupons")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
          currentRoute === "coupons"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Tag className="w-3.5 h-3.5" />
        <span>تخفیف‌ها</span>
      </button>

      <button
        type="button"
        id="header-nav-orders"
        onClick={() => onNavigate("orders")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
          currentRoute === "orders"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Truck className="w-3.5 h-3.5" />
        <span>مرسولات و سفارش‌ها</span>
      </button>

      <button
        type="button"
        id="header-nav-products"
        onClick={() => onNavigate("products")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
          currentRoute === "products"
            ? "bg-indigo-600 text-white font-semibold shadow-xs"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Package className="w-3.5 h-3.5" />
        <span>محصولات</span>
      </button>
    </nav>
  );
};

export default HeaderNav;
