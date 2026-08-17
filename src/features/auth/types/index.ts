import type { ReactNode } from "react";
import type { AdminRole } from "@/types/auth";

export interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface QuickFillOption {
  role: AdminRole;
  title: string;
  email: string;
  password: string;
  description: string;
  color: string;
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

export interface LoginQuickFillBarProps {
  onSelectPreset: (email: string, password: string) => void;
  onSimulateError: () => void;
  disabled?: boolean;
}

export interface LoginSubmitButtonProps {
  isLoading: boolean;
  disabled?: boolean;
}
