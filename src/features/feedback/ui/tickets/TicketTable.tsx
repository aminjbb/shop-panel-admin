import React from "react";
import type { SupportTicket } from "@/types/feedback";
import TicketStatusBadge from "./TicketStatusBadge";
import TicketPriorityBadge from "./TicketPriorityBadge";
import EButton from "@/shared-app/designSystem/button";
import { MessageSquare, Phone, Calendar, User, ShoppingBag } from "lucide-react";

export interface TicketTableProps {
  tickets: SupportTicket[];
  onOpenChat: (ticket: SupportTicket) => void;
}

export const TicketTable: React.FC<TicketTableProps> = ({ tickets, onOpenChat }) => {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
      <table className="w-full text-sm text-start border-collapse">
        <thead>
          <tr className="border-b border-slate-800/80 bg-slate-900/90 text-xs text-slate-400 font-semibold">
            <th className="py-3.5 px-4 text-start">شماره تیکت</th>
            <th className="py-3.5 px-4 text-start">مشتری و شماره تماس</th>
            <th className="py-3.5 px-4 text-start">موضوع و آخرین پیام</th>
            <th className="py-3.5 px-4 text-center">اولویت</th>
            <th className="py-3.5 px-4 text-center">وضعیت</th>
            <th className="py-3.5 px-4 text-start">آخرین بروزرسانی</th>
            <th className="py-3.5 px-4 text-center">گفتگو</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {tickets.map((ticket) => {
            const lastMessage = ticket.messages[ticket.messages.length - 1];
            return (
              <tr
                key={ticket.id}
                className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                onClick={() => onOpenChat(ticket)}
              >
                {/* 1. Ticket Number */}
                <td className="py-4 px-4 align-top whitespace-nowrap">
                  <span className="font-mono text-xs font-bold text-indigo-300 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    {ticket.ticketNumber}
                  </span>
                </td>

                {/* 2. Customer Name & Phone */}
                <td className="py-4 px-4 align-top whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {ticket.customerAvatar ? (
                        <img
                          src={ticket.customerAvatar}
                          alt={ticket.customerName}
                          className="w-6 h-6 rounded-full object-cover border border-slate-700"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className="font-semibold text-white text-xs">
                        {ticket.customerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{ticket.customerPhone}</span>
                    </div>
                  </div>
                </td>

                {/* 3. Subject & Preview */}
                <td className="py-4 px-4 align-top min-w-[220px] max-w-[340px]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-xs leading-snug">
                        {ticket.subject}
                      </span>
                      {ticket.relatedOrderId && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 font-mono">
                          <ShoppingBag className="w-2.5 h-2.5" />
                          {ticket.relatedOrderId}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <p className="text-[11px] text-slate-400 line-clamp-1 truncate">
                        <span className="text-slate-300 font-medium">
                          {lastMessage.sender === "support" ? "پشتیبان: " : "مشتری: "}
                        </span>
                        {lastMessage.message}
                      </p>
                    )}
                  </div>
                </td>

                {/* 4. Priority Badge */}
                <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                  <TicketPriorityBadge priority={ticket.priority} />
                </td>

                {/* 5. Status Badge */}
                <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                  <TicketStatusBadge status={ticket.status} />
                </td>

                {/* 6. Last Updated */}
                <td className="py-4 px-4 align-top whitespace-nowrap text-slate-400 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{formatDate(ticket.updatedAt)}</span>
                  </div>
                </td>

                {/* 7. Chat CTA Button */}
                <td className="py-4 px-4 align-top text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <EButton
                    variant="secondary"
                    size="sm"
                    onClick={() => onOpenChat(ticket)}
                    icon={<MessageSquare className="w-3.5 h-3.5 text-indigo-400" />}
                    className="px-3 py-1.5 text-xs text-indigo-300 hover:bg-indigo-500/10 border-indigo-500/20"
                  >
                    پاسخ و گفتگو
                  </EButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
