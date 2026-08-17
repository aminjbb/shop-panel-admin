import { useState, useEffect, useCallback } from "react";
import type {
  ProductReview,
  ReviewStatus,
  ReviewFilterParams,
  ReviewListResponse,
} from "@/types/feedback";
import mockFeedbackService from "../api/mockFeedbackService";
import { useToastStore } from "@/shared-app/designSystem/toast/store";

export const useReviews = (initialParams: ReviewFilterParams = {}) => {
  const [params, setParams] = useState<ReviewFilterParams>({
    status: "all",
    rating: "all",
    search: "",
    page: 1,
    limit: 6,
    sortBy: "newest",
    ...initialParams,
  });

  const [data, setData] = useState<ReviewListResponse>({
    items: [],
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
    counts: {
      all: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      averageRating: 5,
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await mockFeedbackService.getReviews(params);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "خطا در دریافت لیست نظرات کاربران");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Actions
  const updateStatus = useCallback(async (id: string, status: ReviewStatus) => {
    setIsUpdating(true);
    try {
      const updated = await mockFeedbackService.updateReviewStatus(id, status);
      const statusLabels: Record<ReviewStatus, string> = {
        approved: "تایید و منتشر شد",
        rejected: "رد شد",
        pending: "به حالت در انتظار بازگشت",
      };
      useToastStore.success(`نظر ${updated.customerName} با موفقیت ${statusLabels[status]}.`, {
        title: "بروزرسانی وضعیت نظر",
      });
      await fetchReviews();
      return updated;
    } catch (err: any) {
      useToastStore.error(err?.message || "امکان تغییر وضعیت نظر وجود ندارد.", {
        title: "خطا در بروزرسانی",
      });
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [fetchReviews]);

  const replyToReview = useCallback(async (id: string, replyText: string) => {
    setIsUpdating(true);
    try {
      const updated = await mockFeedbackService.replyToReview(id, replyText);
      useToastStore.success(`پاسخ رسمی ادمین برای نظر ${updated.customerName} ثبت شد.`, {
        title: "پاسخ به نظر ثبت شد",
      });
      await fetchReviews();
      return updated;
    } catch (err: any) {
      useToastStore.error(err?.message || "امکان ثبت پاسخ وجود ندارد.", {
        title: "خطا در ثبت پاسخ",
      });
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [fetchReviews]);

  const deleteReview = useCallback(async (id: string) => {
    setIsUpdating(true);
    try {
      await mockFeedbackService.deleteReview(id);
      useToastStore.info("نظر مورد نظر با موفقیت حذف گردید.", {
        title: "حذف نظر",
      });
      await fetchReviews();
    } catch (err: any) {
      useToastStore.error(err?.message || "خطا در حذف نظر.", {
        title: "خطا",
      });
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [fetchReviews]);

  const setPage = useCallback((page: number) => {
    setParams((prev) => {
      if (prev.page === page) return prev;
      return { ...prev, page };
    });
  }, []);

  const setStatusFilter = useCallback((status: ReviewStatus | "all") => {
    setParams((prev) => {
      if (prev.status === status && prev.page === 1) return prev;
      return { ...prev, status, page: 1 };
    });
  }, []);

  const setRatingFilter = useCallback((rating: number | "all") => {
    setParams((prev) => {
      if (prev.rating === rating && prev.page === 1) return prev;
      return { ...prev, rating, page: 1 };
    });
  }, []);

  const setSearch = useCallback((search: string) => {
    setParams((prev) => {
      if ((prev.search || "") === (search || "") && prev.page === 1) return prev;
      return { ...prev, search, page: 1 };
    });
  }, []);

  const setSortBy = useCallback((sortBy: ReviewFilterParams["sortBy"]) => {
    setParams((prev) => {
      if (prev.sortBy === sortBy && prev.page === 1) return prev;
      return { ...prev, sortBy, page: 1 };
    });
  }, []);

  return {
    reviews: data.items,
    total: data.total,
    page: data.page,
    totalPages: data.totalPages,
    counts: data.counts,
    isLoading,
    isUpdating,
    error,
    params,
    refetch: fetchReviews,
    updateStatus,
    replyToReview,
    deleteReview,
    setPage,
    setStatusFilter,
    setRatingFilter,
    setSearch,
    setSortBy,
  };
};

export default useReviews;
