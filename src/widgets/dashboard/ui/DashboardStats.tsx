import React from "react";
import type { DashboardStatsProps } from "../types";
import StatCard from "@/shared-app/statCard";
import { ShieldCheck, Key, Database, Zap } from "lucide-react";

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  user,
  rememberMe,
  token,
}) => {
  const getPermissionCount = () => {
    switch (user.role) {
      case "super_admin":
        return "تمام سطوح (۱۰ دسترسی)";
      case "inventory_manager":
        return "۴ دسترسی تخصصی";
      case "support_agent":
        return "۳ دسترسی کارشناسی";
      default:
        return "۱ دسترسی پایه";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="وضعیت نشست کاربری"
        value="احراز هویت شده"
        icon={<ShieldCheck className="w-5 h-5" />}
        iconBgClassName="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
        trend={{ value: "فعال و معتبر", isPositive: true }}
        description="سشن با موفقیت در کلاینت ایجاد گردیده است."
      />

      <StatCard
        label="موقعیت ذخیره‌سازی توکن"
        value={rememberMe ? "localStorage" : "sessionStorage"}
        icon={<Database className="w-5 h-5" />}
        iconBgClassName="bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
        trend={{ value: rememberMe ? "پایدار (Persistent)" : "موقت (Tab-Only)", isPositive: rememberMe }}
        description={
          rememberMe
            ? "با بستن مرورگر یا رفرش سشن باقی می‌ماند."
            : "با بستن تب یا مرورگر سشن پاک می‌شود."
        }
      />

      <StatCard
        label="سطح مجوزهای نقش"
        value={getPermissionCount()}
        icon={<Key className="w-5 h-5" />}
        iconBgClassName="bg-amber-500/20 text-amber-400 border-amber-500/30"
        description={`نقش منتسب: ${user.role}`}
      />

      <StatCard
        label="پاسخ‌دهی سرویس ماک"
        value="~۵۰۰ میلی‌ثانیه"
        icon={<Zap className="w-5 h-5" />}
        iconBgClassName="bg-purple-500/20 text-purple-400 border-purple-500/30"
        trend={{ value: "شبیه‌سازی شبکه", isPositive: true }}
        description="با تاخیر مصنوعی جهت تست UX لودینگ"
      />
    </div>
  );
};

export default DashboardStats;
