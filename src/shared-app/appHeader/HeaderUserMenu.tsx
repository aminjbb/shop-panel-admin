import React, { useState } from "react";
import type { HeaderUserMenuProps } from "./types";
import ActivationBage from "@/shared-app/activationbage";
import EButton from "@/shared-app/designSystem/button";
import BottomSheet from "@/shared-app/bottomSheet";
import ImageUploader from "@/shared-app/designSystem/imageUploader";
import { LogOut, Camera, Check } from "lucide-react";
import { AdminAvatar } from "@/entities/auth";
import { useAuth } from "@/features/auth/context/AuthContext";

export const HeaderUserMenu: React.FC<HeaderUserMenuProps> = ({
  user,
  onLogout,
  isLoggingOut = false,
}) => {
  const { updateAvatar } = useAuth();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(user.avatarUrl || "");
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  const getRoleLabel = () => {
    switch (user.role) {
      case "super_admin":
        return "مدیر ارشد";
      case "inventory_manager":
        return "مدیر انبار";
      case "support_agent":
        return "پشتیبانی";
      default:
        return user.role;
    }
  };

  const getRoleStatus = () => {
    switch (user.role) {
      case "super_admin":
        return "active";
      case "inventory_manager":
        return "info";
      case "support_agent":
        return "info";
      default:
        return "archived";
    }
  };

  const handleOpenAvatarModal = () => {
    setTempAvatar(user.avatarUrl || "");
    setIsAvatarModalOpen(true);
  };

  const handleSaveAvatar = async () => {
    if (updateAvatar) {
      setIsSavingAvatar(true);
      try {
        await updateAvatar(tempAvatar);
        setIsAvatarModalOpen(false);
      } finally {
        setIsSavingAvatar(false);
      }
    } else {
      setIsAvatarModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {/* User Avatar and Info - Clickable to update profile picture */}
        <button
          type="button"
          onClick={handleOpenAvatarModal}
          title="کلیک برای تغییر تصویر پروفایل"
          className="group flex items-center gap-2.5 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer text-start"
        >
          <div className="relative">
            <AdminAvatar user={user} className="w-7 h-7 rounded-lg border border-slate-700 group-hover:border-indigo-500/60 transition-colors" iconClassName="w-4 h-4" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-slate-900" />
            <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="hidden md:flex flex-col text-start">
            <span className="text-xs font-semibold text-white group-hover:text-indigo-200 transition-colors leading-none">
              {user.fullName}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              {user.email}
            </span>
          </div>

          <ActivationBage
            label={getRoleLabel()}
            status={getRoleStatus() as "active" | "info" | "archived"}
            className="hidden lg:inline-flex text-[11px] py-0.5"
          />
        </button>

        {/* Logout button */}
        {onLogout && (
          <EButton
            variant="secondary"
            size="sm"
            onClick={onLogout}
            isLoading={isLoggingOut}
            className="text-xs text-rose-300 hover:text-rose-200 border-rose-500/30 hover:bg-rose-500/10"
            icon={<LogOut className="w-3.5 h-3.5" />}
          >
            <span className="hidden sm:inline">خروج</span>
          </EButton>
        )}
      </div>

      {/* Profile Photo Uploader Modal */}
      <BottomSheet
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title="تغییر تصویر پروفایل کاربری"
        subtitle="انتخاب یا آپلود تصویر پرسنلی شما در سامانه مدیریت داینوا"
        size="sm"
      >
        <div className="p-5 flex flex-col items-center gap-5">
          <ImageUploader
            label="تصویر پرسنلی شما"
            value={tempAvatar}
            onChange={(val) => setTempAvatar(val)}
            variant="avatar"
            helperText="فرمت‌های مجاز: JPG, PNG, WEBP. حداکثر حجم: ۵ مگابایت"
          />

          <div className="flex items-center justify-end gap-2 w-full pt-3 border-t border-slate-800">
            <EButton
              variant="secondary"
              size="sm"
              onClick={() => setIsAvatarModalOpen(false)}
            >
              انصراف
            </EButton>
            <EButton
              variant="primary"
              size="sm"
              onClick={handleSaveAvatar}
              isLoading={isSavingAvatar}
              icon={<Check className="w-4 h-4" />}
            >
              ذخیره تصویر پروفایل
            </EButton>
          </div>
        </div>
      </BottomSheet>
    </>
  );
};

export default HeaderUserMenu;
