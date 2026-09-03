import { apiRequest } from "@/config/api";
import type {
  ReplyReviewInput,
  Review,
  ReviewListParams,
  ReviewListResponse,
  SetReviewStatusInput,
} from "../types";

export const reviewApi = {
  list(
    params: ReviewListParams = {},
    signal?: AbortSignal,
  ): Promise<ReviewListResponse> {
    return apiRequest({ path: "/reviews", query: { ...params }, signal });
  },

  setStatus(
    reviewId: string,
    body: SetReviewStatusInput,
    signal?: AbortSignal,
  ): Promise<Review> {
    return apiRequest({
      path: `/reviews/${encodeURIComponent(reviewId)}/status`,
      method: "PATCH",
      body,
      signal,
    });
  },

  reply(
    reviewId: string,
    body: ReplyReviewInput,
    signal?: AbortSignal,
  ): Promise<Review> {
    return apiRequest({
      path: `/reviews/${encodeURIComponent(reviewId)}/reply`,
      method: "POST",
      body,
      signal,
    });
  },

  archive(reviewId: string, signal?: AbortSignal): Promise<void> {
    return apiRequest({
      path: `/reviews/${encodeURIComponent(reviewId)}`,
      method: "DELETE",
      signal,
    });
  },
};
