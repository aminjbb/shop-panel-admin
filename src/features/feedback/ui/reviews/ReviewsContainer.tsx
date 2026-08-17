import React, { useState } from "react";
import type { ProductReview, ReviewStatus } from "@/types/feedback";
import useReviews from "../../hooks/useReviews";
import ReviewTable from "./ReviewTable";
import ReviewCard from "./ReviewCard";
import ReviewReplyModal from "./ReviewReplyModal";
import StatCard from "@/shared-app/statCard";
import SearchBox from "@/shared-app/designSystem/searchBox";
import ESelect from "@/shared-app/designSystem/select";
import EPagination from "@/shared-app/designSystem/pagination";
import EmptyState from "@/shared-app/emptyState";
import EButton from "@/shared-app/designSystem/button";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  Star,
  RotateCcw,
  SlidersHorizontal,
  ThumbsDown,
} from "lucide-react";

export const ReviewsContainer: React.FC = () => {
  const {
    reviews,
    total,
    page,
    totalPages,
    counts,
    isLoading,
    isUpdating,
    params,
    updateStatus,
    replyToReview,
    deleteReview,
    setPage,
    setStatusFilter,
    setRatingFilter,
    setSearch,
    setSortBy,
    refetch,
  } = useReviews();

  const [selectedReviewForReply, setSelectedReviewForReply] = useState<ProductReview | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const handleOpenReply = (review: ProductReview) => {
    setSelectedReviewForReply(review);
    setIsReplyModalOpen(true);
  };

  const handleCloseReply = () => {
    setSelectedReviewForReply(null);
    setIsReplyModalOpen(false);
  };

  const statusTabs: { id: ReviewStatus | "all"; label: string; count: number; icon: React.ReactNode }[] = [
    { id: "all", label: "همه نظرات", count: counts.all, icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: "pending", label: "در انتظار بررسی", count: counts.pending, icon: <Clock className="w-3.5 h-3.5 text-amber-400" /> },
    { id: "approved", label: "تایید و منتشر شده", count: counts.approved, icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: "rejected", label: "رد شده", count: counts.rejected, icon: <ThumbsDown className="w-3.5 h-3.5 text-rose-400" /> },
  ];

  const ratingOptions = [
    { value: "all", label: "همه امتیازها (۱ تا ۵ ستاره)" },
    { value: "5", label: "⭐️⭐️⭐️⭐️⭐️ ۵ ستاره (عالی)" },
    { value: "4", label: "⭐️⭐️⭐️⭐️ ۴ ستاره (خوب)" },
    { value: "3", label: "⭐️⭐️⭐️ ۳ ستاره (متوسط)" },
    { value: "2", label: "⭐️⭐️ ۲ ستاره (ضعیف)" },
    { value: "1", label: "⭐️ ۱ ستاره (خیلی ضعیف)" },
  ];

  const sortOptions = [
    { value: "newest", label: "جدیدترین نظرات" },
    { value: "oldest", label: "قدیمی‌ترین نظرات" },
    { value: "highest_rating", label: "بالاترین امتیاز" },
    { value: "lowest_rating", label: "پایین‌ترین امتیاز" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="کل نظرات ثبت‌شده"
          value={`${counts.all} نظر`}
          description="مجموع بازخوردهای خریداران روی کالاها"
          icon={<MessageSquare className="w-5 h-5 text-indigo-400" />}
          trend={{ value: "۱۰۰٪ پوشش", isPositive: true }}
        />

        <StatCard
          title="نیازمند بررسی و تایید"
          value={`${counts.pending} نظر`}
          description="در انتظار اقدام سریع کارشناس محتوا"
          icon={<Clock className="w-5 h-5 text-amber-400" />}
          trend={{
            value: counts.pending > 0 ? "اقدام فوری" : "به‌روز",
            isPositive: counts.pending === 0,
          }}
          className={counts.pending > 0 ? "border-amber-500/30 bg-amber-500/5" : ""}
        />

        <StatCard
          title="نظرات تایید و منتشر شده"
          value={`${counts.approved} نظر`}
          description="نمایش عمومی در صفحه معرفی کالا"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          trend={{
            value: `${Math.round((counts.approved / (counts.all || 1)) * 100)}٪ تایید`,
            isPositive: true,
          }}
        />

        <StatCard
          title="میانگین رضایت خریداران"
          value={`${counts.averageRating} از ۵`}
          description="بر اساس کلیه بازخوردهای امتیازی"
          icon={<Star className="w-5 h-5 text-amber-400 fill-amber-400" />}
          trend={{ value: "کیفیت بالا", isPositive: true }}
        />
      </div>

      {/* 2. Filter & Search Bar */}
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

        {/* Search, Rating Filter & Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-5">
            <SearchBox
              value={params.search || ""}
              onSearch={setSearch}
              placeholder="جستجو در متن نظر، نام خریدار یا عنوان محصول..."
            />
          </div>

          <div className="sm:col-span-3">
            <ESelect
              value={params.rating ? String(params.rating) : "all"}
              options={ratingOptions}
              onValueChange={(val) =>
                setRatingFilter(val === "all" ? "all" : Number(val))
              }
              placeholder="فیلتر امتیاز ستاره‌ای"
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
              title="بارگذاری مجدد نظرات"
            />
          </div>
        </div>
      </div>

      {/* 3. Review Content Area (Responsive Desktop Table / Mobile Cards) */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-400">در حال دریافت نظرات و بازخوردها...</p>
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          title="نظری با مشخصات انتخابی یافت نشد"
          description="می‌توانید فیلترهای وضعیت یا عبارت جستجو را تغییر دهید."
          icon={<MessageSquare className="w-8 h-8 text-slate-500" />}
          action={
            <EButton
              variant="outlined"
              size="sm"
              onClick={() => {
                setStatusFilter("all");
                setRatingFilter("all");
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
            <ReviewTable
              reviews={reviews}
              onUpdateStatus={updateStatus}
              onOpenReply={handleOpenReply}
              onDelete={deleteReview}
              isUpdating={isUpdating}
            />
          </div>

          {/* Mobile Cards (< 768px) */}
          <div className="md:hidden space-y-3.5">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onUpdateStatus={updateStatus}
                onOpenReply={handleOpenReply}
                onDelete={deleteReview}
                isUpdating={isUpdating}
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

      {/* 4. Reply Modal */}
      <ReviewReplyModal
        isOpen={isReplyModalOpen}
        onClose={handleCloseReply}
        review={selectedReviewForReply}
        onSubmitReply={async (id, text) => {
          await replyToReview(id, text);
        }}
        isSubmitting={isUpdating}
      />
    </div>
  );
};

export default ReviewsContainer;
