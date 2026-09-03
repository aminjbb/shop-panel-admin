import { apiRequest } from "@/config/api";
import type { Notification, NotificationListResponse } from "../types";

export const notificationApi = {
  list(signal?: AbortSignal): Promise<NotificationListResponse> {
    return apiRequest({ path: "/notifications", signal });
  },

  readAll(signal?: AbortSignal): Promise<void> {
    return apiRequest({
      path: "/notifications/read-all",
      method: "PATCH",
      signal,
    });
  },

  read(notificationId: string, signal?: AbortSignal): Promise<Notification> {
    return apiRequest({
      path: `/notifications/${encodeURIComponent(notificationId)}/read`,
      method: "PATCH",
      signal,
    });
  },

  archive(notificationId: string, signal?: AbortSignal): Promise<void> {
    return apiRequest({
      path: `/notifications/${encodeURIComponent(notificationId)}`,
      method: "DELETE",
      signal,
    });
  },
};
