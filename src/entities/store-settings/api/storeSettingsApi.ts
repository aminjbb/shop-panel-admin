import { apiRequest } from "@/config/api";
import type { StoreSettings, StoreSettingsInput } from "../types";

export const storeSettingsApi = {
  get(signal?: AbortSignal): Promise<StoreSettings> {
    return apiRequest({ path: "/settings/store", signal });
  },
  update(body: StoreSettingsInput): Promise<StoreSettings> {
    return apiRequest({ path: "/settings/store", method: "PUT", body });
  },
};
