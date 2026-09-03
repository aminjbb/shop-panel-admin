import { apiRequest } from "@/config/api";
import type {
  HomepageSection,
  HomepageSectionInput,
  HomepageStats,
  PublishedHomepage,
  ReorderHomepageSectionsInput,
} from "../types";

export const homepageApi = {
  listSections(signal?: AbortSignal): Promise<HomepageSection[]> {
    return apiRequest({ path: "/homepage/sections", signal });
  },

  getStats(signal?: AbortSignal): Promise<HomepageStats> {
    return apiRequest({ path: "/homepage/stats", signal });
  },

  createSection(
    body: HomepageSectionInput,
    signal?: AbortSignal,
  ): Promise<HomepageSection> {
    return apiRequest({
      path: "/homepage/sections",
      method: "POST",
      body,
      signal,
    });
  },

  replaceSection(
    sectionId: string,
    body: HomepageSectionInput,
    signal?: AbortSignal,
  ): Promise<HomepageSection> {
    return apiRequest({
      path: `/homepage/sections/${encodeURIComponent(sectionId)}`,
      method: "PATCH",
      body,
      signal,
    });
  },

  reorderSections(
    body: ReorderHomepageSectionsInput,
    signal?: AbortSignal,
  ): Promise<void> {
    return apiRequest({
      path: "/homepage/sections/reorder",
      method: "PATCH",
      body,
      signal,
    });
  },

  toggleSection(
    sectionId: string,
    signal?: AbortSignal,
  ): Promise<HomepageSection> {
    return apiRequest({
      path: `/homepage/sections/${encodeURIComponent(sectionId)}/toggle-active`,
      method: "PATCH",
      signal,
    });
  },

  archiveSection(sectionId: string, signal?: AbortSignal): Promise<void> {
    return apiRequest({
      path: `/homepage/sections/${encodeURIComponent(sectionId)}`,
      method: "DELETE",
      signal,
    });
  },

  publish(signal?: AbortSignal): Promise<PublishedHomepage> {
    return apiRequest({
      path: "/homepage/publish",
      method: "POST",
      signal,
    });
  },
};
