export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export type FulfillmentStatus =
  | "processing"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "canceled";

export type PaymentMethod = "online" | "cash_on_delivery" | "card_to_card";

export interface OrderItem {
  productId: string;
  title: string;
  variant: string; // e.g., "رنگ: مشکی مات، گارانتی: ۱۸ ماهه"
  unitPrice: number;
  quantity: number;
  thumbnail: string;
}

export interface CustomerAddress {
  province: string;
  city: string;
  street: string;
  postalCode: string;
  plaque?: string;
  unit?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: CustomerAddress;
}

export interface OrderPayment {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: string;
  gateway?: string;
}

export interface OrderFulfillment {
  status: FulfillmentStatus;
  courierName?: string;
  trackingCode?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  notes?: string;
  estimatedDelivery?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g., "ORD-9482"
  createdAt: string;
  updatedAt?: string;
  customer: CustomerInfo;
  items: OrderItem[];
  payment: OrderPayment;
  fulfillment: OrderFulfillment;
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  finalPayable: number;
}

export interface OrderFilterParams {
  status?: FulfillmentStatus | "all";
  paymentStatus?: PaymentStatus | "all";
  search?: string;
  dateRange?: {
    from?: string;
    to?: string;
  };
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "finalPayable" | "orderNumber";
  sortOrder?: "asc" | "desc";
}

export interface OrderCounts {
  all: number;
  processing: number;
  ready_to_ship: number;
  shipped: number;
  delivered: number;
  canceled: number;
}

export interface OrderStats {
  totalRevenue: number;
  totalOrdersCount: number;
  pendingFulfillmentCount: number;
  shippedCount: number;
  deliveredCount: number;
  averageOrderValue: number;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  counts: OrderCounts;
  stats: OrderStats;
}

export interface UpdateFulfillmentPayload {
  status: FulfillmentStatus;
  courierName?: string;
  trackingCode?: string;
  notes?: string;
}

export interface CourierOption {
  id: string;
  name: string;
  trackingUrlPattern?: string;
  logoColor?: string;
}
