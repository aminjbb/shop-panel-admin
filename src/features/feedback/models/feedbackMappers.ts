import type { Notification as NotificationDto } from "@/entities/notification";
import type { Review as ReviewDto, ReviewListResponse as ReviewListDto } from "@/entities/review";
import type { Ticket as TicketDto, TicketListResponse as TicketListDto } from "@/entities/ticket";
import type { AdminNotification, ProductReview, ReviewListResponse, SupportTicket, TicketListResponse } from "../types";

export const mapReview = (dto: ReviewDto): ProductReview => ({
  id: dto.id,
  productId: dto.productId ?? "",
  productTitle: dto.productId ?? "—",
  productThumbnail: "",
  customerName: dto.customerName,
  rating: dto.rating,
  comment: dto.body,
  adminReply: dto.adminReply ?? undefined,
  adminRepliedAt: dto.repliedAt ?? undefined,
  status: dto.status,
  createdAt: dto.createdAt,
});

export function mapReviewList(dto: ReviewListDto): ReviewListResponse {
  const items = dto.reviews.map(mapReview);
  const counts = items.reduce((value, item) => { value[item.status] += 1; return value; }, { pending: 0, approved: 0, rejected: 0 });
  return {
    items, total: dto.totalCount, page: dto.page, limit: dto.limit,
    totalPages: Math.max(1, Math.ceil(dto.totalCount / dto.limit)),
    counts: { all: dto.totalCount, ...counts, averageRating: items.length ? Number((items.reduce((sum, item) => sum + item.rating, 0) / items.length).toFixed(1)) : 0 },
  };
}

export const mapTicket = (dto: TicketDto): SupportTicket => ({
  id: dto.id,
  ticketNumber: dto.id,
  customerName: dto.customerName ?? "—",
  customerPhone: "",
  subject: dto.subject,
  priority: dto.priority,
  status: dto.status,
  messages: dto.messages.map((message) => ({
    id: message.id,
    sender: message.senderKind === "admin" ? "support" : "customer",
    senderName: message.senderKind === "admin" ? "پشتیبانی" : dto.customerName ?? "مشتری",
    message: message.body,
    sentAt: message.createdAt,
  })),
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

export function mapTicketList(dto: TicketListDto): TicketListResponse {
  const items = dto.tickets.map(mapTicket);
  const counts = items.reduce((value, item) => {
    value[item.status] += 1;
    if (item.priority === "urgent") value.urgent += 1;
    return value;
  }, { open: 0, in_progress: 0, waiting_customer: 0, closed: 0, urgent: 0 });
  return { items, total: dto.totalCount, page: dto.page, limit: dto.limit, totalPages: Math.max(1, Math.ceil(dto.totalCount / dto.limit)), counts: { all: dto.totalCount, ...counts } };
}

const routeByKind: Record<string, string> = { order: "orders", low_stock: "products", review: "feedback", ticket: "support" };
export const mapNotification = (dto: NotificationDto): AdminNotification => ({
  id: dto.id,
  type: dto.kind,
  title: dto.payload.title ?? dto.kind,
  message: dto.payload.body ?? "",
  isRead: dto.isRead,
  targetUrl: routeByKind[dto.kind] ?? "dashboard",
  createdAt: dto.createdAt,
});
