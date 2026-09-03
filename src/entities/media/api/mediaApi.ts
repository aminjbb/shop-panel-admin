import { apiRequest } from "@/config/api";
import type { MediaAsset, UploadMediaInput } from "../types";

function uploadFormData({ kind, file }: UploadMediaInput): FormData {
  const formData = new FormData();
  formData.append("kind", kind);
  formData.append("file", file);
  return formData;
}

export const mediaApi = {
  upload(body: UploadMediaInput, signal?: AbortSignal): Promise<MediaAsset> {
    return apiRequest({
      path: "/media/upload",
      method: "POST",
      body: uploadFormData(body),
      signal,
    });
  },
};
