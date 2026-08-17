import React from "react";
import type { ProductReview, ReviewStatus } from "@/types/feedback";
import ReviewStatusBadge from "./ReviewStatusBadge";
import ReviewRatingStars from "./ReviewRatingStars";
import EButton from "@/shared-app/designSystem/button";
import {
  Check,
  X,
  MessageSquare,
  Trash2,
  CornerDownLeft,
  Calendar,
  User,
} from "lucide-react";

export interface ReviewTableProps {
  reviews: ProductReview[];
  onUpdateStatus: (id: string, status: ReviewStatus) => void;
  onOpenReply: (review: ProductReview) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
}

export const ReviewTable: React.FC<ReviewTableProps> = ({
  reviews,
  onUpdateStatus,
  onOpenReply,
  onDelete,
  isUpdating = false,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "short",
        day: "numeric",
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
            <th className="py-3.5 px-4 text-start">کالا و محصول</th>
            <th className="py-3.5 px-4 text-start">خریدار و تاریخ</th>
            <th className="py-3.5 px-4 text-center">امتیاز</th>
            <th className="py-3.5 px-4 text-start">متن نظر و پاسخ ادمین</th>
            <th className="py-3.5 px-4 text-center">وضعیت</th>
            <th className="py-3.5 px-4 text-center">عملیات سریع</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {reviews.map((review) => (
            <tr
              key={review.id}
              className="hover:bg-slate-800/30 transition-colors group"
            >
              {/* Product Info */}
              <td className="py-4 px-4 align-top">
                <div className="flex items-start gap-3 min-w-[200px] max-w-[260px]">
                  <img
                    src={review.productThumbnail}
                    alt={review.productTitle}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-800 bg-slate-950 shrink-0"
                    loading="lazy"
                  />
                  <div className="space-y-1">
                    <span className="font-semibold text-white text-xs line-clamp-2 leading-relaxed">
                      {review.productTitle}
                    </span>
                    <span className="text-[10px] text-indigo-400/90 font-mono">
                      {review.productId}
                    </span>
                  </div>
                </div>
              </td>

              {/* Customer Name & Date */}
              <td className="py-4 px-4 align-top whitespace-nowrap">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    {review.customerAvatar ? (
                      <img
                        src={review.customerAvatar}
                        alt={review.customerName}
                        className="w-6 h-6 rounded-full object-cover border border-slate-700"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <span className="font-medium text-slate-200 text-xs">
                      {review.customerName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </td>

              {/* Rating */}
              <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                <div className="inline-flex justify-center">
                  <ReviewRatingStars rating={review.rating} size="sm" />
                </div>
              </td>

              {/* Comment and Admin Reply */}
              <td className="py-4 px-4 align-top min-w-[260px] max-w-[400px]">
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed relative">
                    <span className="text-slate-400 text-sm font-serif me-1">“</span>
                    {review.comment}
                    <span className="text-slate-400 text-sm font-serif ms-1">”</span>
                  </div>

                  {review.adminReply && (
                    <div className="p-2 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2">
                      <CornerDownLeft className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5 flex-1">
                        <span className="text-[10px] font-semibold text-indigo-300 block">
                          پاسخ رسمی ادمین:
                        </span>
                        <p className="text-[11px] text-indigo-200 leading-normal">
                          {review.adminReply}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </td>

              {/* Status Badge */}
              <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                <ReviewStatusBadge status={review.status} />
              </td>

              {/* Action Buttons */}
              <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                <div className="inline-flex items-center gap-1.5 flex-wrap justify-center">
                  {/* Approve */}
                  {review.status !== "approved" && (
                    <EButton
                      variant="secondary"
                      size="sm"
                      onClick={() => onUpdateStatus(review.id, "approved")}
                      disabled={isUpdating}
                      icon={<Check className="w-3.5 h-3.5 text-emerald-400" />}
                      className="px-2.5 py-1 text-xs text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20"
                      title="تایید و انتشار نظر"
                    >
                      تایید
                    </EButton>
                  )}

                  {/* Reject */}
                  {review.status !== "rejected" && (
                    <EButton
                      variant="secondary"
                      size="sm"
                      onClick={() => onUpdateStatus(review.id, "rejected")}
                      disabled={isUpdating}
                      icon={<X className="w-3.5 h-3.5 text-rose-400" />}
                      className="px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-500/10 border-rose-500/20"
                      title="رد نظر"
                    >
                      رد
                    </EButton>
                  )}

                  {/* Reply */}
                  <EButton
                    variant="secondary"
                    size="sm"
                    onClick={() => onOpenReply(review)}
                    disabled={isUpdating}
                    icon={<MessageSquare className="w-3.5 h-3.5 text-indigo-400" />}
                    className="px-2.5 py-1 text-xs text-indigo-300 hover:bg-indigo-500/10 border-indigo-500/20"
                    title={review.adminReply ? "ویرایش پاسخ" : "پاسخ به نظر"}
                  >
                    {review.adminReply ? "ویرایش پاسخ" : "پاسخ"}
                  </EButton>

                  {/* Delete */}
                  <EButton
                    variant="secondary"
                    size="sm"
                    onClick={() => onDelete(review.id)}
                    disabled={isUpdating}
                    icon={<Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-rose-400" />}
                    className="p-1.5 text-slate-400 hover:bg-rose-500/10 hover:border-rose-500/20"
                    title="حذف نظر"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewTable;
