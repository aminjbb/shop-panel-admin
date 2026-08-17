import React from "react";
import type { LoginHeaderProps } from "../types";
import { Shield, Sparkles } from "lucide-react";

export const LoginHeader: React.FC<LoginHeaderProps> = ({
  title = "ورود به پنل مدیریت دینووا",
  subtitle = "جهت مدیریت سفارش‌ها، محصولات و دسترسی‌های سامانه، مشخصات خود را وارد کنید",
}) => {
  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
          <Shield className="w-6 h-6" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 text-xs font-medium mb-2.5">
        <Sparkles className="w-3.5 h-3.5" />
        <span>احراز هویت ایزوله فرانت‌اند (Mock Auth)</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
        {title}
      </h2>
      <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
};

export default LoginHeader;
