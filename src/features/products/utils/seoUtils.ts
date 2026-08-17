import type { ProductSeoData } from "@/types/product";

/**
 * Convert any string (Persian/English/Mixed) to a clean, URL-friendly slug
 */
export function slugify(text: string): string {
  if (!text) return "";

  return text
    .toString()
    .trim()
    .toLowerCase()
    // Replace spaces and underscores with dashes
    .replace(/[\s_]+/g, "-")
    // Remove unwanted punctuation, brackets, quotes, etc. (Preserving Persian letters, numbers and English letters)
    .replace(/[^\u0600-\u06FF\u0750-\u077Fa-z0-9\-]/g, "")
    // Remove multiple consecutive dashes
    .replace(/-+/g, "-")
    // Remove leading and trailing dashes
    .replace(/^-+|-+$/g, "");
}

export interface SeoCheckItem {
  id: string;
  title: string;
  description: string;
  passed: boolean;
  score: number;
  maxScore: number;
  impact: "high" | "medium" | "low";
}

export interface SeoAuditResult {
  score: number; // 0 - 100
  status: "good" | "needs_improvement" | "poor";
  statusLabel: string;
  statusColor: string;
  checklist: SeoCheckItem[];
  tips: string[];
}

/**
 * Calculate SEO Health Score and detailed checklist
 */
