import { useState, useEffect, useCallback } from "react";
import type { AdminNotification } from "@/types/feedback";
import mockFeedbackService from "../api/mockFeedbackService";
import { useToastStore } from "@/shared-app/designSystem/toast/store";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const list = await mockFeedbackService.getNotifications();
      setNotifications(list);
    } catch (err: any) {
      setError(err?.message || "خطا در دریافت اعلان‌ها");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Poll periodically every 30s to keep in sync
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await mockFeedbackService.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      // Ignore
    }
  };

  const markAllAsRead = async () => {
    try {
      await mockFeedbackService.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      useToastStore.info("تمام اعلان‌های سیستم به عنوان خوانده‌شده علامت‌گذاری شدند.", {
        title: "مرکز اعلان‌ها",
      });
    } catch {
      useToastStore.error("خطا در به‌روزرسانی اعلان‌ها");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await mockFeedbackService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      // Ignore
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};

export default useNotifications;
