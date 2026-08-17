import React from "react";
import type { SupportTicket } from "@/types/feedback";
import TicketStatusBadge from "./TicketStatusBadge";
import TicketPriorityBadge from "./TicketPriorityBadge";
import EButton from "@/shared-app/designSystem/button";
import { MessageSquare, Phone, Calendar, User, ShoppingBag } from "lucide-react";

export interface TicketCardProps {
  ticket: SupportTicket;
  onOpenChat: (ticket: SupportTicket) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onOpenChat }) => {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("fa-IR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const lastMessage = ticket.messages[ticket.messages.length - 1];

  return (
    <div
      onClick={() => onOpenChat(ticket)}
      className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 hover:border-indigo-500/30 transition-all cursor-pointer group"
    >
      {/* 1. Header: Ticket Number, Badges */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-indigo-300 px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            {ticket.ticketNumber}
          </span>
          <TicketPriorityBadge priority={ticket.priority} />
        </div>
        <TicketStatusBadge status={ticket.status} />
      </div>

      {/* 2. Subject & Order */}
      <div className="space-y-1">
        <h4 className="font-bold text-white text-xs leading-snug group-hover:text-indigo-300 transition-colors">
          {ticket.subject}
        </h4>
        {ticket.relatedOrderId && (
          <div className="inline-flex items-center gap-1 text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 font-mono">
            <ShoppingBag className="w-2.5 h-2.5" />
            <span>سفارش: {ticket.relatedOrderId}</span>
          </div>
        )}
      </div>

      {/* 3. Last message preview */}
      {lastMessage && (
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 line-clamp-2 leading-relaxed">
          <span className="text-slate-400 font-medium">
            {lastMessage.sender === "support" ? "پشتیبان: " : "مشتری: "}
          </span>
          {lastMessage.message}
        </div>
      )}

      {/* 4. Customer Info & Footer */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          {ticket.customerAvatar ? (
            <img
              src={ticket.customerAvatar}
              alt={ticket.customerName}
              className="w-4 h-4 rounded-full object-cover shrink-0"
            />
          ) : (
            <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          )}
          <span className="font-medium text-slate-300 truncate">
            {ticket.customerName}
          </span>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-slate-400">{ticket.customerPhone}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Calendar className="w-3 h-3 text-slate-500" />
          <span>{formatDate(ticket.updatedAt)}</span>
        </div>
      </div>

      {/* 5. Full width Touch Button */}
      <div className="pt-1" onClick={(e) => e.stopPropagation()}>
        <EButton
          variant="secondary"
          size="sm"
          onClick={() => onOpenChat(ticket)}
          icon={<MessageSquare className="w-3.5 h-3.5 text-indigo-400" />}
          className="w-full text-xs py-2 text-indigo-300 hover:bg-indigo-500/10 border-indigo-500/20 justify-center"
        >
          مشاهده پیام‌ها و ارسال پاسخ ({ticket.messages.length})
        </EButton>
      </div>
    </div>
  );
};

export default TicketCard;
