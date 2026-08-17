import type { ReactNode } from "react";
import type { AdminUser } from "@/types/auth";

export type AppRoute =
  | "login"
  | "dashboard"
  | "homepage"
  | "products"
  | "categories"
  | "orders"
  | "customers"
  | "coupons"
  | "feedback"
  | "support"
  | "settings"
  | "staff";

export interface NavItemConfig {
  id: AppRoute;
  label: string;
  subLabel?: string;
  icon: ReactNode;
  badge?: string;
  badgeVariant?: "default" | "active" | "warning" | "destructive" | "info";
  requiresAuth?: boolean;
}

export interface AppSidebarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  user?: AdminUser | null;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  isLoggingOut?: boolean;
  rememberMe?: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export interface SidebarUserProfileProps {
  user: AdminUser;
  rememberMe?: boolean;
  isCollapsed?: boolean;
  onLogout?: () => void;
  isLoggingOut?: boolean;
}

export interface SidebarNavProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  isAuthenticated?: boolean;
  isCollapsed?: boolean;
  onItemClick?: () => void;
}
