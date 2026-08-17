import type { AdminUser } from "@/types/auth";

export interface DashboardWidgetProps {
  onLogout?: () => void;
}

export interface DashboardHeaderProps {
  user: AdminUser;
  rememberMe: boolean;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export interface DashboardStatsProps {
  user: AdminUser;
  rememberMe: boolean;
  token: string;
}

export interface DashboardRoleMatrixProps {
  user: AdminUser;
}

export interface DashboardSessionInspectorProps {
  user: AdminUser;
  token: string;
  rememberMe: boolean;
}
