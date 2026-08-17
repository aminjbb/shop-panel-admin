import React from "react";
import type { LoginBrandingSectionProps } from "../types";
import { ShieldCheck, Users, Zap, CheckCircle2, LockKeyhole } from "lucide-react";

export const LoginBrandingSection: React.FC<LoginBrandingSectionProps> = ({
  appName = "سامانه مدیریت دینووا (Dynova)",
}) => {
  const highlights = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
      title: "کنترل دسترسی نقش‌محور (RBAC)",
      desc: "شبیه‌سازی کامل ۳ سطح دسترسی: مدیر ارشد، انبارداری و پشتیبانی",
    },
    {
      icon: <LockKeyhole className="w-5 h-5 text-amber-400" />,
      title: "مدیریت توکن و سشن مستقل",
      desc: "ذخیره سشن در localStorage (با Remember Me) و sessionStorage با بازیابی خودکار",
    },
    {
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      title: "اعتبارسنجی آنی و شبیه‌سازی تاخیر شبکه",
      desc: "اعتبارسنجی Regex، رویدادهای onBlur و شبیه‌سازی دقیق ۵۰۰ تا ۸۰۰ میلی‌ثانیه تاخیر سرور",
    },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between p-10 glass-card border-white/10 max-w-lg">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl border border-indigo-500/30">
            D
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{appName}</h1>
            <p className="text-xs text-white/50">Sprint 1: Mock-Auth & Access Layer</p>
          </div>
        </div>

        <div className="space-y-6 my-10">
          <h3 className="text-sm font-semibold text-white/90">
            قابلیت‌های پیاده‌سازی‌شده در اسپرینت ۱:
          </h3>

          <div className="space-y-4">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="p-2 rounded-lg bg-slate-900/60 border border-white/10 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                  <p className="text-xs text-white/55 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>پوشش ۱۰۰٪ نیازمندی‌های اسپرینت ۱</span>
        </div>
        <span>نسخه آزمایشی v1.0.0</span>
      </div>
    </div>
  );
};

export default LoginBrandingSection;
