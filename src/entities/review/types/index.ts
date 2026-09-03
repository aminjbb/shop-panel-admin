export type ReviewStatus = "pending" | "approved" | "rejected";
export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface Review {
  id: string;
  customerId: string | null;
  productId: string | null;
  customerName: string;
  rating: ReviewRating;
  body: string;
  status: ReviewStatus;
  adminReply: string | null;
  repliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListParams {
  status?: ReviewStatus;
  rating?: ReviewRating;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ReviewListResponse {
  reviews: Review[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface SetReviewStatusInput {
  status: ReviewStatus;
}

export interface ReplyReviewInput {
  body: string;
}
