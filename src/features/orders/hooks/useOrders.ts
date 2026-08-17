import { useState, useEffect, useCallback, useTransition } from "react";
import type {
  Order,
  OrderFilterParams,
  OrderListResponse,
  FulfillmentStatus,
  PaymentStatus,
  UpdateFulfillmentPayload,
} from "@/types/order";
import { mockOrderService } from "../api/mockOrderService";
import useToastStore from "@/shared-app/designSystem/toast/store";

export const initialOrderFilterParams: OrderFilterParams = {
  status: "all",
  paymentStatus: "all",
  search: "",
  page: 1,
  limit: 8,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export function useOrders() {
  const [filters, setFilters] = useState<OrderFilterParams>(initialOrderFilterParams);
  const [data, setData] = useState<OrderListResponse>({
    orders: [],
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 1,
    counts: {
      all: 0,
      processing: 0,
      ready_to_ship: 0,
      shipped: 0,
      delivered: 0,
      canceled: 0,
    },
    stats: {
      totalRevenue: 0,
      totalOrdersCount: 0,
      pendingFulfillmentCount: 0,
      shippedCount: 0,
      deliveredCount: 0,
      averageOrderValue: 0,
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog and Modal state
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<Order | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const [, startTransition] = useTransition();

  // Fetch orders with current filters
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await mockOrderService.getOrders(filters);
      setData(res);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در دریافت لیست سفارش‌ها";
      setError(errMsg);
      useToastStore.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filter Actions
  const handleStatusTabChange = useCallback((status: FulfillmentStatus | "all") => {
    setFilters((prev) => ({
      ...prev,
      status,
      page: 1,
    }));
  }, []);

  const handlePaymentFilterChange = useCallback((paymentStatus: PaymentStatus | "all") => {
    setFilters((prev) => ({
      ...prev,
      paymentStatus,
      page: 1,
    }));
  }, []);

  const handleSearch = useCallback((searchTerm: string) => {
    startTransition(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchTerm,
        page: 1,
      }));
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Modal Triggers
  const handleOpenInvoice = useCallback((order: Order) => {
    setSelectedOrderForInvoice(order);
    setIsInvoiceModalOpen(true);
  }, []);

  const handleCloseInvoice = useCallback(() => {
    setIsInvoiceModalOpen(false);
    setSelectedOrderForInvoice(null);
  }, []);

  const handleOpenStatusDialog = useCallback((order: Order) => {
    setSelectedOrderForStatus(order);
    setIsStatusDialogOpen(true);
  }, []);

  const handleCloseStatusDialog = useCallback(() => {
    setIsStatusDialogOpen(false);
    setSelectedOrderForStatus(null);
  }, []);

  const handleOpenPrintModal = useCallback((order: Order) => {
    setSelectedOrderForPrint(order);
    setIsPrintModalOpen(true);
  }, []);

  const handleClosePrintModal = useCallback(() => {
    setIsPrintModalOpen(false);
    setSelectedOrderForPrint(null);
  }, []);

  // Update Fulfillment Status
  const handleUpdateFulfillment = useCallback(
    async (orderId: string, payload: UpdateFulfillmentPayload) => {
      setIsMutating(true);
      try {
        const updated = await mockOrderService.updateFulfillmentStatus(orderId, payload);
        useToastStore.success(
          `وضعیت سفارش ${updated.orderNumber} با موفقیت به «${getStatusTitle(payload.status)}» تغییر یافت.`
        );
        await fetchOrders();
        // Update current selected item if open in invoice modal
        if (selectedOrderForInvoice && selectedOrderForInvoice.id === orderId) {
          setSelectedOrderForInvoice(updated);
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "خطا در تغییر وضعیت مرسوله";
        useToastStore.error(errMsg);
      } finally {
        setIsMutating(false);
      }
    },
    [fetchOrders, selectedOrderForInvoice]
  );

  // Reset Mock Data
  const handleResetMockData = useCallback(async () => {
    setIsResetting(true);
    try {
      await mockOrderService.resetOrdersToMock();
      useToastStore.info("داده‌های ماک سفارش‌ها به ۱۵ سفارش اولیه با موفقیت بازنشانی شد.");
      setFilters(initialOrderFilterParams);
      await fetchOrders();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در بازنشانی داده‌ها";
      useToastStore.error(errMsg);
    } finally {
      setIsResetting(false);
    }
  }, [fetchOrders]);

  return {
    filters,
    data,
    isLoading,
    isMutating,
    isResetting,
    error,
    // Modals
    selectedOrderForInvoice,
    isInvoiceModalOpen,
    selectedOrderForStatus,
    isStatusDialogOpen,
    selectedOrderForPrint,
    isPrintModalOpen,
    // Actions
    handleStatusTabChange,
    handlePaymentFilterChange,
    handleSearch,
    handlePageChange,
    handleOpenInvoice,
    handleCloseInvoice,
    handleOpenStatusDialog,
    handleCloseStatusDialog,
    handleOpenPrintModal,
    handleClosePrintModal,
    handleUpdateFulfillment,
    handleResetMockData,
    fetchOrders,
  };
}

function getStatusTitle(status: FulfillmentStatus): string {
  switch (status) {
    case "processing":
      return "در حال پردازش";
    case "ready_to_ship":
      return "آماده ارسال";
    case "shipped":
      return "ارسال شده";
    case "delivered":
      return "تحویل شده";
    case "canceled":
      return "لغو شده";
    default:
      return status;
  }
}

export default useOrders;
