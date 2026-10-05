import type { ReactNode } from "react";

export type AdminRole =
  | "super_admin"
  | "inventory_manager"
  | "support_agent";

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  avatarUrl: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthSession {
  user: AdminUser;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export interface RefreshSessionRequest {
  refreshToken: string;
}

export type LogoutRequest = RefreshSessionRequest;

export interface ChangeAvatarRequest {
  file: File;
}

export interface AdminAvatarProps {
  user: AdminUser;
  className?: string;
  iconClassName?: string;
}

export interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
  accessTokenExpiresAt: string | null;
  refreshTokenExpiresAt: string | null;
  login: (credentials: LoginRequest) => Promise<AdminUser>;
  logout: () => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

