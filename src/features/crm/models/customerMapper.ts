import type { Customer as CustomerDto, CustomerDetail, CustomerListResponse as CustomerListDto } from "@/entities/customer";
import type { Customer, CustomerListResponse } from "../types";

export function mapCustomer(dto: CustomerDto | CustomerDetail): Customer {
  return {
    id: dto.id,
    name: dto.fullName,
    phone: dto.mobile,
    email: dto.email ?? "",
    totalOrders: dto.totalOrders,
    totalSpent: Number(dto.totalSpent) || 0,
    lastOrderDate: dto.lastOrderDate ?? "",
    tier: dto.tier,
    status: dto.status,
    createdAt: dto.createdAt,
  };
}

export function mapCustomerList(dto: CustomerListDto): CustomerListResponse {
  const customers = dto.customers.map(mapCustomer);
  const tierCounts = customers.reduce((counts, customer) => {
    counts[customer.tier] += 1;
    return counts;
  }, { vip: 0, gold: 0, silver: 0, bronze: 0 });
  return {
    customers,
    total: dto.totalCount,
    page: dto.page,
    limit: dto.limit,
    totalPages: Math.max(1, Math.ceil(dto.totalCount / dto.limit)),
    counts: { all: dto.stats.totalCustomers, ...tierCounts, ...dto.counts },
    stats: {
      totalCustomers: dto.stats.totalCustomers,
      vipCount: tierCounts.vip,
      totalSpentSum: Number(dto.stats.totalSpent) || 0,
      averageCustomerValue: dto.stats.totalCustomers ? (Number(dto.stats.totalSpent) || 0) / dto.stats.totalCustomers : 0,
    },
  };
}
