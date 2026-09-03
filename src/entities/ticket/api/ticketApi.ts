import { apiRequest } from "@/config/api";
import type {
  AddTicketMessageInput,
  SetTicketPriorityInput,
  SetTicketStatusInput,
  Ticket,
  TicketListParams,
  TicketListResponse,
} from "../types";

export const ticketApi = {
  list(
    params: TicketListParams = {},
    signal?: AbortSignal,
  ): Promise<TicketListResponse> {
    return apiRequest({ path: "/tickets", query: { ...params }, signal });
  },

  get(ticketId: string, signal?: AbortSignal): Promise<Ticket> {
    return apiRequest({
      path: `/tickets/${encodeURIComponent(ticketId)}`,
      signal,
    });
  },

  addMessage(
    ticketId: string,
    body: AddTicketMessageInput,
    signal?: AbortSignal,
  ): Promise<Ticket> {
    return apiRequest({
      path: `/tickets/${encodeURIComponent(ticketId)}/messages`,
      method: "POST",
      body,
      signal,
    });
  },

  setStatus(
    ticketId: string,
    body: SetTicketStatusInput,
    signal?: AbortSignal,
  ): Promise<Ticket> {
    return apiRequest({
      path: `/tickets/${encodeURIComponent(ticketId)}/status`,
      method: "PATCH",
      body,
      signal,
    });
  },

  setPriority(
    ticketId: string,
    body: SetTicketPriorityInput,
    signal?: AbortSignal,
  ): Promise<Ticket> {
    return apiRequest({
      path: `/tickets/${encodeURIComponent(ticketId)}/priority`,
      method: "PATCH",
      body,
      signal,
    });
  },
};
