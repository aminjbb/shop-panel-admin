import type { AdminUser } from "@/entities/auth";

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
}

export interface DashboardRoleMatrixProps {
  user: AdminUser;
}

export interface DashboardSessionInspectorProps {
  user: AdminUser;
  rememberMe: boolean;
  accessTokenExpiresAt: string | null;
  refreshTokenExpiresAt: string | null;
}
