import { useState, useEffect, useCallback, useTransition } from "react";
import type {
  Customer,
  CustomerFilterParams,
  CustomerListResponse,
  CustomerTier,
  CustomerStatus,
} from "@/types/crm";
import { mockCrmService } from "../api/mockCrmService";
import useToastStore from "@/shared-app/designSystem/toast/store";

export const initialCustomerFilterParams: CustomerFilterParams = {
  search: "",
  tier: "all",
  status: "all",
  page: 1,
  limit: 8,
  sortBy: "totalSpent",
  sortOrder: "desc",
};

export function useCustomers() {
  const [filters, setFilters] = useState<CustomerFilterParams>(initialCustomerFilterParams);
  const [data, setData] = useState<CustomerListResponse>({
    customers: [],
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 1,
    counts: {
      all: 0,
      vip: 0,
      gold: 0,
      silver: 0,
      bronze: 0,
      active: 0,
      blocked: 0,
    },
    stats: {
      totalCustomers: 0,
      vipCount: 0,
      totalSpentSum: 0,
      averageCustomerValue: 0,
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const [, startTransition] = useTransition();

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await mockCrmService.getCustomers(filters);
      setData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطا در دریافت لیست مشتریان";
      useToastStore.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleTierTabChange = useCallback((tier: CustomerTier | "all") => {
    setFilters((prev) => ({ ...prev, tier, page: 1 }));
  }, []);

  const handleStatusFilterChange = useCallback((status: CustomerStatus | "all") => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, search, page: 1 }));
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleOpenDetailModal = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedCustomer(null);
  }, []);

  const handleToggleCustomerStatus = useCallback(
    async (customerId: string) => {
      setIsMutating(true);
      try {
        const updated = await mockCrmService.toggleCustomerStatus(customerId);
        useToastStore.success(
          `وضعیت دسترسی ${updated.name} به «${
            updated.status === "active" ? "فعال" : "مسدود شده"
          }» تغییر یافت.`
        );
        await fetchCustomers();
        if (selectedCustomer && selectedCustomer.id === customerId) {
          setSelectedCustomer(updated);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "خطا در تغییر وضعیت دسترسی";
        useToastStore.error(msg);
      } finally {
        setIsMutating(false);
      }
    },
    [fetchCustomers, selectedCustomer]
  );

  const handleUpdateTier = useCallback(
    async (customerId: string, tier: CustomerTier) => {
      setIsMutating(true);
      try {
        const updated = await mockCrmService.updateCustomerTier(customerId, tier);
        useToastStore.success(`سطح وفاداری ${updated.name} به ${tier.toUpperCase()} ارتقا یافت.`);
        await fetchCustomers();
        if (selectedCustomer && selectedCustomer.id === customerId) {
          setSelectedCustomer(updated);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "خطا در ارتقای سطح مشتری";
        useToastStore.error(msg);
      } finally {
        setIsMutating(false);
      }
    },
    [fetchCustomers, selectedCustomer]
  );

  const handleResetMockData = useCallback(async () => {
    setIsLoading(true);
    try {
      await mockCrmService.resetCustomersToMock();
      useToastStore.info("داده‌های ماک باشگاه مشتریان با موفقیت بازنشانی شد.");
      setFilters(initialCustomerFilterParams);
      await fetchCustomers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطا در بازنشانی داده‌ها";
      useToastStore.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [fetchCustomers]);

  return {
    filters,
    data,
    isLoading,
    isMutating,
    selectedCustomer,
    isDetailModalOpen,
    handleTierTabChange,
    handleStatusFilterChange,
    handleSearch,
    handlePageChange,
    handleOpenDetailModal,
    handleCloseDetailModal,
    handleToggleCustomerStatus,
    handleUpdateTier,
    handleResetMockData,
    fetchCustomers,
  };
}

export default useCustomers;
