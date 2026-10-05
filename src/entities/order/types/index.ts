export type FulfillmentStatus =
  | "processing"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "canceled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderSortField = "createdAt" | "orderNumber" | "total" | "paidAmount";
export type SortOrder = "asc" | "desc";

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email: string | null;
}

export interface OrderShippingAddress {
  recipientName: string;
  phone: string;
  city: string;
  addressLine: string;
  postalCode: string | null;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantName: string | null;
  sku: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  imageUrl: string | null;
}

export interface OrderHistoryEntry {
  from: FulfillmentStatus;
  to: FulfillmentStatus;
  at: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  fulfillmentStatus: FulfillmentStatus;
  paymentStatus: PaymentStatus;
  customer: OrderCustomer;
  shippingAddress: OrderShippingAddress;
  items: OrderItem[];
  subtotal: string;
  discount: string;
  shipping: string;
  tax: string;
  paidAmount: string;
  total: string;
  courierName: string | null;
  trackingCode: string | null;
  dispatchedAt: string | null;
  deliveredAt: string | null;
  paidAt: string | null;
  history: OrderHistoryEntry[];
  createdAt: string;
}

export interface OrderCounts {
  processing: number;
  ready_to_ship: number;
  shipped: number;
  delivered: number;
  canceled: number;
}

export interface OrderStats {
  totalSales: string;
  paidAmount: string;
  averageOrderValue: string;
}

export interface OrderListParams {
  status?: FulfillmentStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: OrderSortField;
  sortOrder?: SortOrder;
}

export interface OrderListResponse {
  orders: Order[];
  totalCount: number;
  page: number;
  limit: number;
  counts: OrderCounts;
  stats: OrderStats;
}

export interface UpdateFulfillmentInput {
  status: FulfillmentStatus;
  courierName?: string | null;
  trackingCode?: string | null;
}

export interface UpdatePaymentInput {
  status: PaymentStatus;
  paidAmount?: string | number | null;
}

export interface OrderInvoice<TStoreSettings = unknown> {
  store: TStoreSettings;
  order: Order;
}
