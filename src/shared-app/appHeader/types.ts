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

export interface AppHeaderProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  user?: AdminUser | null;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  isLoggingOut?: boolean;
  rememberMe?: boolean;
  className?: string;
  logo?: ReactNode;
  brandName?: string;
  badgeLabel?: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
}

export interface HeaderUserMenuProps {
  user: AdminUser;
  rememberMe?: boolean;
  onLogout?: () => void;
  isLoggingOut?: boolean;
}

export interface HeaderNavProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  isAuthenticated?: boolean;
}

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  user?: AdminUser | null;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  isLoggingOut?: boolean;
  rememberMe?: boolean;
}
