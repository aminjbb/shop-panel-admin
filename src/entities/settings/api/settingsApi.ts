import { apiRequest } from "@/config/api";
import type { ResetDevelopmentDataRequest } from "../types";

export const settingsApi = {
  resetDevelopmentData(
    { confirmation, idempotencyKey }: ResetDevelopmentDataRequest,
    signal?: AbortSignal,
  ): Promise<void> {
    return apiRequest({
      path: "/settings/reset-dev-data",
      method: "POST",
      headers: {
        "X-Confirm-Reset": confirmation,
        "Idempotency-Key": idempotencyKey,
      },
      signal,
    });
  },
};
