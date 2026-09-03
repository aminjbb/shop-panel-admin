export interface NotificationPayload {
  productId: string | null;
  variantId: string | null;
  stock: number | null;
  title: string | null;
  body: string | null;
}

export interface Notification {
  id: string;
  kind: string;
  isRead: boolean;
  createdAt: string;
  payload: NotificationPayload;
}

export interface NotificationListResponse {
  notifications: Notification[];
}
