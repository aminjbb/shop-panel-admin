import { apiRequest } from "@/config/api";
import type {
  AdjustProductStockRequest,
  CreateProductInput,
  Product,
  ProductListParams,
  ProductListResponse,
  ProductSlugCheckParams,
  SlugAvailability,
  UpdateProductInput,
} from "../types";

export const productApi = {
  list(
    params: ProductListParams = {},
    signal?: AbortSignal,
  ): Promise<ProductListResponse> {
    return apiRequest({ path: "/products", query: { ...params }, signal });
  },

  get(productId: string, signal?: AbortSignal): Promise<Product> {
    return apiRequest({
      path: `/products/${encodeURIComponent(productId)}`,
      signal,
    });
  },

  create(body: CreateProductInput, signal?: AbortSignal): Promise<Product> {
    return apiRequest({ path: "/products", method: "POST", body, signal });
  },

  update(
    productId: string,
    body: UpdateProductInput,
    signal?: AbortSignal,
  ): Promise<Product> {
    return apiRequest({
      path: `/products/${encodeURIComponent(productId)}`,
      method: "PATCH",
      body,
      signal,
    });
  },

  archive(productId: string, signal?: AbortSignal): Promise<void> {
    return apiRequest({
      path: `/products/${encodeURIComponent(productId)}`,
      method: "DELETE",
      signal,
    });
  },

  adjustStock(
    { productId, idempotencyKey, input }: AdjustProductStockRequest,
    signal?: AbortSignal,
  ): Promise<Product> {
    return apiRequest({
      path: `/products/${encodeURIComponent(productId)}/stock`,
      method: "PATCH",
      headers: { "Idempotency-Key": idempotencyKey },
      body: input,
      signal,
    });
  },

  checkSlug(
    params: ProductSlugCheckParams,
    signal?: AbortSignal,
  ): Promise<SlugAvailability> {
    return apiRequest({
      path: "/products/slug-check",
      query: { ...params },
      signal,
    });
  },
};
