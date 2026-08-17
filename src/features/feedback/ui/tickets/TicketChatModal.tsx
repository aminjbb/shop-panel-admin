import React, { useState, useEffect, useRef } from "react";
import type { SupportTicket, TicketStatus, TicketPriority } from "@/types/feedback";
import BottomSheet from "@/shared-app/bottomSheet";
import EButton from "@/shared-app/designSystem/button";
import ESelect from "@/shared-app/designSystem/select";
import TicketStatusBadge from "./TicketStatusBadge";
import TicketPriorityBadge from "./TicketPriorityBadge";
import {
  Send,
  User,
  Headphones,
  ShoppingBag,
  Phone,
  Sparkles,
  CheckCheck,
  Calendar,
  AlertCircle,
} from "lucide-react";

export interface TicketChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicket | null;
  onSendMessage: (message: string) => Promise<any>;
  onUpdateStatus: (id: string, status: TicketStatus) => Promise<any>;
  onUpdatePriority: (id: string, priority: TicketPriority) => Promise<any>;
  isSending?: boolean;
}

const CANNED_TICKET_RESPONSES = [
  "سلام وقت بخیر، درخواست شما با واحد پشتیبانی و لجستیک هماهنگ شد.",
  "درود، جهت بررسی دقیق‌تر لطفاً تصویر فاکتور یا شماره سفارش را ارسال فرمایید.",
  "با سلام، مرسوله مجدداً با اولویت اکسپرس ارسال گردید.",
  "سلام، مشکل گزارش‌شده برطرف شد؛ در صورت وجود سوال دیگری در خدمت شما هستیم.",
];

export const TicketChatModal: React.FC<TicketChatModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onSendMessage,
  onUpdateStatus,
  onUpdatePriority,
  isSending = false,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && ticket) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen, ticket?.messages.length]);

  if (!ticket) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const msg = inputMessage.trim();
    setInputMessage("");
    try {
      await onSendMessage(msg);
      setTimeout(scrollToBottom, 50);
    } catch {
      setInputMessage(msg);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleApplyCanned = (text: string) => {
    setInputMessage((prev) => (prev ? `${prev} ${text}` : text));
  };

  const formatMessageTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const formatFullDate = (dateStr: string) => {
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

  const statusOptions = [
    { value: "open", label: "تیکت باز (جدید)" },
    { value: "in_progress", label: "در حال بررسی پشتیبانی" },
    { value: "waiting_customer", label: "در انتظار پاسخ مشتری" },
    { value: "closed", label: "بستن تیکت" },
  ];

  const priorityOptions = [
    { value: "urgent", label: "فوری / اضطراری" },
    { value: "high", label: "اولویت بالا" },
    { value: "medium", label: "اولویت متوسط" },
    { value: "low", label: "اولویت کم" },
  ];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center justify-between gap-3 w-full pe-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                  {ticket.ticketNumber}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                  {ticket.subject}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                مشتری: {ticket.customerName} • {ticket.customerPhone}
              </p>
            </div>
          </div>
        </div>
      }
      size="xl"
      className="p-0 overflow-hidden"
    >
      <div className="flex flex-col lg:grid lg:grid-cols-12 h-[75vh] max-h-[700px] -m-6 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-800">
        {/* Left / Top Details & Meta Sidebar (4 cols on lg) */}
        <div className="lg:col-span-4 p-4 sm:p-5 bg-slate-950/60 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-4">
            {/* Customer Info Card */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2.5">
                {ticket.customerAvatar ? (
                  <img
                    src={ticket.customerAvatar}
                    alt={ticket.customerName}
                    className="w-10 h-10 rounded-full object-cover border border-indigo-500/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-white text-xs truncate">
                    {ticket.customerName}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono mt-0.5">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>{ticket.customerPhone}</span>
                  </div>
                </div>
              </div>

              {ticket.relatedOrderId && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">سفارش مرتبط:</span>
                  <span className="font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-semibold inline-flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3" />
                    {ticket.relatedOrderId}
                  </span>
                </div>
              )}
            </div>

            {/* Status & Priority Selectors */}
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  وضعیت تیکت
                </label>
                <ESelect
                  value={ticket.status}
                  options={statusOptions}
                  onValueChange={(val) => onUpdateStatus(ticket.id, val as TicketStatus)}
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  درجه اولویت
                </label>
                <ESelect
                  value={ticket.priority}
                  options={priorityOptions}
                  onValueChange={(val) => onUpdatePriority(ticket.id, val as TicketPriority)}
                  fullWidth
                />
              </div>
            </div>

            {/* Creation and update info */}
            <div className="text-[11px] text-slate-400 space-y-1.5 px-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  تاریخ ایجاد:
                </span>
                <span className="font-mono text-slate-300">
                  {formatFullDate(ticket.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  آخرین فعالیت:
                </span>
                <span className="font-mono text-slate-300">
                  {formatFullDate(ticket.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
            <span>پاسخ‌های شما بلافاصله در پنل کاربری مشتری ثبت و پیامک اطلاع‌رسانی ارسال می‌گردد.</span>
          </div>
        </div>

        {/* Right / Chat Thread Area (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col h-full bg-slate-900/30">
          {/* Header Badges Bar */}
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">وضعیت فعلی:</span>
              <TicketStatusBadge status={ticket.status} />
              <TicketPriorityBadge priority={ticket.priority} />
            </div>
            <span className="text-slate-400 font-mono text-[11px]">
              {ticket.messages.length} پیام تبادل شده
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 scrollbar-thin">
            {ticket.messages.map((msg) => {
              const isSupport = msg.sender === "support";
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${
                    isSupport ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div className="shrink-0">
                    {isSupport ? (
                      <div className="w-7 h-7 rounded-full bg-indigo-600 border border-indigo-400/30 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                        <Headphones className="w-3.5 h-3.5" />
                      </div>
                    ) : ticket.customerAvatar ? (
                      <img
                        src={ticket.customerAvatar}
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-full object-cover border border-slate-700"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] space-y-1 ${
                      isSupport ? "items-end text-end" : "items-start text-start"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                      <span className="font-semibold text-slate-300">
                        {msg.senderName}
                      </span>
                      <span>•</span>
                      <span className="font-mono">{formatMessageTime(msg.sentAt)}</span>
                      {isSupport && <CheckCheck className="w-3 h-3 text-indigo-400" />}
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isSupport
                          ? "bg-indigo-600 text-white rounded-ee-xs shadow-md shadow-indigo-600/20 border border-indigo-500/40"
                          : "bg-slate-800 text-slate-100 rounded-es-xs border border-slate-700/80"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Canned Responses Chips */}
          <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] text-slate-400 shrink-0">پاسخ سریع:</span>
            {CANNED_TICKET_RESPONSES.map((canned, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyCanned(canned)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
              >
                {canned.substring(0, 30)}...
              </button>
            ))}
          </div>

          {/* Sticky Bottom Input Area */}
          <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
            <form onSubmit={handleSend} className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  rows={2}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="پاسخ خود به تیکت مشتری را بنویسید (Enter برای ارسال، Shift+Enter برای خط جدید)..."
                  className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl text-white placeholder-slate-400 p-3 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                  disabled={isSending}
                />
              </div>

              <EButton
                type="submit"
                variant="primary"
                isLoading={isSending}
                disabled={!inputMessage.trim()}
                icon={<Send className="w-4 h-4 rtl:rotate-180" />}
                className="h-11 px-4 sm:px-5 shrink-0"
              >
                ارسال
              </EButton>
            </form>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

export default TicketChatModal;
