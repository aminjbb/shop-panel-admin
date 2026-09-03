export type MediaKind = "product" | "homepage" | "store_logo";
export type MediaContentType = "image/jpeg" | "image/png" | "image/webp";

export interface UploadMediaInput {
  kind: MediaKind;
  file: File;
}

export interface MediaAsset {
  id: string;
  kind: MediaKind;
  url: string;
  contentType: MediaContentType;
  byteSize: number;
  createdAt: string;
}
