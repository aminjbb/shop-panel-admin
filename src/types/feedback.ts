export type ReviewStatus = "pending" | "approved" | "rejected";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketStatus = "open" | "in_progress" | "waiting_customer" | "closed";
export type NotificationType = "order" | "low_stock" | "review" | "ticket";

export interface ProductReview {
  id: string;
  productId: string;
  productTitle: string;
  productThumbnail: string;
  customerName: string;
  customerAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  adminReply?: string;
  adminRepliedAt?: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface SupportTicketMessage {
  id: string;
  sender: "customer" | "support";
  senderName: string;
  message: string;
  sentAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string; // e.g., "TCK-4081"
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  relatedOrderId?: string;
  messages: SupportTicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  targetUrl: string;
  createdAt: string;
}

export interface ReviewFilterParams {
  status?: ReviewStatus | "all";
  rating?: number | "all";
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "newest" | "oldest" | "highest_rating" | "lowest_rating";
}

export interface ReviewListResponse {
  items: ProductReview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  counts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
    averageRating: number;
  };
}

export interface TicketFilterParams {
  status?: TicketStatus | "all";
  priority?: TicketPriority | "all";
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "newest" | "oldest" | "urgent_first";
}

export interface TicketListResponse {
  items: SupportTicket[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  counts: {
    all: number;
    open: number;
    in_progress: number;
    waiting_customer: number;
    closed: number;
    urgent: number;
  };
}
