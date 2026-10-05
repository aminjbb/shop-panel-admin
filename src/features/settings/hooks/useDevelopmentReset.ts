import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/api";
import { settingsApi } from "@/entities/settings";
import { useAuth } from "@/entities/auth";
import useToastStore from "@/shared-app/designSystem/toast/store";

const host = new URL(API_BASE_URL).hostname;
const isLocalApi = host === "localhost" || host === "127.0.0.1" || host === "::1";

export function useDevelopmentReset() {
  const queryClient = useQueryClient();
  const intentKeyRef = useRef<string | null>(null);
  const { user } = useAuth();
  const isAvailable = user?.role === "super_admin" && (import.meta.env.DEV || import.meta.env.MODE === "test") && isLocalApi;
  const mutation = useMutation({
    mutationFn: () => {
      intentKeyRef.current ??= crypto.randomUUID();
      return settingsApi.resetDevelopmentData({ confirmation: "development-data", idempotencyKey: intentKeyRef.current });
    },
    retry: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      intentKeyRef.current = null;
      useToastStore.success("داده‌های محیط توسعه بازنشانی شد.");
    },
    onError: () => useToastStore.error("بازنشانی داده‌های توسعه انجام نشد."),
  });
  return { isAvailable, isResetting: mutation.isPending, reset: () => mutation.mutateAsync().then(() => undefined) };
}
