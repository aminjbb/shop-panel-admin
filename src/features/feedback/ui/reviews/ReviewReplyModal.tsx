import React, { useState, useEffect } from "react";
import type { ProductReview } from "@/types/feedback";
import BottomSheet from "@/shared-app/bottomSheet";
import EButton from "@/shared-app/designSystem/button";
import ETextField from "@/shared-app/designSystem/textField";
import ReviewRatingStars from "./ReviewRatingStars";
import { MessageSquare, Sparkles, Send, User } from "lucide-react";

export interface ReviewReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: ProductReview | null;
  onSubmitReply: (reviewId: string, replyText: string) => Promise<void>;
  isSubmitting?: boolean;
}

const CANNED_REPLIES = [
  "با سلام و احترام، از ثبت نظر و خرید ارزشمند شما از دینووا سپاسگزاریم.",
  "سلام دوست عزیز، بابت تجربه نامطلوب پوزش می‌طلبیم؛ کارشناسان پشتیبانی جهت پیگیری و جلب رضایت با شما تماس می‌گیرند.",
  "با درود، خوشحالیم که کیفیت کالا و سرعت ارسال رضایت کامل شما را فراهم کرده است.",
  "سلام، این کالا دارای گارانتی اصالت و ضمانت سلامت ۷ روزه دینووا می‌باشد.",
];

export const ReviewReplyModal: React.FC<ReviewReplyModalProps> = ({
  isOpen,
  onClose,
  review,
  onSubmitReply,
  isSubmitting = false,
}) => {
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (review) {
      setReplyText(review.adminReply || "");
      setError("");
    }
  }, [review, isOpen]);

  if (!review) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) {
      setError("لطفاً متن پاسخ ادمین را وارد نمایید.");
      return;
    }

    try {
      await onSubmitReply(review.id, replyText.trim());
      onClose();
    } catch {
      // Error handled in hook
    }
  };

  const handleApplyCanned = (text: string) => {
    setReplyText((prev) => (prev ? `${prev} ${text}` : text));
    setError("");
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {review.adminReply ? "ویرایش پاسخ رسمی ادمین" : "ثبت پاسخ به نظر خریدار"}
            </h3>
            <p className="text-xs text-slate-400">
              پاسخ شما به صورت عمومی زیر نظر کاربر در سایت نمایش داده خواهد شد.
            </p>
          </div>
        </div>
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Customer Comment Context Box */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              {review.customerAvatar ? (
                <img
                  src={review.customerAvatar}
                  alt={review.customerName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-700"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                  <User className="w-4 h-4" />
                </div>
              )}
              <span className="text-sm font-semibold text-white">
                {review.customerName}
              </span>
            </div>
            <ReviewRatingStars rating={review.rating} />
          </div>

          <div className="text-xs text-indigo-300/90 font-medium">
            محصول: {review.productTitle}
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed italic">
            "{review.comment}"
          </div>
        </div>

        {/* Canned Quick Templates */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>قالب‌های آماده پاسخ سریع:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CANNED_REPLIES.map((canned, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyCanned(canned)}
                className="text-start p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer leading-tight line-clamp-2"
              >
                + {canned}
              </button>
            ))}
          </div>
        </div>

        {/* Reply Textarea */}
        <div>
          <ETextField
            multiline
            rows={4}
            label="متن پاسخ رسمی فروشگاه"
            placeholder="پاسخ محترمانه و دقیق به بازخورد خریدار بنویسید..."
            value={replyText}
            onValueChange={(val) => {
              setReplyText(val);
              if (error) setError("");
            }}
            error={Boolean(error)}
            helperText={error || "حداکثر ۱۰۰۰ کاراکتر"}
            required
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
          <EButton
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            انصراف
          </EButton>

          <EButton
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            icon={<Send className="w-4 h-4 rtl:rotate-180" />}
          >
            {review.adminReply ? "ذخیره تغییرات پاسخ" : "ثبت و تایید پاسخ"}
          </EButton>
        </div>
      </form>
    </BottomSheet>
  );
};

export default ReviewReplyModal;
