export type CustomerTier = "bronze" | "silver" | "gold" | "vip";
export type CustomerStatus = "active" | "blocked";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  tier: CustomerTier;
  status: CustomerStatus;
  createdAt: string;
  city?: string;
  notes?: string;
}

export interface CustomerFilterParams {
  search?: string;
  tier?: CustomerTier | "all";
  status?: CustomerStatus | "all";
  page?: number;
  limit?: number;
  sortBy?: "totalSpent" | "totalOrders" | "createdAt" | "name";
  sortOrder?: "asc" | "desc";
}

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  counts: { all: number; vip: number; gold: number; silver: number; bronze: number; active: number; blocked: number };
  stats: { totalCustomers: number; vipCount: number; totalSpentSum: number; averageCustomerValue: number };
}
