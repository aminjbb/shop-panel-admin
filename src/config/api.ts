export type ApiQueryPrimitive = string | number | boolean;

export type ApiQueryValue =
  | ApiQueryPrimitive
  | readonly ApiQueryPrimitive[]
  | null
  | undefined;

export type ApiQuery = Record<string, ApiQueryValue>;

export interface ApiErrorField {
  field: string;
  reason: string;
}

export type ApiErrorCode =
  | "authentication_required"
  | "invalid_credentials"
  | "invalid_access_token"
  | "invalid_refresh_token"
  | "validation_error"
  | "http_error"
  | "rate_limited"
  | "dependency_unavailable"
  | "forbidden"
  | "resource_not_found"
  | "conflict"
  | "internal_server_error";

export type ApiConflictReason =
  | "inactive_or_missing"
  | "sku_taken"
  | "variant_sku_taken"
  | "slug_taken"
  | "variant_has_inventory_history"
  | "negative_stock"
  | "idempotency_key_reused"
  | "invalid_parent"
  | "invalid_attribute"
  | "missing_or_inactive"
  | "code_taken"
  | "percentage_range"
  | "invalid_dates_or_value"
  | "usage_limit_below_used_count"
  | "expired_requires_date_extension"
  | "customer_inactive"
  | "not_active"
  | "usage_limit_reached"
  | "minimum_order_value"
  | "category_not_eligible"
  | "invalid_banner_count"
  | "banner_url_must_be_https"
  | "product_not_active"
  | "ordered_ids_must_match_active_sections";

export interface ApiErrorDetails {
  fields?: ApiErrorField[];
  resource?: string;
  reason?: ApiConflictReason | "unavailable";
  dependency?: string;
  retryAfterSeconds?: number;
  [key: string]: unknown;
}

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    details: ApiErrorDetails;
    requestId: string;
  };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode | "unknown_error";
  readonly details: ApiErrorDetails;
  readonly requestId: string | null;
  readonly retryAfterSeconds: number | null;

  constructor(
    status: number,
    body: ApiErrorBody | null,
    response: Response,
  ) {
    super(body?.error.message ?? `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.code = body?.error.code ?? "unknown_error";
    this.details = body?.error.details ?? {};
    this.requestId =
      body?.error.requestId ?? response.headers.get("X-Request-ID");

    const retryAfterHeader = response.headers.get("Retry-After");
    const retryAfter = retryAfterHeader ? Number(retryAfterHeader) : Number.NaN;
    this.retryAfterSeconds =
      body?.error.details.retryAfterSeconds ??
      (Number.isFinite(retryAfter) ? retryAfter : null);
  }
}

export interface ApiRequestOptions<TBody = unknown> {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: ApiQuery;
  body?: TBody | FormData;
  headers?: HeadersInit;
  auth?: boolean;
  requestId?: string;
  base?: "api" | "origin";
  signal?: AbortSignal;
  retryOnUnauthorized?: boolean;
}

const configuredApiUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const runtimeOrigin =
  typeof window === "undefined" ? "http://localhost:3000" : window.location.origin;

export const API_BASE_URL = new URL(
  configuredApiUrl || "http://localhost:8000/api/v1",
  `${runtimeOrigin}/`,
).toString().replace(/\/$/, "");

export const API_ORIGIN = new URL(API_BASE_URL).origin;

let accessTokenProvider: () => string | null = () => null;
let unauthorizedHandler: (() => Promise<boolean>) | null = null;

export function setAccessTokenProvider(provider: () => string | null): void {
  accessTokenProvider = provider;
}

export function setUnauthorizedHandler(
  handler: (() => Promise<boolean>) | null,
): void {
  unauthorizedHandler = handler;
}

export function createRequestId(prefix = "web"): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function resolveApiAssetUrl(url: string): string {
  return new URL(url, `${API_ORIGIN}/`).toString();
}

function buildUrl(
  path: string,
  query: ApiQuery | undefined,
  base: "api" | "origin",
): string {
  const root = base === "origin" ? API_ORIGIN : API_BASE_URL;
  const url = new URL(`${root}/${path.replace(/^\//, "")}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;

      const values = Array.isArray(value) ? value : [value];
      for (const item of values) {
        url.searchParams.append(key, String(item));
      }
    }
  }

  return url.toString();
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (!value || typeof value !== "object" || !("error" in value)) return false;
  const error = value.error;
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      "message" in error &&
      "details" in error &&
      "requestId" in error,
  );
}

export async function apiRequest<TResponse, TBody = unknown>({
  path,
  method = "GET",
  query,
  body,
  headers: suppliedHeaders,
  auth = true,
  requestId = createRequestId(),
  base = "api",
  signal,
  retryOnUnauthorized = true,
}: ApiRequestOptions<TBody>): Promise<TResponse> {
  const headers = new Headers(suppliedHeaders);
  const isMultipart = body instanceof FormData;

  headers.set("Accept", "application/json");
  headers.set("X-Request-ID", requestId);

  if (body !== undefined && !isMultipart) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const accessToken = accessTokenProvider();
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(buildUrl(path, query, base), {
    method,
    headers,
    body:
      body === undefined
        ? undefined
        : isMultipart
          ? body
          : JSON.stringify(body),
    signal,
  });

  if (response.status === 204) return undefined as TResponse;

  const contentType = response.headers.get("Content-Type") ?? "";
  const parsedBody: unknown = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const apiError = new ApiError(
      response.status,
      isApiErrorBody(parsedBody) ? parsedBody : null,
      response,
    );

    if (
      auth &&
      retryOnUnauthorized &&
      apiError.code === "invalid_access_token" &&
      unauthorizedHandler
    ) {
      const refreshed = await unauthorizedHandler();
      if (refreshed) {
        return apiRequest({
          path,
          method,
          query,
          body,
          headers: suppliedHeaders,
          auth,
          requestId: createRequestId("web-retry"),
          base,
          signal,
          retryOnUnauthorized: false,
        });
      }
    }

    throw apiError;
  }

  return parsedBody as TResponse;
}
