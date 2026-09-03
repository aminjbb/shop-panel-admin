import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ApiError } from "@/config/api";
import { useAuth } from "../context/AuthContext";
import type { FormErrors } from "../types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useLoginFormModel = (onSuccess?: () => void) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [rateLimitDeadline, setRateLimitDeadline] = useState<number | null>(null);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState(0);
  const submitGuard = useRef(false);

  useEffect(() => {
    if (!rateLimitDeadline) {
      setRetryAfterSeconds(0);
      return;
    }
    const update = () => {
      const remaining = Math.max(0, Math.ceil((rateLimitDeadline - Date.now()) / 1000));
      setRetryAfterSeconds(remaining);
      if (remaining === 0) setRateLimitDeadline(null);
    };
    update();
    const interval = window.setInterval(update, 250);
    return () => window.clearInterval(interval);
  }, [rateLimitDeadline]);

  const validateEmail = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "وارد کردن آدرس ایمیل الزامی است.";
    if (!EMAIL_REGEX.test(trimmed)) return "فرمت آدرس ایمیل معتبر نیست.";
    return undefined;
  }, []);

  const validatePassword = useCallback((value: string) => {
    if (!value) return "وارد کردن کلمه عبور الزامی است.";
    if (value.length > 128) return "کلمه عبور حداکثر می‌تواند ۱۲۸ کاراکتر باشد.";
    return undefined;
  }, []);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setErrors((current) => ({ ...current, email: touched.email ? validateEmail(value) : undefined, general: undefined, requestId: undefined }));
  }, [touched.email, validateEmail]);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    setErrors((current) => ({ ...current, password: touched.password ? validatePassword(value) : undefined, general: undefined, requestId: undefined }));
  }, [touched.password, validatePassword]);

  const handleSubmit = useCallback(async (event?: FormEvent) => {
    event?.preventDefault();
    if (submitGuard.current || isLoading || retryAfterSeconds > 0) return;
    setTouched({ email: true, password: true });
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    submitGuard.current = true;
    setErrors({});
    try {
      await login({ email, password, rememberMe });
      onSuccess?.();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === "validation_error") {
          const next: FormErrors = {};
          for (const field of error.details.fields ?? []) {
            if (field.field === "body.email") next.email = "آدرس ایمیل معتبر نیست.";
            else if (field.field === "body.password") next.password = "کلمه عبور معتبر نیست.";
          }
          next.general = next.email || next.password ? undefined : "اطلاعات فرم معتبر نیست.";
          next.requestId = error.requestId ?? undefined;
          setErrors(next);
        } else if (error.code === "invalid_credentials") {
          setErrors({ general: "ایمیل یا کلمه عبور صحیح نیست." });
        } else if (error.code === "rate_limited") {
          const seconds = Math.max(1, error.retryAfterSeconds ?? 60);
          setRateLimitDeadline(Date.now() + seconds * 1000);
          setErrors({ general: "تعداد تلاش‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید." });
        } else {
          setErrors({ general: "ورود به سامانه انجام نشد. دوباره تلاش کنید.", requestId: error.requestId ?? undefined });
        }
      } else {
        setErrors({ general: "ارتباط با سرور برقرار نشد. اتصال شبکه را بررسی کنید." });
      }
    } finally {
      submitGuard.current = false;
    }
  }, [email, isLoading, login, onSuccess, password, rememberMe, retryAfterSeconds, validateEmail, validatePassword]);

  return {
    email, password, rememberMe, showPassword, errors, isLoading, retryAfterSeconds,
    isSubmitDisabled: isLoading || retryAfterSeconds > 0,
    handleEmailChange,
    handlePasswordChange,
    handleEmailBlur: () => {
      setTouched((current) => ({ ...current, email: true }));
      setErrors((current) => ({ ...current, email: validateEmail(email) }));
    },
    handlePasswordBlur: () => {
      setTouched((current) => ({ ...current, password: true }));
      setErrors((current) => ({ ...current, password: validatePassword(password) }));
    },
    toggleShowPassword: () => setShowPassword((current) => !current),
    setRememberMe,
    handleSubmit,
    clearGeneralError: () => setErrors((current) => ({ ...current, general: undefined, requestId: undefined })),
  };
};
