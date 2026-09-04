import type { ReactNode } from "react";
import type { AdminUser, LoginRequest } from "@/entities/auth";

export interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
  accessTokenExpiresAt: string | null;
  refreshTokenExpiresAt: string | null;
  login: (credentials: LoginRequest) => Promise<AdminUser>;
  logout: () => Promise<void>;
  updateAvatar?: (avatarUrl: string) => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
  requestId?: string;
}

export interface LoginFormProps {
  onSuccess?: () => void;
  className?: string;
}

export interface LoginHeaderProps {
  title?: string;
  subtitle?: string;
}

export interface LoginInputsProps {
  email: string;
  onEmailChange: (value: string) => void;
  onEmailBlur: () => void;
  emailError?: string;
  password: string;
  onPasswordChange: (value: string) => void;
  onPasswordBlur: () => void;
  passwordError?: string;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  rememberMe: boolean;
  onRememberMeChange: (checked: boolean) => void;
  disabled?: boolean;
}

export interface LoginSubmitButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  retryAfterSeconds?: number;
}
