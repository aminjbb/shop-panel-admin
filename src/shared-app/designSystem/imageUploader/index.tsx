import React, { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Link as LinkIcon,
  Check,
  AlertCircle,
  Sparkles,
  Camera,
  ExternalLink,
} from "lucide-react";

export interface ImagePreset {
  label: string;
  url: string;
}

export interface ImageUploaderProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  maxSizeMB?: number;
  presets?: ImagePreset[];
  variant?: "default" | "compact" | "avatar";
  aspectRatio?: "square" | "video" | "banner" | "auto";
  id?: string;
  className?: string;
  allowUrlFallback?: boolean;
}

/**
 * Optimizes/resizes an image file if it's too large, returning a clean base64 data URL.
 */
async function processAndCompressImage(file: File, maxDimension = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("خطا در خواندن فایل تصویری"));
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        return reject(new Error("محتوای تصویر خالی است"));
      }

      // If svg, keep vector data as-is
      if (file.type === "image/svg+xml") {
        return resolve(result);
      }

      const img = new Image();
      img.onerror = () => resolve(result);
      img.onload = () => {
        let { width, height } = img;
        if (width <= maxDimension && height <= maxDimension && file.size < 1024 * 1024) {
          // File is already small enough, no canvas resizing needed
          return resolve(result);
        }

        // Scale proportionally
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(result);
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Export as webp or jpeg with good quality
        const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
        const compressed = canvas.toDataURL(mimeType, 0.88);
        resolve(compressed);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = "",
  onChange,
  label,
  helperText,
  error,
  required = false,
  maxSizeMB = 5,
  presets = [],
  variant = "default",
  aspectRatio = "auto",
  id,
  className = "",
  allowUrlFallback = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSizeStr, setFileSizeStr] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"upload" | "url">("upload");
  const [manualUrl, setManualUrl] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploaderId = id || `img-uploader-${Math.random().toString(36).substring(2, 9)}`;

  const displayError = error || localError;

  const handleFile = async (file: File) => {
    setLocalError(null);

    // Validate type
    if (!file.type.startsWith("image/")) {
      setLocalError("لطفاً فقط فایل تصویری (PNG, JPG, WEBP, SVG) انتخاب فرمایید.");
      return;
    }

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`حجم تصویر انتخابی بیش از ${maxSizeMB} مگابایت است.`);
      return;
    }

    // Format size for display
    const sizeKb = Math.round(file.size / 1024);
    const sizeDisplay = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} مگابایت` : `${sizeKb} کیلوبایت`;
    setFileName(file.name);
    setFileSizeStr(sizeDisplay);

    setIsProcessing(true);
    try {
      const dataUrl = await processAndCompressImage(file);
      onChange(dataUrl);
    } catch {
      setLocalError("خطایی در بارگذاری تصویر رخ داد. لطفاً مجدداً امتحان کنید.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    // reset input value so re-selecting the same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setFileName(null);
    setFileSizeStr(null);
    setLocalError(null);
    setManualUrl("");
  };

  const handleApplyUrl = () => {
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setFileName("تصویر اینترنتی");
      setFileSizeStr(null);
      setLocalError(null);
    }
  };

  const handlePresetSelect = (presetUrl: string, presetLabel: string) => {
    onChange(presetUrl);
    setFileName(presetLabel);
    setFileSizeStr(null);
    setLocalError(null);
  };

  // Aspect ratio helper
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      case "banner":
        return "aspect-[21/9]";
      default:
        return "";
    }
  };

  // ----------------------------------------------------
  // VARIANT: AVATAR
  // ----------------------------------------------------
  if (variant === "avatar") {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          id={uploaderId}
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={handleFileInputChange}
          className="hidden"
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group w-24 h-24 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all flex items-center justify-center bg-slate-900 ${
            isDragging
              ? "border-indigo-500 bg-indigo-500/10 ring-4 ring-indigo-500/20"
              : value
              ? "border-slate-700 hover:border-indigo-500"
              : "border-dashed border-slate-700 hover:border-indigo-400 hover:bg-slate-800/80"
          }`}
          title="کلیک برای انتخاب عکس از سیستم"
        >
          {value ? (
            <>
              <img
                src={value}
                alt="آواتار"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                <Camera className="w-5 h-5 text-indigo-300" />
                <span className="text-[10px] font-medium">تغییر تصویر</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 text-slate-400 group-hover:text-indigo-300 transition-colors p-2 text-center">
              <Camera className="w-6 h-6 text-slate-500 group-hover:text-indigo-400" />
              <span className="text-[10px] font-medium">انتخاب عکس</span>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>حذف عکس</span>
          </button>
        )}

        {displayError && (
          <span className="text-[11px] text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {displayError}
          </span>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // VARIANT: COMPACT (Ideal for table rows, banner lists, sliders)
  // ----------------------------------------------------
  if (variant === "compact") {
    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              {label} {required && <span className="text-rose-400">*</span>}
            </label>
            {value && (
              <button
                type="button"
                onClick={handleRemove}
                className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>حذف تصویر</span>
              </button>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          id={uploaderId}
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Thumbnail preview */}
          {value ? (
            <div className="relative group w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
              <img
                src={value}
                alt="پیش‌نمایش"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white text-xs cursor-pointer"
                title="تغییر عکس"
              >
                <RefreshCw className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px]">تغییر تصویر</span>
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full sm:w-28 h-20 rounded-xl border border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shrink-0 bg-slate-900/60 ${
                isDragging
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-slate-700 hover:border-indigo-500 hover:bg-slate-800"
              }`}
            >
              <UploadCloud className="w-5 h-5 text-indigo-400" />
              <span className="text-[10px] text-slate-400 text-center px-1">آپلود عکس</span>
            </div>
          )}

          {/* Action box / Details */}
          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                <span>انتخاب فایل از سیستم</span>
              </button>

              {allowUrlFallback && (
                <button
                  type="button"
                  onClick={() => setInputMode((m) => (m === "upload" ? "url" : "upload"))}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{inputMode === "upload" ? "لینک اینترنتی" : "آپلود مستقیم"}</span>
                </button>
              )}
            </div>

            {inputMode === "url" && allowUrlFallback && (
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  placeholder="https://..."
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  dir="ltr"
                  className="flex-1 text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs cursor-pointer shrink-0"
                >
                  ثبت لینک
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
              {fileName ? (
                <span className="truncate font-mono text-indigo-300" title={fileName}>
                  {fileName} {fileSizeStr && `(${fileSizeStr})`}
                </span>
              ) : (
                <span>پشتیبانی از PNG, JPG, WEBP تا سقف {maxSizeMB} مگابایت</span>
              )}
            </div>
          </div>
        </div>

        {displayError && (
          <span className="text-[11px] text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {displayError}
          </span>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // VARIANT: DEFAULT (Full Drag-and-Drop Uploader Card)
  // ----------------------------------------------------
  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Header with Title and Mode Switcher */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>{label}</span>
            {required && <span className="text-rose-400">*</span>}
          </label>
        )}

        <div className="flex items-center gap-2">
          {allowUrlFallback && (
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setInputMode("upload")}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  inputMode === "upload"
                    ? "bg-indigo-600 text-white font-medium"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                آپلود از سیستم
              </button>
              <button
                type="button"
                onClick={() => setInputMode("url")}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  inputMode === "url"
                    ? "bg-indigo-600 text-white font-medium"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <LinkIcon className="w-3 h-3" />
                <span>لینک اینترنتی</span>
              </button>
            </div>
          )}

          {value && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-rose-500/10"
              title="حذف تصویر فعلی"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف تصویر</span>
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        id={uploaderId}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Main Upload Drop Area */}
      {inputMode === "upload" ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (!value) fileInputRef.current?.click();
          }}
          className={`relative rounded-2xl border-2 transition-all overflow-hidden ${getAspectRatioClass()} ${
            isDragging
              ? "border-indigo-500 bg-indigo-500/10 ring-4 ring-indigo-500/20"
              : displayError
              ? "border-rose-500/60 bg-rose-500/5"
              : value
              ? "border-slate-800 bg-slate-900/90"
              : "border-dashed border-slate-700/90 bg-slate-900/60 hover:border-indigo-500/80 hover:bg-slate-900/90 cursor-pointer"
          }`}
        >
          {value ? (
            /* Uploaded Image Preview */
            <div className="relative group w-full h-full min-h-[160px] flex items-center justify-center p-3">
              <img
                src={value}
                alt="تصویر بارگذاری شده"
                className="max-h-56 w-auto max-w-full rounded-xl object-contain shadow-md border border-slate-800"
                referrerPolicy="no-referrer"
              />

              {/* Hover actions overlay */}
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs flex items-center justify-center gap-3 p-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>تغییر تصویر از سیستم</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف</span>
                </button>
              </div>

              {/* Top info badge */}
              <div className="absolute top-3 right-3 bg-slate-950/80 border border-slate-700/80 text-[10px] text-slate-300 px-2.5 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>تصویر آماده است</span>
                {fileSizeStr && <span className="text-slate-400 font-mono">({fileSizeStr})</span>}
              </div>
            </div>
          ) : (
            /* Empty State / Dropzone */
            <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-3">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">
                  فایل تصویر را اینجا بکشید یا برای انتخاب کلیک کنید
                </p>
                <p className="text-xs text-slate-400">
                  فرمت‌های مجاز: PNG, JPG, WEBP, SVG (حداکثر {maxSizeMB} مگابایت)
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="mt-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border border-slate-700 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4 text-indigo-400" />
                <span>انتخاب فایل از سیستم</span>
              </button>
            </div>
          )}

          {/* Loading Spinner */}
          {isProcessing && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5 z-10">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium text-indigo-300">در حال بهینه‌سازی و بارگذاری تصویر...</span>
            </div>
          )}
        </div>
      ) : (
        /* Direct URL Input fallback mode */
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              dir="ltr"
              className="flex-1 text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors cursor-pointer shrink-0"
            >
              اعمال لینک اینترنتی
            </button>
          </div>

          {value && (
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <img
                src={value}
                alt="URL Preview"
                className="w-14 h-14 rounded-lg object-cover border border-slate-700"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0 text-xs">
                <span className="text-slate-400 block truncate font-mono text-[11px]">{value}</span>
                <span className="text-emerald-400 text-[10px] mt-0.5 inline-block">لینک تصویر متصل است</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Presets (if provided) */}
      {presets.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>تصاویر پیشنهادی آماده:</span>
          </span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetSelect(preset.url, preset.label)}
              className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer border border-slate-800 hover:border-slate-700"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Error or Helper text */}
      {displayError ? (
        <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{displayError}</span>
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export default ImageUploader;
