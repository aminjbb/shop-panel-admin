import React, { useState } from "react";
import HeaderPages from "@/shared-app/headerPages";
import ReviewsContainer from "@/features/feedback/ui/reviews/ReviewsContainer";
import TicketsContainer from "@/features/feedback/ui/tickets/TicketsContainer";
import mockFeedbackService from "@/features/feedback/api/mockFeedbackService";
import { useToastStore } from "@/shared-app/designSystem/toast/store";
import EButton from "@/shared-app/designSystem/button";
import { RotateCcw } from "lucide-react";

export type FeedbackActiveTab = "reviews" | "tickets";

export interface FeedbackPageProps {
  initialTab?: FeedbackActiveTab;
  onRedirectToLogin?: () => void;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ initialTab = "reviews" }) => {
  const [isResetting, setIsResetting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleResetDefaults = async () => {
    setIsResetting(true);
    try {
      await mockFeedbackService.resetAllToDefaults();
      useToastStore.info(
        "داده‌های نظرات، تیکت‌های چت و اعلان‌های اسپرینت ۶ به مقادیر اولیه بازنشانی شدند.",
        { title: "بازنشانی دیتاماک" }
      );
      setRefreshKey((k) => k + 1);
    } catch {
      useToastStore.error("خطا در بازنشانی اطلاعات");
    } finally {
      setIsResetting(false);
    }
  };

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
      >
        <EButton
          variant="outlined"
          onClick={handleResetDefaults}
          isLoading={isResetting}
          icon={<RotateCcw className="w-4 h-4 text-slate-400" />}
          className="text-xs"
        >
          بازنشانی داده‌های ماک
        </EButton>
      </HeaderPages>

      {/* 2. Active Section Content */}
      <div className="pt-1">
        {isReviews ? (
          <ReviewsContainer key={`reviews-${refreshKey}`} />
        ) : (
          <TicketsContainer key={`tickets-${refreshKey}`} />
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
