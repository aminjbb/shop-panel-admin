import React, { useState, useMemo } from "react";
import type { ProductSeoData } from "@/types/product";
import {
  slugify,
  calculateSeoScore,
} from "../utils/seoUtils";
import ETextField from "@/shared-app/designSystem/textField";
import ImageUploader from "@/shared-app/designSystem/imageUploader";
import { ESwitch } from "@/shared-app/designSystem/switch";
import {
  Globe,
  Search,
  Sparkles,
  RefreshCw,
  Tag,
  Plus,
  X,
  Smartphone,
  Monitor,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  Image as ImageIcon,
  ShieldAlert,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

export interface ProductSeoOptimizerProps {
  seo: ProductSeoData;
  productTitle: string;
  productDescription?: string;
  productImage?: string;
  onChange: (updatedSeo: ProductSeoData) => void;
  className?: string;
}

export const ProductSeoOptimizer: React.FC<ProductSeoOptimizerProps> = ({
  seo,
  productTitle,
  productDescription = "",
  productImage = "",
  onChange,
  className = "",
}) => {
  const [serpViewMode, setSerpViewMode] = useState<"desktop" | "mobile">("desktop");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState<boolean>(false);
  const [keywordInput, setKeywordInput] = useState<string>("");

  // Calculate SEO Health Score & checklist dynamically
  const audit = useMemo(() => {
    return calculateSeoScore(seo, productTitle, productDescription, productImage);
  }, [seo, productTitle, productDescription, productImage]);

  // Derived effective values for display
  const effectiveTitle = seo.metaTitle.trim() || productTitle.trim() || "عنوان محصول در فروشگاه داینوا";
  const effectiveDescription =
    seo.metaDescription.trim() ||
    productDescription.trim() ||
    "خرید اینترنتی انواع کالاهای اصل با ضمانت کیفیت، بهترین قیمت بازار و ارسال سریع در فروشگاه داینوا.";
  const effectiveSlug = seo.slug.trim() || slugify(productTitle) || "product-slug";

  // Slug Handlers
  const handleSlugChange = (val: string) => {
    const formatted = slugify(val);
    const updatedCanonical = seo.canonicalUrl?.startsWith("https://dynova.store/products/")
      ? `https://dynova.store/products/${formatted}`
      : seo.canonicalUrl;

    onChange({
      ...seo,
      slug: formatted,
      canonicalUrl: updatedCanonical,
    });
  };

  const handleRegenerateSlug = () => {
    const newSlug = slugify(productTitle);
    onChange({
      ...seo,
      slug: newSlug,
      canonicalUrl: `https://dynova.store/products/${newSlug}`,
    });
  };

  // Meta Title Handlers
  const handleTitleChange = (val: string) => {
    onChange({
      ...seo,
      metaTitle: val,
    });
  };

  const handleUseProductTitle = () => {
    const suggested = productTitle.trim() ? `${productTitle.trim()} | داینوا` : "";
    onChange({
      ...seo,
      metaTitle: suggested.substring(0, 60),
    });
  };

  // Meta Description Handlers
  const handleDescriptionChange = (val: string) => {
    onChange({
      ...seo,
      metaDescription: val,
    });
  };

  const handleUseProductDescription = () => {
    const suggested = productDescription.trim() || `خرید ${productTitle} با تضمین بهترین قیمت و کیفیت در فروشگاه آنلاین داینوا.`;
    onChange({
      ...seo,
      metaDescription: suggested.substring(0, 160),
    });
  };

  // Keywords Handlers
  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim().replace(/^[,\s]+|[,\s]+$/g, "");
    if (!trimmed) return;

    if (!seo.focusKeywords.includes(trimmed)) {
      onChange({
        ...seo,
        focusKeywords: [...seo.focusKeywords, trimmed],
      });
    }
    setKeywordInput("");
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    onChange({
      ...seo,
      focusKeywords: seo.focusKeywords.filter((kw) => kw !== kwToRemove),
    });
  };

  // Suggested keywords based on title
  const suggestedKeywords = useMemo(() => {
    if (!productTitle) return [];
    const words = productTitle
      .split(/[\s\-_\/]+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 2);
    const existing = new Set(seo.focusKeywords.map((k) => k.toLowerCase()));
    return words.filter((w) => !existing.has(w.toLowerCase())).slice(0, 4);
  }, [productTitle, seo.focusKeywords]);

  // Character counter colors helper
  const getTitleCounterColor = (len: number) => {
    if (len === 0) return "text-slate-500";
    if (len >= 30 && len <= 60) return "text-emerald-400 font-bold";
    if (len < 30) return "text-amber-400";
    return "text-rose-400 font-bold";
  };

  const getDescCounterColor = (len: number) => {
    if (len === 0) return "text-slate-500";
    if (len >= 100 && len <= 160) return "text-emerald-400 font-bold";
    if (len < 100) return "text-amber-400";
    return "text-rose-400 font-bold";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. SEO Health Score & Live SERP Preview Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* SEO Score Card */}
        <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>شاخص سلامت سئو (SEO Score)</span>
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${audit.statusColor}`}
              >
                {audit.statusLabel}
              </span>
            </div>

            {/* Score Bar & Numeric Display */}
            <div className="mt-4 flex items-center gap-3">
              <div className="text-3xl font-black font-mono tracking-tight text-white">
                {audit.score}
                <span className="text-xs font-normal text-slate-500 font-sans mr-1">/ ۱۰۰</span>
              </div>

              <div className="flex-1 space-y-1">
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      audit.score >= 80
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                        : audit.score >= 50
                        ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                        : "bg-gradient-to-r from-rose-600 to-rose-400"
                    }`}
                    style={{ width: `${Math.max(5, audit.score)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>ضعیف</span>
                  <span>متوسط</span>
                  <span>عالی</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick tips & expandable checklist trigger */}
          <div className="space-y-2 pt-3 border-t border-slate-850">
            {audit.tips.length > 0 && (
              <p className="text-[11px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>پیشنهاد ارتقا:</strong> {audit.tips[0]}
                </span>
              </p>
            )}

            <button
              type="button"
              onClick={() => setIsChecklistOpen(!isChecklistOpen)}
              className="w-full py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-indigo-300 text-xs font-medium border border-slate-800 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>مشاهده چک‌لیست ({audit.checklist.filter((c) => c.passed).length}/{audit.checklist.length} معیار)</span>
              {isChecklistOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Google SERP Snippet Preview */}
        <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                <Search className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-200">
                پیش‌نمایش زنده در نتایج جستجوی گوگل (Google SERP Snippet)
              </span>
            </div>

            {/* View Mode Toggle (Desktop / Mobile) */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSerpViewMode("desktop")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  serpViewMode === "desktop"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>دسکتاپ</span>
              </button>
              <button
                type="button"
                onClick={() => setSerpViewMode("mobile")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  serpViewMode === "mobile"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>موبایل</span>
              </button>
            </div>
          </div>

          {/* Google SERP Card Container */}
          <div
            className={`transition-all duration-300 mx-auto ${
              serpViewMode === "mobile" ? "max-w-sm" : "w-full"
            }`}
          >
            <div
              className={`p-4 rounded-2xl border transition-all ${
                seo.noIndex
                  ? "bg-rose-950/20 border-rose-500/40 relative"
                  : "bg-white text-slate-900 border-slate-200 shadow-sm"
              }`}
              dir="ltr"
            >
              {seo.noIndex && (
                <div className="mb-2.5 p-2 rounded-lg bg-rose-950/80 border border-rose-500/50 text-[11px] text-rose-300 flex items-center gap-1.5 font-sans" dir="rtl">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>این صفحه NoIndex است و در نتایج گوگل نمایش داده نخواهد شد.</span>
                </div>
              )}

              {/* Breadcrumb Header */}
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0">
                  <Globe className="w-3 h-3 text-slate-600" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-medium text-[#202124] leading-tight truncate">
                    فروشگاه اینترنتی داینوا
                  </span>
                  <span className="text-[11px] text-[#4d5156] truncate font-mono">
                    https://dynova.store › products › {effectiveSlug}
                  </span>
                </div>
              </div>

              {/* Title Link */}
              <div className="mb-1.5">
                <h3 className="text-[16px] sm:text-[18px] text-[#1a0dab] hover:underline font-medium cursor-pointer leading-snug line-clamp-1">
                  {effectiveTitle}
                </h3>
              </div>

              {/* Description */}
              <p className="text-[12px] sm:text-[13px] text-[#4d5156] leading-relaxed line-clamp-2">
                {effectiveDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Checklist Details */}
      {isChecklistOpen && (
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>چک‌لیست فاکتورهای سئو محصول</span>
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              امتیاز کل: {audit.score} از ۱۰۰
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {audit.checklist.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                  item.passed
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                    : "bg-slate-900/60 border-slate-800 text-slate-400"
                }`}
              >
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-200 truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.score}/{item.maxScore}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SEO Form Fields */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-5">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-800">
          <Globe className="w-4 h-4 text-indigo-400" />
          <span>فیلدهای متادیتا و متاتگ‌های سئو</span>
        </h4>

        {/* Slug Field with Auto-Slug Logic */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <span>نامک یکتای پیوند یکتا (Slug URL):</span>
            </label>

            <button
              type="button"
              onClick={handleRegenerateSlug}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
              title="تولید مجدد اسلاگ از روی عنوان محصول"
            >
              <RefreshCw className="w-3 h-3" />
              <span>تولید خودکار از عنوان</span>
            </button>
          </div>

          <div className="relative">
            <ETextField
              value={seo.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="مثال: nike-air-zoom-pegasus"
              className="font-mono text-left text-xs"
              dir="ltr"
              leftIcon={<LinkIcon className="w-4 h-4 text-slate-500" />}
              helperText={`آدرس کامل محصول: https://dynova.store/products/${seo.slug || "..."}`}
            />
          </div>
        </div>

        {/* Meta Title Field with Live Character Counter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300">
              عنوان سئو (Meta Title):
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleUseProductTitle}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                استفاده از عنوان کالا
              </button>

              <span className={`text-xs font-mono ${getTitleCounterColor(seo.metaTitle.length)}`}>
                {seo.metaTitle.length} / ۶۰ کاراکتر
                {seo.metaTitle.length >= 30 && seo.metaTitle.length <= 60 && " (بهینه)"}
                {seo.metaTitle.length > 60 && " (طولانی)"}
              </span>
            </div>
          </div>

          <ETextField
            value={seo.metaTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder={productTitle ? `${productTitle} | فروشگاه داینوا` : "عنوان صفحه محصول در نتایج گوگل..."}
            maxLength={75}
            helperText="توصیه سئو: بین ۵۰ تا ۶۰ کاراکتر. در صورت خالی بودن، عنوان کالا در نظر گرفته می‌شود."
          />
        </div>

        {/* Meta Description Field with Live Counter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300">
              توضیحات سئو (Meta Description):
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleUseProductDescription}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                تولید از توضیحات کالا
              </button>

              <span className={`text-xs font-mono ${getDescCounterColor(seo.metaDescription.length)}`}>
                {seo.metaDescription.length} / ۱۶۰ کاراکتر
                {seo.metaDescription.length >= 100 && seo.metaDescription.length <= 160 && " (بهینه)"}
                {seo.metaDescription.length > 160 && " (طولانی)"}
              </span>
            </div>
          </div>

          <ETextField
            multiline
            rows={3}
            value={seo.metaDescription}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="توضیح کوتاه و جذاب برای تشویق کاربران به کلیک در نتایج جستجوی گوگل..."
            maxLength={180}
            helperText="توصیه سئو: بین ۱۲۰ تا ۱۶۰ کاراکتر حاوی کلمات کلیدی هدف و ارزش پیشنهادی خرید."
          />
        </div>

        {/* Focus Keywords Tag Input Component */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              <span>کلمات کلیدی هدف (Focus Keywords):</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {seo.focusKeywords.length} کلمه کلیدی
            </span>
          </div>

          {/* Keywords Chips */}
          <div className="flex items-center gap-1.5 flex-wrap min-h-[36px] p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            {seo.focusKeywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs font-medium"
              >
                <span>{kw}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                  title="حذف کلمه کلیدی"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Keyword Input */}
            <div className="flex items-center gap-1 flex-1 min-w-[140px]">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
                placeholder="تایپ کلمه کلیدی و فشردن Enter..."
                className="w-full bg-transparent border-none text-xs text-slate-200 placeholder-slate-500 focus:outline-none py-1 px-1.5"
              />
              {keywordInput.trim() && (
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="p-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Keyword Suggestions */}
          {suggestedKeywords.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-400 pt-1">
              <span>پیشنهادهای هوشمند:</span>
              {suggestedKeywords.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => {
                    if (!seo.focusKeywords.includes(sug)) {
                      onChange({
                        ...seo,
                        focusKeywords: [...seo.focusKeywords, sug],
                      });
                    }
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                >
                  + {sug}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Advanced SEO Accordion (Canonical, OpenGraph, NoIndex) */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="w-full p-4 flex items-center justify-between bg-slate-900/40 hover:bg-slate-900/80 transition-colors text-start cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-200">
              تنظیمات پیشرفته سئو (Canonical URL، تصویر OpenGraph، وضعیت NoIndex)
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs">
            {isAdvancedOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {isAdvancedOpen && (
          <div className="p-4 sm:p-5 border-t border-slate-800 space-y-4">
            {/* Canonical URL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  آدرس مرجع کنونیکال (Canonical URL):
                </label>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...seo,
                      canonicalUrl: `https://dynova.store/products/${seo.slug || slugify(productTitle)}`,
                    })
                  }
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  تنظیم پیش‌فرض
                </button>
              </div>

              <ETextField
                value={seo.canonicalUrl || ""}
                onChange={(e) =>
                  onChange({
                    ...seo,
                    canonicalUrl: e.target.value,
                  })
                }
                placeholder={`https://dynova.store/products/${seo.slug || "slug"}`}
                className="font-mono text-left text-xs"
                dir="ltr"
                leftIcon={<LinkIcon className="w-4 h-4 text-slate-500" />}
                helperText="جهت جلوگیری از محتوای تکراری در صورت وجود چند آدرس مختلف برای این محصول."
              />
            </div>

            {/* OpenGraph Image URL / Uploader */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  تصویر کارت اشتراک‌گذاری شبکه‌های اجتماعی (OG Image):
                </label>
                {productImage && (
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...seo,
                        ogImage: productImage,
                      })
                    }
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    استفاده از عکس اصلی محصول
                  </button>
                )}
              </div>

              <ImageUploader
                value={seo.ogImage || ""}
                onChange={(val) =>
                  onChange({
                    ...seo,
                    ogImage: val,
                  })
                }
                variant="compact"
                helperText="تصویر ۱۲۰۰×۶۳۰ برای نمایش بهینه در اشتراک‌گذاری تلگرام، واتساپ و لینکدین"
              />
            </div>

            {/* NoIndex Toggle */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  غیرفعال‌سازی ایندکس کالا در موتورهای جستجو (NoIndex):
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  با فعال کردن این گزینه، برچسب <code className="text-indigo-300 font-mono">noindex, nofollow</code> به صفحه اضافه شده و محصول از نتایج گوگل حذف می‌شود.
                </p>
              </div>

              <ESwitch
                checked={seo.noIndex}
                onCheckedChange={(checked) =>
                  onChange({
                    ...seo,
                    noIndex: checked,
                  })
                }
                activeLabel="NoIndex"
                inActiveLabel="Indexable"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSeoOptimizer;
