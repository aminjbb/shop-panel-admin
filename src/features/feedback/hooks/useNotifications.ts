import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "@/entities/notification";
import { useToastStore } from "@/shared-app/designSystem/toast/store";
import { mapNotification } from "../models/feedbackMappers";

export const useNotifications = () => {
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["notifications", "list"], queryFn: ({ signal }) => notificationApi.list(signal), select: (data) => data.notifications.map(mapNotification), refetchInterval: 30_000 });
  const invalidate = () => client.invalidateQueries({ queryKey: ["notifications"] });
  const read = useMutation({ mutationFn: (id: string) => notificationApi.read(id), onSuccess: invalidate });
  const readAll = useMutation({ mutationFn: () => notificationApi.readAll(), onSuccess: invalidate });
  const archive = useMutation({ mutationFn: (id: string) => notificationApi.archive(id), retry: false, onSuccess: invalidate });
  const notifications = query.data ?? [];
  return {
    notifications,
    unreadCount: notifications.filter((item) => !item.isRead).length,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
    markAsRead: async (id: string) => { try { await read.mutateAsync(id); } catch (error) { useToastStore.error(error instanceof Error ? error.message : "خطا در خواندن اعلان"); } },
    markAllAsRead: async () => { try { await readAll.mutateAsync(); useToastStore.info("همه اعلان‌ها خوانده شدند."); } catch (error) { useToastStore.error(error instanceof Error ? error.message : "خطا در خواندن اعلان‌ها"); } },
    deleteNotification: async (id: string) => { try { await archive.mutateAsync(id); } catch (error) { useToastStore.error(error instanceof Error ? error.message : "خطا در آرشیو اعلان"); } },
  };
};
export default useNotifications;
