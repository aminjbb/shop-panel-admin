import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ticketApi } from "@/entities/ticket";
import type { SupportTicket, TicketFilterParams, TicketPriority, TicketStatus } from "../types";
import { useToastStore } from "@/shared-app/designSystem/toast/store";
import { mapTicket, mapTicketList } from "../models/feedbackMappers";
import { ApiError } from "@/config/api";

export const useTickets = (initialParams: TicketFilterParams = {}) => {
  const client = useQueryClient();
  const [params, setParams] = useState<TicketFilterParams>({ status: "all", priority: "all", search: "", page: 1, limit: 6, ...initialParams });
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const listQuery = useQuery({ queryKey: ["tickets", "list", params], queryFn: ({ signal }) => ticketApi.list({ status: params.status === "all" ? undefined : params.status, priority: params.priority === "all" ? undefined : params.priority, search: params.search?.trim() || undefined, page: params.page, limit: params.limit }, signal), select: mapTicketList });
  const detailQuery = useQuery({ queryKey: ["tickets", "detail", selectedTicketId], queryFn: ({ signal }) => ticketApi.get(selectedTicketId!, signal), enabled: Boolean(selectedTicketId) });
  useEffect(() => {
    if (!(detailQuery.error instanceof ApiError) || detailQuery.error.code !== "resource_not_found") return;
    setSelectedTicketId(null);
    void client.invalidateQueries({ queryKey: ["tickets", "list"] });
  }, [client, detailQuery.error]);
  const invalidate = async () => { await client.invalidateQueries({ queryKey: ["tickets"] }); };
  const messageMutation = useMutation({ mutationFn: ({ id, body }: { id: string; body: string }) => ticketApi.addMessage(id, { body }), retry: false, onSuccess: invalidate });
  const statusMutation = useMutation({ mutationFn: ({ id, status }: { id: string; status: TicketStatus }) => ticketApi.setStatus(id, { status }), retry: false, onSuccess: invalidate });
  const priorityMutation = useMutation({ mutationFn: ({ id, priority }: { id: string; priority: TicketPriority }) => ticketApi.setPriority(id, { priority }), retry: false, onSuccess: invalidate });
  const execute = async <T,>(promise: Promise<T>, message: string) => { try { const result = await promise; useToastStore.success(message); return result; } catch (error) { useToastStore.error(error instanceof Error ? error.message : "خطا در مدیریت تیکت"); throw error; } };
  const data = listQuery.data;
  const selectedTicket = detailQuery.data ? mapTicket(detailQuery.data) : data?.items.find((item) => item.id === selectedTicketId) ?? null;
  return {
    tickets: data?.items ?? [], total: data?.total ?? 0, page: data?.page ?? 1, totalPages: data?.totalPages ?? 1,
    counts: data?.counts ?? { all: 0, open: 0, in_progress: 0, waiting_customer: 0, closed: 0, urgent: 0 },
    selectedTicket, selectedTicketId, isLoading: listQuery.isLoading,
    isUpdating: statusMutation.isPending || priorityMutation.isPending, isSendingMessage: messageMutation.isPending,
    error: listQuery.error instanceof Error ? listQuery.error.message : detailQuery.error instanceof Error ? detailQuery.error.message : null,
    params, refetch: listQuery.refetch,
    selectTicket: (ticket: SupportTicket | string | null) => setSelectedTicketId(typeof ticket === "string" ? ticket : ticket?.id ?? null),
    sendMessage: async (body: string) => selectedTicketId && body.trim() ? execute(messageMutation.mutateAsync({ id: selectedTicketId, body: body.trim() }).then(mapTicket), "پاسخ تیکت ارسال شد.") : undefined,
    updateStatus: (id: string, status: TicketStatus) => execute(statusMutation.mutateAsync({ id, status }).then(mapTicket), "وضعیت تیکت تغییر کرد."),
    updatePriority: (id: string, priority: TicketPriority) => execute(priorityMutation.mutateAsync({ id, priority }).then(mapTicket), "اولویت تیکت تغییر کرد."),
    setPage: (page: number) => setParams((p) => ({ ...p, page })),
    setStatusFilter: (status: TicketStatus | "all") => setParams((p) => ({ ...p, status, page: 1 })),
    setPriorityFilter: (priority: TicketPriority | "all") => setParams((p) => ({ ...p, priority, page: 1 })),
    setSearch: (search: string) => setParams((p) => ({ ...p, search, page: 1 })),
  };
};
export default useTickets;
