export type AdminRole = "super_admin" | "inventory_manager" | "support_agent";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar: string;
  department?: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  simulate500Error?: boolean;
}

export interface AuthResponse {
  user: AdminUser;
  token: string;
  rememberMe: boolean;
}

export interface AuthSession {
  user: AdminUser;
  token: string;
  rememberMe: boolean;
}

export interface RoleConfig {
  label: string;
  badgeStatus: "active" | "info" | "archived";
  color: string;
  permissions: string[];
  description: string;
}
