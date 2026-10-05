import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewApi, type ReviewRating } from "@/entities/review";
import type { ReviewFilterParams, ReviewStatus } from "../types";
import { useToastStore } from "@/shared-app/designSystem/toast/store";
import { mapReview, mapReviewList } from "../models/feedbackMappers";

export const useReviews = (initialParams: ReviewFilterParams = {}) => {
  const client = useQueryClient();
  const [params, setParams] = useState<ReviewFilterParams>({ status: "all", rating: "all", search: "", page: 1, limit: 6, ...initialParams });
  const query = useQuery({ queryKey: ["reviews", "list", params], queryFn: ({ signal }) => reviewApi.list({ status: params.status === "all" ? undefined : params.status, rating: params.rating === "all" ? undefined : params.rating as ReviewRating, search: params.search?.trim() || undefined, page: params.page, limit: params.limit }, signal), select: mapReviewList });
  const invalidate = () => client.invalidateQueries({ queryKey: ["reviews"] });
  const statusMutation = useMutation({ mutationFn: ({ id, status }: { id: string; status: ReviewStatus }) => reviewApi.setStatus(id, { status }), retry: false, onSuccess: invalidate });
  const replyMutation = useMutation({ mutationFn: ({ id, body }: { id: string; body: string }) => reviewApi.reply(id, { body }), retry: false, onSuccess: invalidate });
  const archiveMutation = useMutation({ mutationFn: (id: string) => reviewApi.archive(id), retry: false, onSuccess: invalidate });
  const execute = async <T,>(promise: Promise<T>, message: string) => { try { const result = await promise; useToastStore.success(message); return result; } catch (error) { useToastStore.error(error instanceof Error ? error.message : "خطا در مدیریت نظر"); throw error; } };
  const data = query.data;
  return {
    reviews: data?.items ?? [], total: data?.total ?? 0, page: data?.page ?? 1, totalPages: data?.totalPages ?? 1,
    counts: data?.counts ?? { all: 0, pending: 0, approved: 0, rejected: 0, averageRating: 0 },
    isLoading: query.isLoading, isUpdating: statusMutation.isPending || replyMutation.isPending || archiveMutation.isPending,
    error: query.error instanceof Error ? query.error.message : null, params, refetch: query.refetch,
    updateStatus: (id: string, status: ReviewStatus) => execute(statusMutation.mutateAsync({ id, status }).then(mapReview), "وضعیت نظر به‌روزرسانی شد."),
    replyToReview: (id: string, body: string) => execute(replyMutation.mutateAsync({ id, body }).then(mapReview), "پاسخ نظر ثبت شد."),
    deleteReview: (id: string) => execute(archiveMutation.mutateAsync(id), "نظر آرشیو شد."),
    setPage: (page: number) => setParams((p) => ({ ...p, page })),
    setStatusFilter: (status: ReviewStatus | "all") => setParams((p) => ({ ...p, status, page: 1 })),
    setRatingFilter: (rating: number | "all") => setParams((p) => ({ ...p, rating, page: 1 })),
    setSearch: (search: string) => setParams((p) => ({ ...p, search, page: 1 })),
  };
};
export default useReviews;
