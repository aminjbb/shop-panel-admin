import { useState, useEffect, useCallback } from "react";
import type { ShippingMethod, CreateShippingMethodPayload } from "@/types/settings";
import mockSettingsService from "../api/mockSettingsService";
import useToastStore from "@/shared-app/designSystem/toast/store";

export function useShippingMethods() {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchShippingMethods = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await mockSettingsService.getShippingMethods();
      setShippingMethods(data);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در دریافت روش‌های ارسال";
      useToastStore.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShippingMethods();
  }, [fetchShippingMethods]);

  const toggleMethodStatus = async (id: string) => {
    try {
      const updated = await mockSettingsService.toggleShippingMethodStatus(id);
      setShippingMethods((prev) =>
        prev.map((m) => (m.id === id ? updated : m))
      );
      useToastStore.info(
        `روش ارسال «${updated.title}» ${updated.isActive ? "فعال" : "غیرفعال"} شد.`
      );
      return { success: true };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در تغییر وضعیت روش ارسال";
      useToastStore.error(errMsg);
      return { success: false };
    }
  };

  const createShippingMethod = async (payload: CreateShippingMethodPayload) => {
    setIsSubmitting(true);
    try {
      const created = await mockSettingsService.createShippingMethod(payload);
      setShippingMethods((prev) => [created, ...prev]);
      useToastStore.success(`روش ارسال «${created.title}» با موفقیت افزوده شد.`);
      return { success: true };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در ثبت روش ارسال جدید";
      useToastStore.error(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateShippingMethod = async (id: string, payload: Partial<ShippingMethod>) => {
    setIsSubmitting(true);
    try {
      const updated = await mockSettingsService.updateShippingMethod(id, payload);
      setShippingMethods((prev) =>
        prev.map((m) => (m.id === id ? updated : m))
      );
      useToastStore.success(`روش ارسال «${updated.title}» به‌روزرسانی شد.`);
      return { success: true };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در ویرایش روش ارسال";
      useToastStore.error(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteShippingMethod = async (id: string) => {
    setIsSubmitting(true);
    try {
      await mockSettingsService.deleteShippingMethod(id);
      setShippingMethods((prev) => prev.filter((m) => m.id !== id));
      useToastStore.success("روش ارسال با موفقیت حذف شد.");
      return { success: true };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در حذف روش ارسال";
      useToastStore.error(errMsg);
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    shippingMethods,
    isLoading,
    isSubmitting,
    toggleMethodStatus,
    createShippingMethod,
    updateShippingMethod,
    deleteShippingMethod,
    refetch: fetchShippingMethods,
  };
}

export default useShippingMethods;
