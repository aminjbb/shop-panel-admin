import { useState, useEffect, useCallback } from "react";
import type {
  SupportTicket,
  TicketStatus,
  TicketPriority,
  TicketFilterParams,
  TicketListResponse,
} from "@/types/feedback";
import mockFeedbackService from "../api/mockFeedbackService";
import { useToastStore } from "@/shared-app/designSystem/toast/store";

export const useTickets = (initialParams: TicketFilterParams = {}) => {
  const [params, setParams] = useState<TicketFilterParams>({
    status: "all",
    priority: "all",
    search: "",
    page: 1,
    limit: 6,
    sortBy: "newest",
    ...initialParams,
  });

  const [data, setData] = useState<TicketListResponse>({
    items: [],
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
    counts: {
      all: 0,
      open: 0,
      in_progress: 0,
      waiting_customer: 0,
      closed: 0,
      urgent: 0,
    },
  });

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await mockFeedbackService.getTickets(params);
      setData(res);

      // Keep selected ticket refreshed
      if (selectedTicketId) {
        const found = res.items.find((t) => t.id === selectedTicketId);
        if (found) {
          setSelectedTicket(found);
        } else {
          try {
            const single = await mockFeedbackService.getTicketById(selectedTicketId);
            setSelectedTicket(single);
          } catch {
            // Not found
          }
        }
      }
    } catch (err: any) {
      setError(err?.message || "خطا در دریافت لیست تیکت‌های پشتیبانی");
    } finally {
      setIsLoading(false);
    }
  }, [params, selectedTicketId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const selectTicket = async (ticket: SupportTicket | string | null) => {
    if (!ticket) {
      setSelectedTicketId(null);
      setSelectedTicket(null);
      return;
    }

    if (typeof ticket === "string") {
      setSelectedTicketId(ticket);
      try {
        const single = await mockFeedbackService.getTicketById(ticket);
        setSelectedTicket(single);
      } catch (err: any) {
        useToastStore.error(err?.message || "تیکت یافت نشد.");
      }
    } else {
      setSelectedTicketId(ticket.id);
      setSelectedTicket(ticket);
    }
  };

  const sendMessage = async (message: string) => {
    if (!selectedTicketId || !message.trim()) return;
    setIsSendingMessage(true);
    try {
      const updated = await mockFeedbackService.sendTicketReply(
        selectedTicketId,
        message,
        "support",
        "پشتیبانی دینووا"
      );
      setSelectedTicket(updated);
      await fetchTickets();
      return updated;
    } catch (err: any) {
      useToastStore.error(err?.message || "خطا در ارسال پیام به مشتری.");
      throw err;
    } finally {
      setIsSendingMessage(false);
    }
  };

  const updateStatus = useCallback(async (id: string, status: TicketStatus) => {
    setIsUpdating(true);
    try {
      const updated = await mockFeedbackService.updateTicketStatus(id, status);
      const statusLabels: Record<TicketStatus, string> = {
        open: "باز",
        in_progress: "در حال بررسی",
        waiting_customer: "در انتظار پاسخ مشتری",
        closed: "بسته شد",
      };
      useToastStore.success(`وضعیت تیکت ${updated.ticketNumber} به «${statusLabels[status]}» تغییر یافت.`, {
        title: "بروزرسانی وضعیت تیکت",
      });
      if (selectedTicketId === id) {
        setSelectedTicket(updated);
      }
      await fetchTickets();
      return updated;
    } catch (err: any) {
      useToastStore.error(err?.message || "خطا در بروزرسانی وضعیت تیکت.");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [fetchTickets, selectedTicketId]);

  const updatePriority = useCallback(async (id: string, priority: TicketPriority) => {
    setIsUpdating(true);
    try {
      const updated = await mockFeedbackService.updateTicketPriority(id, priority);
      const priorityLabels: Record<TicketPriority, string> = {
        urgent: "فوری / اضطراری",
        high: "بالا",
        medium: "متوسط",
        low: "کم",
      };
      useToastStore.info(`اولویت تیکت ${updated.ticketNumber} به «${priorityLabels[priority]}» تنظیم شد.`, {
        title: "بروزرسانی اولویت",
      });
      if (selectedTicketId === id) {
        setSelectedTicket(updated);
      }
      await fetchTickets();
      return updated;
    } catch (err: any) {
      useToastStore.error(err?.message || "خطا در تنظیم اولویت.");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [fetchTickets, selectedTicketId]);

  const setPage = useCallback((page: number) => {
    setParams((prev) => {
      if (prev.page === page) return prev;
      return { ...prev, page };
    });
  }, []);

  const setStatusFilter = useCallback((status: TicketStatus | "all") => {
    setParams((prev) => {
      if (prev.status === status && prev.page === 1) return prev;
      return { ...prev, status, page: 1 };
    });
  }, []);

  const setPriorityFilter = useCallback((priority: TicketPriority | "all") => {
    setParams((prev) => {
      if (prev.priority === priority && prev.page === 1) return prev;
      return { ...prev, priority, page: 1 };
    });
  }, []);

  const setSearch = useCallback((search: string) => {
    setParams((prev) => {
      if ((prev.search || "") === (search || "") && prev.page === 1) return prev;
      return { ...prev, search, page: 1 };
    });
  }, []);

  const setSortBy = useCallback((sortBy: TicketFilterParams["sortBy"]) => {
    setParams((prev) => {
      if (prev.sortBy === sortBy && prev.page === 1) return prev;
      return { ...prev, sortBy, page: 1 };
    });
  }, []);

  return {
    tickets: data.items,
    total: data.total,
    page: data.page,
    totalPages: data.totalPages,
    counts: data.counts,
    selectedTicket,
    selectedTicketId,
    isLoading,
    isUpdating,
    isSendingMessage,
    error,
    params,
    refetch: fetchTickets,
    selectTicket,
    sendMessage,
    updateStatus,
    updatePriority,
    setPage,
    setStatusFilter,
    setPriorityFilter,
    setSearch,
    setSortBy,
  };
};

export default useTickets;
