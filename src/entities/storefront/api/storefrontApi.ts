import { apiRequest } from "@/config/api";
import type { StorefrontHomepage } from "../types";

export const storefrontApi = {
  getHomepage(signal?: AbortSignal): Promise<StorefrontHomepage> {
    return apiRequest({
      path: "/storefront/homepage",
      auth: false,
      signal,
    });
  },
};
