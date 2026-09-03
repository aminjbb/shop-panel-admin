export type CustomerTier = "bronze" | "silver" | "gold" | "vip";
export type CustomerStatus = "active" | "blocked";
export type SortOrder = "asc" | "desc";
export type CustomerSortField =
  | "createdAt"
  | "totalOrders"
  | "totalSpent"
  | "lastOrderDate"
  | (string & {});

export interface Customer {
  id: string;
  fullName: string;
  mobile: string;
  email: string | null;
  tier: CustomerTier;
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: string;
  lastOrderDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerOrderSummary {
  id: string;
  orderNumber: string;
  total: string;
  createdAt: string;
  fulfillmentStatus: string;
}

export interface CustomerTicketSummary {
  id: string;
  subject: string;
  status: "open" | "in_progress" | "waiting_customer" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
}

export interface CustomerDetail extends Customer {
  orders: CustomerOrderSummary[] | null;
  tickets: CustomerTicketSummary[] | null;
}

export interface CustomerListParams {
  search?: string;
  tier?: CustomerTier;
  status?: CustomerStatus;
  page?: number;
  limit?: number;
  sortBy?: CustomerSortField;
  sortOrder?: SortOrder;
}

export interface CustomerCounts {
  active: number;
  blocked: number;
}

export interface CustomerStats {
  totalCustomers: number;
  totalOrders: number;
  totalSpent: string;
}

export interface CustomerListResponse {
  customers: Customer[];
  totalCount: number;
  page: number;
  limit: number;
  counts: CustomerCounts;
  stats: CustomerStats;
}

export interface CustomerDetailParams {
  includeOrders?: boolean;
  includeTickets?: boolean;
}

export interface SetCustomerTierInput {
  tier: CustomerTier;
}
