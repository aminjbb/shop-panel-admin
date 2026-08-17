import React, { useState } from "react";
import HeaderPages from "@/shared-app/headerPages";
import StatCard from "@/shared-app/statCard";
import { EButton } from "@/shared-app/designSystem/button";
import useStoreSettings from "@/features/settings/hooks/useStoreSettings";
import useShippingMethods from "@/features/settings/hooks/useShippingMethods";
import useAdminStaff from "@/features/settings/hooks/useAdminStaff";
import StoreSettingsForm from "@/features/settings/ui/StoreSettingsForm";
import ShippingMethodsSection from "@/features/settings/ui/ShippingMethodsSection";
import AdminStaffSection from "@/features/settings/ui/AdminStaffSection";
import mockSettingsService from "@/features/settings/api/mockSettingsService";
import useToastStore from "@/shared-app/designSystem/toast/store";
import {
  Store,
  Truck,
  ShieldCheck,
  RotateCcw,
  Coins,
  Users,
  Settings as SettingsIcon,
} from "lucide-react";

export type SettingsActiveTab = "store" | "shipping" | "staff";

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsActiveTab>("store");
  const [isResetting, setIsResetting] = useState(false);

  // Hooks
  const storeHook = useStoreSettings();
  const shippingHook = useShippingMethods();
  const staffHook = useAdminStaff();

  const handleResetDefaults = async () => {
    if (!window.confirm("آیا از بازنشانی کلیه تنظیمات، روش‌های ارسال و پرسنل به مقادیر پیش‌فرض اطمینان دارید؟")) {
      return;
    }
    setIsResetting(true);
    try {
      await mockSettingsService.resetSettingsToDefault();
      await Promise.all([
        storeHook.refetch(),
        shippingHook.refetch(),
        staffHook.refetch(),
      ]);
      useToastStore.info("تمام داده‌ها به مقادیر اولیه دیفالت بازگشتند.", {
        title: "بازنشانی انجام شد",
      });
    } catch (err: any) {
      useToastStore.error(err?.message || "امکان بازنشانی داده‌ها وجود ندارد", {
        title: "خطا در بازنشانی",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const activeShippingCount = shippingHook.shippingMethods.filter((m) => m.isActive).length;
  const activeStaffCount = staffHook.counts.active;

  return (
    <div className="flex flex-col gap-6 pb-20 sm:pb-8">
      {/* Top Header */}
      <HeaderPages
        title="تنظیمات فروشگاه و مدیریت دسترسی‌ها"
        subtitle="پیکربندی هویت فروشگاه، مالیات، تعرفه‌های ارسال کالا و دسترسی‌های پرسنل ادمین (اسپرینت ۵)"
      >
        <EButton
          variant="outlined"
          onClick={handleResetDefaults}
          isLoading={isResetting}
          icon={<RotateCcw className="w-4 h-4 text-slate-400" />}
          className="text-xs text-slate-300 hover:text-white"
        >
          بازنشانی به پیش‌فرض
        </EButton>
      </HeaderPages>

      {/* Top KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <StatCard
          title="واحد پولی و مالیات"
          value={`${storeHook.settings?.taxRate || 10}٪ مالیات`}
          description={`واحد پولی پیش‌فرض: ${storeHook.settings?.currency === "IRT" ? "تومان ایران" : "ریال"}`}
          icon={<Coins className="w-5 h-5 text-indigo-400" />}
          trend={{ value: "مصوب", isPositive: true }}
          className="cursor-pointer hover:border-indigo-500/40 transition-colors"
        />

        <StatCard
          title="روش‌های ارسال فعال"
          value={`${activeShippingCount} روش فعال`}
          description={`از مجموع ${shippingHook.shippingMethods.length} روش تعریف شده`}
          icon={<Truck className="w-5 h-5 text-emerald-400" />}
          trend={{ value: "۱۰۰٪ پوشش", isPositive: true }}
          className="cursor-pointer hover:border-emerald-500/40 transition-colors"
        />

        <StatCard
          title="مدیران و دسترسی‌ها"
          value={`${activeStaffCount} مدیر فعال`}
          description={`${staffHook.counts.super_admin} سوپرادمین، ${staffHook.counts.inventory_manager} انباردار`}
          icon={<ShieldCheck className="w-5 h-5 text-purple-400" />}
          trend={{ value: `${staffHook.total} پرسنل`, isPositive: true }}
          className="cursor-pointer hover:border-purple-500/40 transition-colors"
        />
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-x-auto shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab("store")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "store"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Store className="w-4 h-4" />
          <span>تنظیمات عمومی و مالیات (PBI-5.2)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("shipping")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "shipping"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>روش‌های ارسال و لجستیک (PBI-5.3)</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === "shipping" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
            }`}
          >
            {shippingHook.shippingMethods.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("staff")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "staff"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>مدیران و سطوح دسترسی (PBI-5.4)</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === "staff" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
            }`}
          >
            {staffHook.total}
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "store" && (
        <StoreSettingsForm
          settings={storeHook.settings}
          isLoading={storeHook.isLoading}
          isSaving={storeHook.isSaving}
          onSave={storeHook.saveSettings}
        />
      )}

      {activeTab === "shipping" && (
        <ShippingMethodsSection
          shippingMethods={shippingHook.shippingMethods}
          isLoading={shippingHook.isLoading}
          isSubmitting={shippingHook.isSubmitting}
          onToggleStatus={shippingHook.toggleMethodStatus}
          onCreateMethod={shippingHook.createShippingMethod}
          onUpdateMethod={shippingHook.updateShippingMethod}
          onDeleteMethod={shippingHook.deleteShippingMethod}
        />
      )}

      {activeTab === "staff" && (
        <AdminStaffSection
          staff={staffHook.staff}
          total={staffHook.total}
          page={staffHook.page}
          totalPages={staffHook.totalPages}
          counts={staffHook.counts}
          filterParams={staffHook.filterParams}
          isLoading={staffHook.isLoading}
          isSubmitting={staffHook.isSubmitting}
          onSearchChange={staffHook.handleSearchChange}
          onRoleChange={staffHook.handleRoleChange}
          onStatusChange={staffHook.handleStatusChange}
          onPageChange={staffHook.handlePageChange}
          onCreateStaff={staffHook.createStaff}
          onUpdateRole={staffHook.updateRole}
          onToggleStatus={staffHook.toggleStatus}
          onDeleteStaff={staffHook.deleteStaffMember}
        />
      )}
    </div>
  );
};

export default SettingsPage;
