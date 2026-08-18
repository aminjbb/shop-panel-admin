import React, { useEffect } from "react";
import type { AppSidebarProps } from "./types";
import SidebarNav from "./SidebarNav";
import SidebarUserProfile from "./SidebarUserProfile";
import {
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  X,
  Database,
} from "lucide-react";

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentRoute,
  onNavigate,
  user,
  isAuthenticated = false,
  onLogout,
  isLoggingOut = false,
  rememberMe = false,
  isMobileOpen,
  onMobileClose,
  isCollapsed = false,
  onToggleCollapse,
  className = "",
}) => {
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DESKTOP / TABLET SIDEBAR (lg:flex)                                      */}
      {/* ========================================================================= */}
      <aside
        id="desktop-app-sidebar"
        className={`hidden lg:flex flex-col justify-between shrink-0 h-screen sticky top-0 self-start z-30 bg-slate-950/95 border-l border-slate-800/90 transition-all duration-300 backdrop-blur-md overflow-y-auto custom-scrollbar ${
          isCollapsed ? "w-20 p-3" : "w-64 xl:w-72 p-4"
        } ${className}`}
      >
        {/* Top: Brand & Collapse Toggle */}
        <div className="flex flex-col gap-5">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-between"
            } pb-3.5 border-b border-slate-800/80`}
          >
            {!isCollapsed ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white tracking-tight">
                      دینووا
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                      ادمین
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    پنل مدیریت انبار و کاتالوگ
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0"
                title="پنل مدیریت دینووا"
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}

            {/* Collapse / Expand Toggle Button */}
            {onToggleCollapse && (
              <button
                type="button"
                id="sidebar-collapse-toggle"
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
                title={isCollapsed ? "گسترش سایدبار" : "جمع کردن سایدبار"}
                aria-label="تغییر وضعیت سایدبار"
              >
                {isCollapsed ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1">
            {!isCollapsed && (
              <span className="text-[10px] font-semibold text-slate-400 px-2 mb-1 tracking-wider uppercase">
                منوی اصلی سیستم
              </span>
            )}
            <SidebarNav
              currentRoute={currentRoute}
              onNavigate={onNavigate}
              isAuthenticated={isAuthenticated}
              isCollapsed={isCollapsed}
            />
          </div>
        </div>

        {/* Bottom Section: Mock Engine Info + User Profile */}
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-800/80">
          {!isCollapsed && (
            <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs">
              <div className="flex items-center gap-1.5 text-indigo-300 font-semibold mb-1">
                <Database className="w-3.5 h-3.5" />
                <span>پایگاه داده لوکال</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                تغییرات محصولات و موجودی مستقیماً در حافظه مرورگر ذخیره و همگام‌سازی می‌شوند.
              </p>
            </div>
          )}

          {isAuthenticated && user && (
            <SidebarUserProfile
              user={user}
              rememberMe={rememberMe}
              isCollapsed={isCollapsed}
              onLogout={onLogout}
              isLoggingOut={isLoggingOut}
            />
          )}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE HAMBURGER DRAWER (lg:hidden)                                     */}
      {/* ========================================================================= */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onMobileClose}
            aria-hidden="true"
          />

          {/* Slide-out Sidebar Drawer */}
          <div
            id="mobile-hamburger-drawer"
            className="relative z-10 w-80 max-w-[85vw] h-full bg-slate-950 border-r border-slate-800 p-5 shadow-2xl flex flex-col justify-between overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-250"
          >
            {/* Drawer Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">دینووا</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                        پنل ادمین
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">سامانه مدیریت محصولات و انبار</p>
                  </div>
                </div>

                <button
                  type="button"
                  id="mobile-drawer-close"
                  onClick={onMobileClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
                  aria-label="بستن منو"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex flex-col gap-1 py-1">
                <span className="text-[11px] font-semibold text-slate-400 px-1 mb-1">
                  صفحات سیستم:
                </span>
                <SidebarNav
                  currentRoute={currentRoute}
                  onNavigate={onNavigate}
                  isAuthenticated={isAuthenticated}
                  isCollapsed={false}
                  onItemClick={onMobileClose}
                />
              </div>
            </div>

            {/* Drawer Footer & User Card */}
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              {isAuthenticated && user && (
                <SidebarUserProfile
                  user={user}
                  rememberMe={rememberMe}
                  isCollapsed={false}
                  onLogout={() => {
                    if (onLogout) {
                      onLogout();
                    }
                    if (onMobileClose) {
                      onMobileClose();
                    }
                  }}
                  isLoggingOut={isLoggingOut}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppSidebar;
