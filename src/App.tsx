import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/features/auth/context/AuthContext";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ProductsPage from "@/pages/ProductsPage";
import OrdersPage from "@/pages/OrdersPage";
import CustomersPage from "@/pages/CustomersPage";
import CouponsPage from "@/pages/CouponsPage";
import SettingsPage from "@/pages/SettingsPage";
import FeedbackPage from "@/pages/FeedbackPage";
import CategoriesPage from "@/pages/CategoriesPage";
import HomepageBuilderPage from "@/pages/HomepageBuilderPage";
import AppHeader from "@/shared-app/appHeader";
import AppSidebar from "@/shared-app/appSidebar";
import ToastContainer from "@/shared-app/designSystem/toast/ToastContainer";
import type { AppRoute } from "@/shared-app/appSidebar/types";

const AppRoutes: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout, rememberMe } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>("login");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Sync route with authentication state
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        if (currentRoute === "login") {
          setCurrentRoute("dashboard"); // Default to analytics dashboard for Sprint 4
        }
      } else {
        setCurrentRoute("login");
      }
    }
  }, [isAuthenticated, isLoading]);

  const navigateTo = (route: AppRoute) => {
    setCurrentRoute(route);
    setIsMobileSidebarOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigateTo("login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col lg:flex-row selection:bg-indigo-500/30 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Global Toast Notifications Container */}
      <ToastContainer />

      {/* Desktop & Mobile App Sidebar */}
      <AppSidebar
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        user={user}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        rememberMe={rememberMe}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header with Hamburger Button & Breadcrumb */}
        <AppHeader
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          user={user}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
          rememberMe={rememberMe}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Main Routed View */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {currentRoute === "dashboard" ? (
            <DashboardPage
              onLogout={handleLogout}
              onRedirectToLogin={() => navigateTo("login")}
              onNavigate={navigateTo}
            />
          ) : currentRoute === "homepage" ? (
            <HomepageBuilderPage />
          ) : currentRoute === "feedback" ? (
            <FeedbackPage
              initialTab="reviews"
              onRedirectToLogin={() => navigateTo("login")}
            />
          ) : currentRoute === "support" ? (
            <FeedbackPage
              initialTab="tickets"
              onRedirectToLogin={() => navigateTo("login")}
            />
          ) : currentRoute === "categories" ? (
            <CategoriesPage onRedirectToLogin={() => navigateTo("login")} />
          ) : currentRoute === "customers" ? (
            <CustomersPage onRedirectToLogin={() => navigateTo("login")} />
          ) : currentRoute === "coupons" ? (
            <CouponsPage onRedirectToLogin={() => navigateTo("login")} />
          ) : currentRoute === "orders" ? (
            <OrdersPage />
          ) : currentRoute === "products" ? (
            <ProductsPage />
          ) : currentRoute === "settings" || currentRoute === "staff" ? (
            <SettingsPage />
          ) : (
            <LoginPage onLoginSuccess={() => navigateTo("dashboard")} />
          )}
        </main>

        {/* Footer info */}
        <footer className="py-4 px-6 border-t border-slate-800/80 text-center text-xs text-slate-400 bg-slate-950">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              دینووا • اسپرینت ۸: صفحه‌ساز بصری و مدیریت صفحه اصلی فروشگاه (EPIC-08)
            </span>
            <span className="text-slate-500">React 19 + TypeScript + Tailwind CSS</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
