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

export interface ReviewCardProps {
  review: ProductReview;
  onUpdateStatus: (id: string, status: ReviewStatus) => void;
  onOpenReply: (review: ProductReview) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
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
    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 hover:border-slate-700/80 transition-all">
      {/* 1. Header: Product thumb + title + date */}
      <div className="flex items-start gap-3">
        <img
          src={review.productThumbnail}
          alt={review.productTitle}
          className="w-14 h-14 rounded-xl object-cover border border-slate-800 bg-slate-950 shrink-0"
          loading="lazy"
        />
        <div className="space-y-1 flex-1 min-w-0">
          <h4 className="font-semibold text-white text-xs leading-snug line-clamp-2">
            {review.productTitle}
          </h4>
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              {review.customerAvatar ? (
                <img
                  src={review.customerAvatar}
                  alt={review.customerName}
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
              ) : (
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              <span className="font-medium text-slate-300 truncate">
                {review.customerName}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Rating & Status */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
        <ReviewRatingStars rating={review.rating} size="sm" />
        <ReviewStatusBadge status={review.status} />
      </div>

      {/* 3. Review Comment (Quote Style) */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
        <span className="text-slate-400 text-sm font-serif me-1">“</span>
        {review.comment}
        <span className="text-slate-400 text-sm font-serif ms-1">”</span>
      </div>

      {/* 4. Admin Reply Box (if available) */}
      {review.adminReply && (
        <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2">
          <CornerDownLeft className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 flex-1 min-w-0">
            <span className="text-[10px] font-semibold text-indigo-300 block">
              پاسخ رسمی ادمین:
            </span>
            <p className="text-[11px] text-indigo-200 leading-relaxed">
              {review.adminReply}
            </p>
          </div>
        </div>
      )}

      {/* 5. Touch Action Buttons */}
      <div className="pt-2 border-t border-slate-800 flex items-center gap-2 flex-wrap">
        {/* Approve */}
        {review.status !== "approved" && (
          <EButton
            variant="secondary"
            size="sm"
            onClick={() => onUpdateStatus(review.id, "approved")}
            disabled={isUpdating}
            icon={<Check className="w-3.5 h-3.5 text-emerald-400" />}
            className="flex-1 text-xs py-2 text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20"
          >
            تایید انتشار
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
            className="flex-1 text-xs py-2 text-rose-400 hover:bg-rose-500/10 border-rose-500/20"
          >
            رد نظر
          </EButton>
        )}

        {/* Reply */}
        <EButton
          variant="secondary"
          size="sm"
          onClick={() => onOpenReply(review)}
          disabled={isUpdating}
          icon={<MessageSquare className="w-3.5 h-3.5 text-indigo-400" />}
          className="flex-1 text-xs py-2 text-indigo-300 hover:bg-indigo-500/10 border-indigo-500/20"
        >
          {review.adminReply ? "ویرایش پاسخ" : "پاسخ ادمین"}
        </EButton>

        {/* Delete */}
        <EButton
          variant="secondary"
          size="sm"
          onClick={() => onDelete(review.id)}
          disabled={isUpdating}
          icon={<Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-rose-400" />}
          className="p-2 text-slate-400 hover:bg-rose-500/10 hover:border-rose-500/20"
          title="حذف نظر"
        />
      </div>
    </div>
  );
};

export default ReviewCard;
