import { useEffect, useState, useTransition } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerApi, type CustomerListParams } from "@/entities/customer";
import type { Customer, CustomerFilterParams, CustomerListResponse, CustomerStatus, CustomerTier } from "../types";
import useToastStore from "@/shared-app/designSystem/toast/store";
import { ApiError } from "@/config/api";
import { mapCustomer, mapCustomerList } from "../models/customerMapper";

export const initialCustomerFilterParams: CustomerFilterParams = { search: "", tier: "all", status: "all", page: 1, limit: 8, sortBy: "totalSpent", sortOrder: "desc" };
const emptyData: CustomerListResponse = { customers: [], total: 0, page: 1, limit: 8, totalPages: 1, counts: { all: 0, vip: 0, gold: 0, silver: 0, bronze: 0, active: 0, blocked: 0 }, stats: { totalCustomers: 0, vipCount: 0, totalSpentSum: 0, averageCustomerValue: 0 } };

const toParams = (filters: CustomerFilterParams): CustomerListParams => ({
  search: filters.search?.trim() || undefined,
  tier: filters.tier === "all" ? undefined : filters.tier,
  status: filters.status === "all" ? undefined : filters.status,
  page: filters.page,
  limit: filters.limit,
  sortBy: filters.sortBy === "name" ? "createdAt" : filters.sortBy,
  sortOrder: filters.sortOrder,
});

export function useCustomers() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState(initialCustomerFilterParams);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [, startTransition] = useTransition();
  const listQuery = useQuery({ queryKey: ["customers", "list", filters], queryFn: ({ signal }) => customerApi.list(toParams(filters), signal), select: mapCustomerList });
  const detailQuery = useQuery({
    queryKey: ["customers", "detail", selectedCustomer?.id],
    queryFn: ({ signal }) => customerApi.get(selectedCustomer!.id, { includeOrders: true, includeTickets: true }, signal),
    enabled: isDetailModalOpen && Boolean(selectedCustomer),
  });
  useEffect(() => {
    if (!(detailQuery.error instanceof ApiError) || detailQuery.error.code !== "resource_not_found") return;
    setIsDetailModalOpen(false);
    setSelectedCustomer(null);
    void queryClient.invalidateQueries({ queryKey: ["customers", "list"] });
  }, [detailQuery.error, queryClient]);
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["customers"] });
  const toggleMutation = useMutation({ mutationFn: (id: string) => customerApi.toggleStatus(id), retry: false, onSuccess: async (dto) => { setSelectedCustomer(mapCustomer(dto)); await invalidate(); useToastStore.success("وضعیت مشتری تغییر کرد."); } });
  const tierMutation = useMutation({ mutationFn: ({ id, tier }: { id: string; tier: CustomerTier }) => customerApi.setTier(id, { tier }), retry: false, onSuccess: async (dto) => { setSelectedCustomer(mapCustomer(dto)); await invalidate(); useToastStore.success("سطح وفاداری مشتری تغییر کرد."); } });
  const run = async (promise: Promise<unknown>) => { try { await promise; } catch (error) { useToastStore.error(error instanceof Error ? error.message : "خطا در مدیریت مشتری"); } };
  return {
    filters, data: listQuery.data ?? emptyData, isLoading: listQuery.isLoading,
    isMutating: toggleMutation.isPending || tierMutation.isPending,
    error: listQuery.error instanceof Error ? listQuery.error.message : detailQuery.error instanceof Error ? detailQuery.error.message : null,
    selectedCustomer: detailQuery.data ? mapCustomer(detailQuery.data) : selectedCustomer,
    isDetailModalOpen,
    handleTierTabChange: (tier: CustomerTier | "all") => setFilters((p) => ({ ...p, tier, page: 1 })),
    handleStatusFilterChange: (status: CustomerStatus | "all") => setFilters((p) => ({ ...p, status, page: 1 })),
    handleSearch: (search: string) => startTransition(() => setFilters((p) => ({ ...p, search, page: 1 }))),
    handlePageChange: (page: number) => { setFilters((p) => ({ ...p, page })); window.scrollTo({ top: 0, behavior: "smooth" }); },
    handleOpenDetailModal: (customer: Customer) => { setSelectedCustomer(customer); setIsDetailModalOpen(true); },
    handleCloseDetailModal: () => { setIsDetailModalOpen(false); setSelectedCustomer(null); },
    handleToggleCustomerStatus: (id: string) => run(toggleMutation.mutateAsync(id)),
    handleUpdateTier: (id: string, tier: CustomerTier) => run(tierMutation.mutateAsync({ id, tier })),
    fetchCustomers: listQuery.refetch,
  };
}
export default useCustomers;
