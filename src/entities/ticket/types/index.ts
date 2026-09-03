export type TicketStatus =
  | "open"
  | "in_progress"
  | "waiting_customer"
  | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface TicketActivity {
  kind: string;
  at: string;
}

export interface TicketMessage {
  id: string;
  senderKind: string;
  body: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  customerId: string | null;
  subject: string;
  customerName: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  activity: TicketActivity[];
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketListParams {
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TicketListResponse {
  tickets: Ticket[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface AddTicketMessageInput {
  body: string;
}

export interface SetTicketStatusInput {
  status: TicketStatus;
}

export interface SetTicketPriorityInput {
  priority: TicketPriority;
}
