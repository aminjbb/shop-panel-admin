import React from "react";
import type { LoginInputsProps } from "../types";
import ETextField from "@/shared-app/designSystem/textField";
import ESwitch from "@/shared-app/designSystem/switch";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export const LoginInputs: React.FC<LoginInputsProps> = ({
  email,
  onEmailChange,
  onEmailBlur,
  emailError,
  password,
  onPasswordChange,
  onPasswordBlur,
  passwordError,
  showPassword,
  onToggleShowPassword,
  rememberMe,
  onRememberMeChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Email Field */}
      <ETextField
        id="login-email-input"
        label="آدرس ایمیل اداری"
        placeholder="admin@dynova.io"
        value={email}
        onValueChange={onEmailChange}
        onBlur={onEmailBlur}
        error={Boolean(emailError)}
        helperText={emailError}
        required
        disabled={disabled}
        leftIcon={<Mail className="w-4 h-4" />}
        autoComplete="email"
        type="email"
      />

      {/* Password Field */}
      <ETextField
        id="login-password-input"
        label="کلمه عبور"
        placeholder="••••••••"
        value={password}
        onValueChange={onPasswordChange}
        onBlur={onPasswordBlur}
        error={Boolean(passwordError)}
        helperText={passwordError}
        required
        disabled={disabled}
        type={showPassword ? "text" : "password"}
        leftIcon={<Lock className="w-4 h-4" />}
        rightIcon={
          <button
            type="button"
            onClick={onToggleShowPassword}
            disabled={disabled}
            className="text-white/40 hover:text-white transition-colors p-1 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            aria-label={showPassword ? "مخفی کردن کلمه عبور" : "نمایش کلمه عبور"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        }
        autoComplete="current-password"
      />

      {/* Remember Me Toggle */}
      <div className="flex items-center justify-between pt-1">
        <ESwitch
          id="login-remember-me-switch"
          checked={rememberMe}
          onCheckedChange={onRememberMeChange}
          label="مرا به خاطر بسپار (ذخیره سشن در حافظه پایدار)"
          disabled={disabled}
          labelPosition="right"
        />

        <span className="text-[11px] text-indigo-400/80 hover:text-indigo-300 transition-colors cursor-pointer select-none">
          راهنمای ورود
        </span>
      </div>
    </div>
  );
};

export default LoginInputs;
