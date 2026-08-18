import { useState, useEffect, useCallback } from "react";
import type { StoreSettings } from "@/types/settings";
import mockSettingsService from "../api/mockSettingsService";
import useToastStore from "@/shared-app/designSystem/toast/store";

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await mockSettingsService.getStoreSettings();
      setSettings(data);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در دریافت تنظیمات فروشگاه";
      useToastStore.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async (newSettings: StoreSettings) => {
    setIsSaving(true);
    try {
      const updated = await mockSettingsService.updateStoreSettings(newSettings);
      setSettings(updated);
      useToastStore.success("تنظیمات و اطلاعات فروشگاه با موفقیت ذخیره شد.");
      return { success: true };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در ذخیره‌سازی تنظیمات";
      useToastStore.error(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    isLoading,
    isSaving,
    saveSettings,
    refetch: fetchSettings,
  };
}

export default useStoreSettings;
