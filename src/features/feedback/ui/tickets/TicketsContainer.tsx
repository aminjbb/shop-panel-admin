import React, { useState } from "react";
import type { SupportTicket, TicketStatus, TicketPriority } from "@/types/feedback";
import useTickets from "../../hooks/useTickets";
import TicketTable from "./TicketTable";
import TicketCard from "./TicketCard";
import TicketChatModal from "./TicketChatModal";
import StatCard from "@/shared-app/statCard";
import SearchBox from "@/shared-app/designSystem/searchBox";
import ESelect from "@/shared-app/designSystem/select";
import EPagination from "@/shared-app/designSystem/pagination";
import EmptyState from "@/shared-app/emptyState";
import EButton from "@/shared-app/designSystem/button";
import {
  Headphones,
  Clock,
  RefreshCw,
  UserCheck,
  CheckCircle2,
  Flame,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

export const TicketsContainer: React.FC = () => {
  const {
    tickets,
    total,
    page,
    totalPages,
    counts,
    selectedTicket,
    isLoading,
    isUpdating,
    isSendingMessage,
    params,
    selectTicket,
    sendMessage,
    updateStatus,
    updatePriority,
    setPage,
    setStatusFilter,
    setPriorityFilter,
    setSearch,
    setSortBy,
    refetch,
  } = useTickets();

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const handleOpenChat = (ticket: SupportTicket) => {
    selectTicket(ticket);
    setIsChatModalOpen(true);
  };

  const handleCloseChat = () => {
    selectTicket(null);
    setIsChatModalOpen(false);
  };

  const statusTabs: { id: TicketStatus | "all"; label: string; count: number; icon: React.ReactNode }[] = [
    { id: "all", label: "همه تیکت‌ها", count: counts.all, icon: <Headphones className="w-3.5 h-3.5" /> },
    { id: "open", label: "تیکت جدید (باز)", count: counts.open, icon: <Clock className="w-3.5 h-3.5 text-indigo-400" /> },
    { id: "in_progress", label: "در حال بررسی", count: counts.in_progress, icon: <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> },
    { id: "waiting_customer", label: "در انتظار مشتری", count: counts.waiting_customer, icon: <UserCheck className="w-3.5 h-3.5 text-purple-400" /> },
    { id: "closed", label: "بسته شده", count: counts.closed, icon: <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> },
  ];

  const priorityOptions = [
    { value: "all", label: "همه اولویت‌ها" },
    { value: "urgent", label: "🔥 فوری و اضطراری" },
    { value: "high", label: "اولویت بالا" },
    { value: "medium", label: "اولویت متوسط" },
    { value: "low", label: "اولویت کم" },
  ];

  const sortOptions = [
    { value: "newest", label: "جدیدترین فعالیت‌ها" },
    { value: "urgent_first", label: "ابتدا تیکت‌های فوری" },
    { value: "oldest", label: "قدیمی‌ترین تیکت‌ها" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="تیکت‌های جدید (باز)"
          value={`${counts.open} تیکت`}
          description="نیازمند پاسخگویی و تخصیص به کارشناس"
          icon={<Clock className="w-5 h-5 text-indigo-400" />}
          trend={{
            value: counts.open > 0 ? "نیازمند اقدام" : "پاسخ داده شد",
            isPositive: counts.open === 0,
          }}
          className={counts.open > 0 ? "border-indigo-500/30 bg-indigo-500/5" : ""}
        />

        <StatCard
          title="تیکت‌های فوری و اضطراری"
          value={`${counts.urgent} مورد`}
          description="اولویت بحرانی (نقص مرسوله، شکایت فوری)"
          icon={<Flame className="w-5 h-5 text-rose-400" />}
          trend={{
            value: counts.urgent > 0 ? "اولویت ۱" : "بدون بحران",
            isPositive: counts.urgent === 0,
          }}
          className={counts.urgent > 0 ? "border-rose-500/40 bg-rose-500/10" : ""}
        />

        <StatCard
          title="در حال بررسی تیم پشتیبانی"
          value={`${counts.in_progress} گفتگو`}
          description="در تعامل با انبار و شرکت‌های پستی"
          icon={<RefreshCw className="w-5 h-5 text-amber-400" />}
          trend={{ value: "در جریان", isPositive: true }}
        />

        <StatCard
          title="در انتظار پاسخ مشتری"
          value={`${counts.waiting_customer} تیکت`}
          description="استعلام مدارک یا بازخورد خریدار"
          icon={<UserCheck className="w-5 h-5 text-purple-400" />}
          trend={{ value: "پیگیری فعال", isPositive: true }}
        />
      </div>

      {/* 2. Filters & Search */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        {/* Status Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {statusTabs.map((tab) => {
            const isActive = (params.status || "all") === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                    : "bg-slate-950/60 hover:bg-slate-800/80 text-slate-300 border border-slate-800 hover:border-slate-700"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Priority Filter & Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-5">
            <SearchBox
              value={params.search || ""}
              onSearch={setSearch}
              placeholder="جستجو در شماره تیکت، شماره تماس، نام مشتری، موضوع یا پیام..."
            />
          </div>

          <div className="sm:col-span-3">
            <ESelect
              value={params.priority || "all"}
              options={priorityOptions}
              onValueChange={(val) => setPriorityFilter(val as any)}
              placeholder="فیلتر اولویت تیکت"
            />
          </div>

          <div className="sm:col-span-3">
            <ESelect
              value={params.sortBy || "newest"}
              options={sortOptions}
              onValueChange={(val) => setSortBy(val as any)}
              placeholder="مرتب‌سازی"
            />
          </div>

          <div className="sm:col-span-1 flex justify-end">
            <EButton
              variant="secondary"
              onClick={() => refetch()}
              disabled={isLoading}
              icon={<RotateCcw className="w-4 h-4 text-slate-400" />}
              className="w-full sm:w-auto p-2.5"
              title="بارگذاری مجدد تیکت‌ها"
            />
          </div>
        </div>
      </div>

      {/* 3. Tickets Content Area */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-400">در حال دریافت تیکت‌های پشتیبانی...</p>
        </div>
      ) : tickets.length === 0 ? (
        <EmptyState
          title="تیکتی با مشخصات فیلتر شده یافت نشد"
          description="می‌توانید فیلترهای وضعیت یا عبارت جستجو را تغییر دهید."
          icon={<Headphones className="w-8 h-8 text-slate-500" />}
          action={
            <EButton
              variant="outlined"
              size="sm"
              onClick={() => {
                setStatusFilter("all");
                setPriorityFilter("all");
                setSearch("");
              }}
              icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
            >
              پاک‌سازی فیلترها
            </EButton>
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table (>= 768px) */}
          <div className="hidden md:block">
            <TicketTable tickets={tickets} onOpenChat={handleOpenChat} />
          </div>

          {/* Mobile Cards (< 768px) */}
          <div className="md:hidden space-y-3.5">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onOpenChat={handleOpenChat}
              />
            ))}
          </div>

          {/* Pagination */}
          <EPagination
            currentPage={page}
            totalPages={totalPages}
            totalCount={total}
            pageSize={params.limit || 6}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* 4. Chat Modal */}
      <TicketChatModal
        isOpen={isChatModalOpen}
        onClose={handleCloseChat}
        ticket={selectedTicket}
        onSendMessage={sendMessage}
        onUpdateStatus={updateStatus}
        onUpdatePriority={updatePriority}
        isSending={isSendingMessage || isUpdating}
      />
    </div>
  );
};

export default TicketsContainer;