export function calculateSeoScore(
  seo: Partial<ProductSeoData> | undefined,
  productTitle: string,
  productDescription: string = "",
  productImage: string = ""
): SeoAuditResult {
  const effectiveTitle = (seo?.metaTitle || productTitle || "").trim();
  const effectiveDescription = (seo?.metaDescription || productDescription || "").trim();
  const effectiveSlug = (seo?.slug || slugify(productTitle) || "").trim();
  const keywords = seo?.focusKeywords || [];
  const primaryKeyword = keywords[0]?.trim().toLowerCase() || "";

  const checklist: SeoCheckItem[] = [];

  // 1. Slug check (Max 15 pts)
  const isSlugValid = effectiveSlug.length >= 3 && !/\s/.test(effectiveSlug);
  checklist.push({
    id: "slug_format",
    title: "ساختار استاندارد اسلاگ (Slug)",
    description: isSlugValid
      ? `اسلاگ ساختار معتبر و مناسبی دارد (${effectiveSlug.length} کاراکتر)`
      : "اسلاگ خالی است یا کمتر از ۳ کاراکتر دارد.",
    passed: isSlugValid,
    score: isSlugValid ? 15 : 0,
    maxScore: 15,
    impact: "high",
  });

  // 2. Meta Title Length check (Max 20 pts)
  // Optimal: 30 to 60 characters
  const titleLen = effectiveTitle.length;
  let titleScore = 0;
  let titleMsg = "";
  if (titleLen >= 30 && titleLen <= 60) {
    titleScore = 20;
    titleMsg = `طول عنوان در بازه بهینه و استاندارد است (${titleLen} از ۶۰ کاراکتر)`;
  } else if (titleLen > 0 && titleLen < 30) {
    titleScore = 10;
    titleMsg = `عنوان کمی کوتاه است (${titleLen} کاراکتر). توصیه: بین ۳۰ تا ۶۰ کاراکتر`;
  } else if (titleLen > 60) {
    titleScore = 8;
    titleMsg = `عنوان طولانی است (${titleLen} کاراکتر) و در نتایج گوگل کوتاه خواهد شد.`;
  } else {
    titleScore = 0;
    titleMsg = "عنوان سئو وارد نشده است.";
  }
  checklist.push({
    id: "title_length",
    title: "طول بهینه عنوان سئو (Meta Title)",
    description: titleMsg,
    passed: titleScore === 20,
    score: titleScore,
    maxScore: 20,
    impact: "high",
  });

  // 3. Meta Description Length check (Max 20 pts)
  // Optimal: 110 to 160 characters
  const descLen = effectiveDescription.length;
  let descScore = 0;
  let descMsg = "";
  if (descLen >= 100 && descLen <= 160) {
    descScore = 20;
    descMsg = `طول متادسکریپشن در بازه عالی است (${descLen} از ۱۶۰ کاراکتر)`;
  } else if (descLen >= 40 && descLen < 100) {
    descScore = 12;
    descMsg = `توضیحات کوتاه است (${descLen} کاراکتر). توصیه: بین ۱۱۰ تا ۱۶۰ کاراکتر`;
  } else if (descLen > 160) {
    descScore = 8;
    descMsg = `توضیحات طولانی است (${descLen} کاراکتر) و در نتایج گوگل کوتاه خواهد شد.`;
  } else {
    descScore = 0;
    descMsg = "توضیحات سئو وارد نشده است.";
  }
  checklist.push({
    id: "desc_length",
    title: "طول مناسب توضیحات سئو (Meta Description)",
    description: descMsg,
    passed: descScore === 20,
    score: descScore,
    maxScore: 20,
    impact: "high",
  });

  // 4. Focus Keywords count (Max 15 pts)
  const hasKeywords = keywords.length > 0;
  checklist.push({
    id: "keywords_present",
    title: "تعریف کلمات کلیدی هدف (Focus Keywords)",
    description: hasKeywords
      ? `${keywords.length} کلمه کلیدی هدف برای محصول ثبت شده است.`
      : "حداقل یک کلمه کلیدی هدف برای رتبه‌گیری در جستجو وارد کنید.",
    passed: hasKeywords,
    score: keywords.length >= 2 ? 15 : hasKeywords ? 10 : 0,
    maxScore: 15,
    impact: "high",
  });

  // 5. Keyword in Meta Title (Max 15 pts)
  const keywordInTitle = primaryKeyword
    ? effectiveTitle.toLowerCase().includes(primaryKeyword)
    : false;
  checklist.push({
    id: "keyword_in_title",
    title: "حضور کلمه کلیدی در عنوان سئو",
    description: !primaryKeyword
      ? "ابتدا کلمه کلیدی هدف را مشخص کنید."
      : keywordInTitle
      ? `کلمه کلیدی «${primaryKeyword}» در عنوان محصول وجود دارد.`
      : `کلمه کلیدی «${primaryKeyword}» در عنوان سئو یافت نشد.`,
    passed: keywordInTitle,
    score: keywordInTitle ? 15 : 0,
    maxScore: 15,
    impact: "medium",
  });

  // 6. Keyword in Meta Description (Max 10 pts)
  const keywordInDesc = primaryKeyword
    ? effectiveDescription.toLowerCase().includes(primaryKeyword)
    : false;
  checklist.push({
    id: "keyword_in_desc",
    title: "حضور کلمه کلیدی در توضیحات متاتگ",
    description: !primaryKeyword
      ? "ابتدا کلمه کلیدی هدف را مشخص کنید."
      : keywordInDesc
      ? `کلمه کلیدی «${primaryKeyword}» در توضیحات سئو تکرار شده است.`
      : `کلمه کلیدی «${primaryKeyword}» در توضیحات وجود ندارد.`,
    passed: keywordInDesc,
    score: keywordInDesc ? 10 : 0,
    maxScore: 10,
    impact: "medium",
  });

  // 7. OpenGraph Social Image (Max 5 pts)
  const hasOgImage = Boolean(seo?.ogImage || productImage);
  checklist.push({
    id: "og_image",
    title: "تصویر شبکه‌های اجتماعی (OpenGraph)",
    description: hasOgImage
      ? "تصویر کارت اشتراک‌گذاری در شبکه‌های اجتماعی تنظیم شده است."
      : "تصویر مناسب برای کارت اشتراک‌گذاری تعیین نشده است.",
    passed: hasOgImage,
    score: hasOgImage ? 5 : 0,
    maxScore: 5,
    impact: "low",
  });

  // Calculate Total Score
  const totalScore = checklist.reduce((acc, item) => acc + item.score, 0);

  // Status and Tips
  let status: "good" | "needs_improvement" | "poor" = "poor";
  let statusLabel = "ضعیف";
  let statusColor = "text-rose-400 bg-rose-950/60 border-rose-500/30";

  if (totalScore >= 80) {
    status = "good";
    statusLabel = "عالی (Good)";
    statusColor = "text-emerald-400 bg-emerald-950/60 border-emerald-500/30";
  } else if (totalScore >= 50) {
    status = "needs_improvement";
    statusLabel = "نیازمند بهبود (Needs Improvement)";
    statusColor = "text-amber-400 bg-amber-950/60 border-amber-500/30";
  } else {
    status = "poor";
    statusLabel = "ضعیف (Poor)";
    statusColor = "text-rose-400 bg-rose-950/60 border-rose-500/30";
  }

  const tips: string[] = [];
  if (!isSlugValid) tips.push("اسلاگ URL کوتاه و با خط‌تیره بسازید.");
  if (titleLen < 30 || titleLen > 60) tips.push("طول عنوان سئو را بین ۳۰ تا ۶۰ کاراکتر تنظیم کنید.");
  if (descLen < 100 || descLen > 160) tips.push("توضیحات سئو را بین ۱۱۰ تا ۱۶۰ کاراکتر بنویسید.");
  if (!hasKeywords) tips.push("حداقل یک کلمه کلیدی اصلی اضافه کنید.");
  else if (!keywordInTitle) tips.push(`کلمه کلیدی «${primaryKeyword}» را در عنوان سئو قرار دهید.`);

  return {
    score: totalScore,
    status,
    statusLabel,
    statusColor,
    checklist,
    tips,
  };
}

/**
 * Generate default SEO metadata based on basic product fields
 */
export function generateDefaultSeo(
  title: string = "",
  description: string = "",
  image: string = ""
): ProductSeoData {
  const generatedSlug = slugify(title);
  const cleanTitle = title.trim();
  const metaTitle = cleanTitle ? `${cleanTitle} | فروشگاه داینوا` : "";
  const metaDescription = description.trim()
    ? description.trim().substring(0, 155)
    : cleanTitle
    ? `خرید آنلاین ${cleanTitle} با بهترین قیمت، ضمانت اصالت کالا و ارسال سریع از فروشگاه اینترنتی داینوا.`
    : "";

  return {
    metaTitle: metaTitle.substring(0, 60),
    metaDescription: metaDescription.substring(0, 160),
    slug: generatedSlug,
    canonicalUrl: generatedSlug ? `https://dynova.store/products/${generatedSlug}` : "",
    focusKeywords: cleanTitle ? [cleanTitle.split(" ")[0], cleanTitle.split(" ").slice(0, 2).join(" ")].filter(Boolean) : [],
    ogImage: image || "",
    noIndex: false,
  };
}
