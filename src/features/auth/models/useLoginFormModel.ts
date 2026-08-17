import { useState, useCallback, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import type { FormErrors } from "../types";
import { MOCK_USERS } from "../api/authMockApi";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useLoginFormModel = (onSuccess?: () => void) => {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const validateEmail = useCallback((value: string): string | undefined => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "وارد کردن آدرس ایمیل الزامی است.";
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      return "فرمت آدرس ایمیل وارد شده نامعتبر است (مثال: admin@dynova.io).";
    }
    return undefined;
  }, []);

  const validatePassword = useCallback((value: string): string | undefined => {
    if (!value) {
      return "وارد کردن کلمه عبور الزامی است.";
    }
    if (value.length < 6) {
      return "کلمه عبور باید حداقل شامل ۶ کاراکتر باشد.";
    }
    return undefined;
  }, []);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setErrors((prev) => ({
      ...prev,
      email: touched.email ? validateEmail(value) : undefined,
      general: undefined,
    }));
  }, [touched.email, validateEmail]);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    setErrors((prev) => ({
      ...prev,
      password: touched.password ? validatePassword(value) : undefined,
      general: undefined,
    }));
  }, [touched.password, validatePassword]);

  const handleEmailBlur = useCallback(() => {
    setTouched((prev) => ({ ...prev, email: true }));
    const error = validateEmail(email);
    setErrors((prev) => ({ ...prev, email: error }));
  }, [email, validateEmail]);

  const handlePasswordBlur = useCallback(() => {
    setTouched((prev) => ({ ...prev, password: true }));
    const error = validatePassword(password);
    setErrors((prev) => ({ ...prev, password: error }));
  }, [password, validatePassword]);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSelectPreset = useCallback((presetEmail: string, presetPassword: string) => {
    setEmail(presetEmail);
    setPassword(presetPassword);
    setErrors({});
    setTouched({ email: true, password: true });
  }, []);

  const handleSimulateError = useCallback(() => {
    setEmail("error500@store.com");
    setPassword("AnyPassword123");
    setErrors({});
    setTouched({ email: true, password: true });
  }, []);

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      setTouched({ email: true, password: true });

      const emailErr = validateEmail(email);
      const passwordErr = validatePassword(password);

      if (emailErr || passwordErr) {
        setErrors({
          email: emailErr,
          password: passwordErr,
          general: "لطفاً خطاهای فرم را برطرف نمایید.",
        });
        return;
      }

      setErrors({});

      try {
        await login({
          email,
          password,
          rememberMe,
        });

        if (onSuccess) {
          onSuccess();
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "خطای ناشناخته در ورود به سامانه رخ داد.";
        setErrors({ general: message });
      }
    },
    [email, password, rememberMe, validateEmail, validatePassword, login, onSuccess]
  );

  const clearGeneralError = useCallback(() => {
    setErrors((prev) => ({ ...prev, general: undefined }));
  }, []);

  return {
    email,
    password,
    rememberMe,
    showPassword,
    errors,
    isLoading,
    handleEmailChange,
    handlePasswordChange,
    handleEmailBlur,
    handlePasswordBlur,
    toggleShowPassword,
    setRememberMe,
    handleSelectPreset,
    handleSimulateError,
    handleSubmit,
    clearGeneralError,
    mockUsers: MOCK_USERS,
  };
};
