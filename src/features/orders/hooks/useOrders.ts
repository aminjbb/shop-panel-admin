import { useCallback, useState, useTransition } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi, type OrderListParams } from "@/entities/order";
import type { FulfillmentStatus, Order, OrderFilterParams, OrderListResponse, PaymentStatus, UpdateFulfillmentPayload } from "@/types/order";
import useToastStore from "@/shared-app/designSystem/toast/store";
import { mapOrder, mapOrderList } from "../models/orderMapper";

export const initialOrderFilterParams: OrderFilterParams = {
  status: "all", paymentStatus: "all", search: "", page: 1, limit: 8, sortBy: "createdAt", sortOrder: "desc",
};

const emptyData: OrderListResponse = {
  orders: [], total: 0, page: 1, limit: 8, totalPages: 1,
  counts: { all: 0, processing: 0, ready_to_ship: 0, shipped: 0, delivered: 0, canceled: 0 },
  stats: { totalRevenue: 0, totalOrdersCount: 0, pendingFulfillmentCount: 0, shippedCount: 0, deliveredCount: 0, averageOrderValue: 0 },
};

function toApiParams(filters: OrderFilterParams): OrderListParams {
  return {
    status: filters.status === "all" ? undefined : filters.status,
    paymentStatus: filters.paymentStatus === "all" ? undefined : filters.paymentStatus,
    search: filters.search?.trim() || undefined,
    dateFrom: filters.dateRange?.from,
    dateTo: filters.dateRange?.to,
    page: filters.page,
    limit: filters.limit,
    sortBy: filters.sortBy === "finalPayable" ? "total" : filters.sortBy,
    sortOrder: filters.sortOrder,
  };
}

export function useOrders() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState(initialOrderFilterParams);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<Order | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [, startTransition] = useTransition();

  const listQuery = useQuery({
    queryKey: ["orders", "list", filters],
    queryFn: ({ signal }) => orderApi.list(toApiParams(filters), signal),
    select: mapOrderList,
  });

  const fulfillmentMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFulfillmentPayload }) =>
      orderApi.updateFulfillment(id, {
        status: payload.status,
        courierName: payload.courierName ?? null,
        trackingCode: payload.trackingCode ?? null,
      }),
    onSuccess: async (dto) => {
      const updated = mapOrder(dto);
      setSelectedOrderForInvoice((current) => current?.id === updated.id ? updated : current);
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      useToastStore.success(`وضعیت سفارش ${updated.orderNumber} با موفقیت تغییر یافت.`);
    },
    onError: (error) => useToastStore.error(error instanceof Error ? error.message : "خطا در تغییر وضعیت مرسوله"),
  });

  const loadDetail = useCallback(async (order: Order) => {
    try { return mapOrder(await orderApi.get(order.id)); }
    catch { return order; }
  }, []);

  const handleOpenInvoice = useCallback(async (order: Order) => {
    setSelectedOrderForInvoice(order); setIsInvoiceModalOpen(true);
    try { setSelectedOrderForInvoice(mapOrder((await orderApi.invoice(order.id)).order)); } catch { /* list data remains usable */ }
  }, []);
  const handleOpenStatusDialog = useCallback(async (order: Order) => {
    setSelectedOrderForStatus(order); setIsStatusDialogOpen(true);
    setSelectedOrderForStatus(await loadDetail(order));
  }, [loadDetail]);
  const handleOpenPrintModal = useCallback(async (order: Order) => {
    setSelectedOrderForPrint(order); setIsPrintModalOpen(true);
    try { setSelectedOrderForPrint(mapOrder((await orderApi.invoice(order.id)).order)); } catch { /* list data remains usable */ }
  }, []);

  return {
    filters,
    data: listQuery.data ?? emptyData,
    isLoading: listQuery.isLoading,
    isMutating: fulfillmentMutation.isPending,
    error: listQuery.error instanceof Error ? listQuery.error.message : null,
    selectedOrderForInvoice, isInvoiceModalOpen, selectedOrderForStatus, isStatusDialogOpen,
    selectedOrderForPrint, isPrintModalOpen,
    handleStatusTabChange: (status: FulfillmentStatus | "all") => setFilters((p) => ({ ...p, status, page: 1 })),
    handlePaymentFilterChange: (paymentStatus: PaymentStatus | "all") => setFilters((p) => ({ ...p, paymentStatus, page: 1 })),
    handleSearch: (search: string) => startTransition(() => setFilters((p) => ({ ...p, search, page: 1 }))),
    handlePageChange: (page: number) => { setFilters((p) => ({ ...p, page })); window.scrollTo({ top: 0, behavior: "smooth" }); },
    handleOpenInvoice,
    handleCloseInvoice: () => { setIsInvoiceModalOpen(false); setSelectedOrderForInvoice(null); },
    handleOpenStatusDialog,
    handleCloseStatusDialog: () => { setIsStatusDialogOpen(false); setSelectedOrderForStatus(null); },
    handleOpenPrintModal,
    handleClosePrintModal: () => { setIsPrintModalOpen(false); setSelectedOrderForPrint(null); },
    handleUpdateFulfillment: async (id: string, payload: UpdateFulfillmentPayload) => { await fulfillmentMutation.mutateAsync({ id, payload }); },
    fetchOrders: listQuery.refetch,
  };
}

export default useOrders;
