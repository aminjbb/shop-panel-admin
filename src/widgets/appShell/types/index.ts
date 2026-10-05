import type { ReactNode } from "react";
import type { AdminRole, AdminUser } from "@/entities/auth";

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
  role?: AdminRole;
}

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
