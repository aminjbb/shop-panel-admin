import React from "react";
import HeaderPages from "@/shared-app/headerPages";
import ReviewsContainer from "@/features/feedback/ui/reviews/ReviewsContainer";
import TicketsContainer from "@/features/feedback/ui/tickets/TicketsContainer";

export type FeedbackActiveTab = "reviews" | "tickets";

export interface FeedbackPageProps {
  initialTab?: FeedbackActiveTab;
  onRedirectToLogin?: () => void;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ initialTab = "reviews" }) => {
  const isReviews = initialTab === "reviews";

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <HeaderPages
        title={
          isReviews
            ? "مدیریت نظرات و امتیازات کالاها"
            : "میز پشتیبانی و تیکت‌ها"
        }
        subtitle={
          isReviews
            ? "بررسی، تایید، پاسخ‌دهی رسمی و مدیریت دیدگاه‌ها و امتیازات کاربران روی کالاها"
            : "مدیریت پیام‌های پشتیبانی، گفتگوی آنلاین با مشتریان و پیگیری مشکلات"
        }
      />

      {/* 2. Active Section Content */}
      <div className="pt-1">
        {isReviews ? (
          <ReviewsContainer />
        ) : (
          <TicketsContainer />
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
