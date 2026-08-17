import React from "react";
import type { DashboardRoleMatrixProps } from "../types";
import { Check, X, ShieldAlert, Package, Headphones } from "lucide-react";
import ActivationBage from "@/shared-app/activationbage";

export const DashboardRoleMatrix: React.FC<DashboardRoleMatrixProps> = ({ user }) => {
  const permissionsList = [
    { key: "manage_users", label: "مدیریت کاربران و تغییر دسترسی‌ها", superAdmin: true, inventory: false, support: false },
    { key: "audit_logs", label: "مشاهده لاگ‌های امنیتی و گزارش‌های سیستمی", superAdmin: true, inventory: false, support: false },
    { key: "system_settings", label: "پیکربندی درگاه‌های پرداخت و تنظیمات کلان", superAdmin: true, inventory: false, support: false },
    { key: "inventory_crud", label: "ویرایش موجودی انبار، انبارگردانی و قیمت‌گذاری", superAdmin: true, inventory: true, support: false },
    { key: "suppliers_mgmt", label: "مدیریت تأمین‌کنندگان و پیش‌فاکتورها", superAdmin: true, inventory: true, support: false },
    { key: "order_dispatch", label: "تغییر وضعیت سفارشات و ارسال مرسوله‌ها", superAdmin: true, inventory: true, support: true },
    { key: "support_tickets", label: "پاسخگویی به تیکت‌های پشتیبانی و گفتگو با کاربر", superAdmin: true, inventory: false, support: true },
    { key: "customer_view", label: "مشاهده سوابق و پروفایل مشتریان", superAdmin: true, inventory: false, support: true },
  ];

  const getRoleIcon = (roleKey: string) => {
    switch (roleKey) {
      case "super_admin":
        return <ShieldAlert className="w-4 h-4 text-indigo-400" />;
      case "inventory_manager":
        return <Package className="w-4 h-4 text-amber-400" />;
      case "support_agent":
        return <Headphones className="w-4 h-4 text-emerald-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="glass-card p-6 border-white/10 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>ماتریس دسترسی و مجوزهای نقش‌ها (Role Permissions Matrix)</span>
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            بررسی مجوزهای فعال برای کاربر لاگین شده و مقایسه با سایر نقش‌های سامانه
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">نقش شما:</span>
          <ActivationBage
            label={user.role === "super_admin" ? "مدیر ارشد" : user.role === "inventory_manager" ? "مدیر انبار" : "پشتیبانی"}
            status="active"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-start text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-white/60">
              <th className="py-3 px-3 text-start font-semibold">عنوان مجوز / عملیات سیستمی</th>
              <th className={`py-3 px-3 text-center font-semibold rounded-t-lg ${user.role === "super_admin" ? "bg-indigo-500/10 text-indigo-300" : ""}`}>
                <div className="flex items-center justify-center gap-1.5">
                  {getRoleIcon("super_admin")}
                  <span>مدیر ارشد (Super Admin)</span>
                </div>
              </th>
              <th className={`py-3 px-3 text-center font-semibold rounded-t-lg ${user.role === "inventory_manager" ? "bg-amber-500/10 text-amber-300" : ""}`}>
                <div className="flex items-center justify-center gap-1.5">
                  {getRoleIcon("inventory_manager")}
                  <span>مدیر انبار (Inventory)</span>
                </div>
              </th>
              <th className={`py-3 px-3 text-center font-semibold rounded-t-lg ${user.role === "support_agent" ? "bg-emerald-500/10 text-emerald-300" : ""}`}>
                <div className="flex items-center justify-center gap-1.5">
                  {getRoleIcon("support_agent")}
                  <span>پشتیبانی (Support)</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {permissionsList.map((perm) => {
              const isAllowedForCurrent =
                (user.role === "super_admin" && perm.superAdmin) ||
                (user.role === "inventory_manager" && perm.inventory) ||
                (user.role === "support_agent" && perm.support);

              return (
                <tr
                  key={perm.key}
                  className={`hover:bg-white/[0.02] transition-colors ${
                    isAllowedForCurrent ? "bg-white/[0.01]" : ""
                  }`}
                >
                  <td className="py-3 px-3 font-medium text-white/90">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${isAllowedForCurrent ? "bg-emerald-400" : "bg-white/20"}`} />
                      <span>{perm.label}</span>
                    </div>
                  </td>

                  {/* Super Admin column */}
                  <td className={`py-3 px-3 text-center ${user.role === "super_admin" ? "bg-indigo-500/10 font-bold" : ""}`}>
                    {perm.superAdmin ? (
                      <span className="inline-flex p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-md bg-white/5 text-white/20">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </td>

                  {/* Inventory column */}
                  <td className={`py-3 px-3 text-center ${user.role === "inventory_manager" ? "bg-amber-500/10 font-bold" : ""}`}>
                    {perm.inventory ? (
                      <span className="inline-flex p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-md bg-white/5 text-white/20">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </td>

                  {/* Support column */}
                  <td className={`py-3 px-3 text-center ${user.role === "support_agent" ? "bg-emerald-500/10 font-bold" : ""}`}>
                    {perm.support ? (
                      <span className="inline-flex p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-md bg-white/5 text-white/20">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardRoleMatrix;
