import type { Order as OrderDto, OrderListResponse as OrderListDto } from "@/entities/order";
import type { Order, OrderListResponse } from "@/types/order";

const toNumber = (value: string): number => Number(value) || 0;

export function mapOrder(dto: OrderDto): Order {
  return {
    id: dto.id,
    orderNumber: dto.orderNumber,
    createdAt: dto.createdAt,
    customer: {
      name: dto.customer.fullName,
      phone: dto.customer.phone,
      email: dto.customer.email ?? "",
      address: {
        province: "",
        city: dto.shippingAddress.city,
        street: dto.shippingAddress.addressLine,
        postalCode: dto.shippingAddress.postalCode ?? "",
      },
    },
    items: dto.items.map((item) => ({
      productId: item.productId,
      title: item.productName,
      variant: item.variantName ?? item.sku,
      unitPrice: toNumber(item.unitPrice),
      quantity: item.quantity,
      thumbnail: item.imageUrl ?? "",
    })),
    payment: {
      method: "unknown",
      status: dto.paymentStatus,
      paidAt: dto.paidAt ?? undefined,
    },
    fulfillment: {
      status: dto.fulfillmentStatus,
      courierName: dto.courierName ?? undefined,
      trackingCode: dto.trackingCode ?? undefined,
      dispatchedAt: dto.dispatchedAt ?? undefined,
      deliveredAt: dto.deliveredAt ?? undefined,
    },
    totalAmount: toNumber(dto.subtotal),
    discountAmount: toNumber(dto.discount),
    shippingFee: toNumber(dto.shipping),
    finalPayable: toNumber(dto.total),
  };
}

export function mapOrderList(dto: OrderListDto): OrderListResponse {
  const counts = dto.counts;
  return {
    orders: dto.orders.map(mapOrder),
    total: dto.totalCount,
    page: dto.page,
    limit: dto.limit,
    totalPages: Math.max(1, Math.ceil(dto.totalCount / dto.limit)),
    counts: { all: dto.totalCount, ...counts },
    stats: {
      totalRevenue: toNumber(dto.stats.totalSales),
      totalOrdersCount: dto.totalCount,
      pendingFulfillmentCount: counts.processing + counts.ready_to_ship,
      shippedCount: counts.shipped,
      deliveredCount: counts.delivered,
      averageOrderValue: toNumber(dto.stats.averageOrderValue),
    },
  };
}
