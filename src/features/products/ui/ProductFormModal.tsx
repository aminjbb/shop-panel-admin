import React, { useState, useEffect, useMemo } from "react";
import type {
  Product,
  ProductCategory,
  ProductFormData,
  ProductFormErrors,
  ProductVariant,
  ProductSeoData,
} from "@/types/product";
import { PRODUCT_CATEGORIES } from "../api/mockProductService";
import { mockCategoryService } from "@/features/categories/api/mockCategoryService";
import BottomSheet from "@/shared-app/bottomSheet";
import ETextField from "@/shared-app/designSystem/textField";
import ESelect from "@/shared-app/designSystem/select";
import EButton from "@/shared-app/designSystem/button";
import ProductVariantManager from "./ProductVariantManager";
import ProductSeoOptimizer from "./ProductSeoOptimizer";
import { generateDefaultSeo, slugify, calculateSeoScore } from "../utils/seoUtils";
import { Package, Save, Sparkles, Image as ImageIcon, Globe, Layers } from "lucide-react";

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (formData: ProductFormData, editId?: string) => Promise<void>;
  isLoading?: boolean;
}

const DEFAULT_IMAGE_OPTIONS = [
  { label: "هدفون داینوا", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80" },
  { label: "ساعت هوشمند", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80" },
  { label: "کیبورد مکانیکال", url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80" },
  { label: "پوشاک هودی", url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80" },
  { label: "لوازم خانگی", url: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&auto=format&fit=crop&q=80" },
  { label: "کوله پشتی", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80" },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
  isLoading = false,
}) => {
  const isEditing = Boolean(product);
  const [activeTab, setActiveTab] = useState<"general" | "seo">("general");

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    sku: "",
    category: "electronics",
    price: 0,
    costPrice: 0,
    image: DEFAULT_IMAGE_OPTIONS[0].url,
    description: "",
    variants: [],
    seo: generateDefaultSeo("", "", DEFAULT_IMAGE_OPTIONS[0].url),
  });

  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [isSlugManuallyModified, setIsSlugManuallyModified] = useState(false);

  // Sync form data when editing product changes or modal opens
  useEffect(() => {
    if (product) {
      const productSeo = product.seo || generateDefaultSeo(product.title, product.description, product.image);
      setFormData({
        title: product.title,
        sku: product.sku,
        category: product.category,
        price: product.price,
        costPrice: product.costPrice || 0,
        image: product.image,
        description: product.description || "",
        variants: product.variants ? [...product.variants] : [],
        seo: productSeo,
      });
      setIsSlugManuallyModified(true); // Existing products retain their custom slug
    } else {
      const initSku = `DYN-PRD-${Math.floor(100 + Math.random() * 900)}`;
      const defaultSeo = generateDefaultSeo("", "", DEFAULT_IMAGE_OPTIONS[0].url);
      setFormData({
        title: "",
        sku: initSku,
        category: "electronics",
        price: 1500000,
        costPrice: 1000000,
        image: DEFAULT_IMAGE_OPTIONS[0].url,
        description: "",
        variants: [
          {
            id: `var-init-1`,
            name: "سایز استاندارد / مشکی",
            sku: `${initSku}-DEF`,
            price: 1500000,
            stock: 12,
          },
        ],
        seo: defaultSeo,
      });
      setIsSlugManuallyModified(false);
    }
    setActiveTab("general");
    setErrors({});
  }, [product, isOpen]);

  // Real-time SEO audit score for Tab badge
  const currentSeoAudit = useMemo(() => {
    return calculateSeoScore(
      formData.seo,
      formData.title,
      formData.description,
      formData.image
    );
  }, [formData.seo, formData.title, formData.description, formData.image]);

  const handleTitleChange = (newTitle: string) => {
    setFormData((prev) => {
      let updatedSeo = { ...prev.seo };

      // If slug has not been manually customized, auto-update slug & canonical
      if (!isSlugManuallyModified) {
        const autoSlug = slugify(newTitle);
        updatedSeo = {
          ...updatedSeo,
          slug: autoSlug,
          canonicalUrl: autoSlug ? `https://dynova.store/products/${autoSlug}` : "",
        };
      }

      // If metaTitle was empty or matches old pattern, sync it
      if (!prev.seo.metaTitle || prev.seo.metaTitle.endsWith(" | فروشگاه داینوا") || prev.seo.metaTitle.endsWith(" | داینوا")) {
        updatedSeo.metaTitle = newTitle.trim() ? `${newTitle.trim()} | فروشگاه داینوا`.substring(0, 60) : "";
      }

      return {
        ...prev,
        title: newTitle,
        seo: updatedSeo,
      };
    });

    if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
  };

  const handleSeoChange = (updatedSeo: ProductSeoData) => {
    setIsSlugManuallyModified(true);
    setFormData((prev) => ({
      ...prev,
      seo: updatedSeo,
    }));
  };

  const validate = (): boolean => {
    const errs: ProductFormErrors = {};

    if (!formData.title.trim() || formData.title.trim().length < 3) {
      errs.title = "عنوان محصول باید حداقل ۳ کاراکتر باشد.";
    }

    if (!formData.sku.trim() || formData.sku.trim().length < 3) {
      errs.sku = "کد شناسایی SKU الزامی است.";
    }

    if (!formData.price || formData.price <= 0) {
      errs.price = "قیمت پایه محصول باید بزرگتر از صفر باشد.";
    }

    if (!formData.image.trim()) {
      errs.image = "آدرس تصویر محصول را وارد کنید.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) {
      setActiveTab("general");
      return;
    }

    try {
      // Ensure slug is populated
      const finalizedSeo: ProductSeoData = {
        ...formData.seo,
        slug: formData.seo.slug.trim() || slugify(formData.title),
        metaTitle: formData.seo.metaTitle.trim() || `${formData.title} | داینوا`.substring(0, 60),
        metaDescription:
          formData.seo.metaDescription.trim() ||
          formData.description?.trim().substring(0, 160) ||
          `خرید آنلاین ${formData.title} با بهترین قیمت در داینوا.`,
      };

      await onSave({ ...formData, seo: finalizedSeo }, product?.id);
    } catch {
      // Error handled in hook
    }
  };

  const [categoryOptions, setCategoryOptions] = useState<Array<{ value: string; label: string }>>(
    PRODUCT_CATEGORIES.map((c) => ({ value: c.id, label: c.label }))
  );

  useEffect(() => {
    if (isOpen) {
      mockCategoryService
        .getCategories({ status: "active" })
        .then((cats) => {
          if (cats && cats.length > 0) {
            setCategoryOptions(
              cats.map((c) => ({
                value: c.slug || c.id,
                label: `${c.parentId ? "↳ " : ""}${c.name}`,
              }))
            );
          }
        })
        .catch(() => {
          // fallback to PRODUCT_CATEGORIES
        });
    }
  }, [isOpen]);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <span>{isEditing ? "ویرایش مشخصات کالا" : "ثبت محصول جدید در کاتالوگ"}</span>
        </div>
      }
      subtitle={
        isEditing
          ? `ویرایش اطلاعات، قیمت‌گذاری، سطوح انبار و تنظیمات متادیتا برای «${product?.title}»`
          : "مشخصات پایه، قیمت، واریانت‌ها و بهینه‌سازی متاتگ‌های سئو را مدیریت کنید."
      }
      footer={
        <div className="flex items-center justify-between gap-3 flex-wrap w-full">
          {/* SEO Score mini indicator in footer */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">امتیاز سئو:</span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full border ${currentSeoAudit.statusColor}`}
            >
              {currentSeoAudit.score}/۱۰۰ ({currentSeoAudit.statusLabel})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <EButton
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs"
            >
              انصراف
            </EButton>

            <EButton
              variant="primary"
              size="md"
              onClick={() => handleSubmit()}
              isLoading={isLoading}
              className="text-xs font-bold px-6"
              icon={<Save className="w-4 h-4" />}
            >
              {isEditing ? "ذخیره تغییرات" : "ایجاد و درج در کاتالوگ"}
            </EButton>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Navigation Tabs (General Info vs SEO & Metadata Optimizer) */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "general"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>مشخصات عمومی و تنوع کالا</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("seo")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "seo"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>بهینه‌سازی سئو و متادیتا (SEO & SERP)</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                activeTab === "seo"
                  ? "bg-indigo-700/80 border-indigo-400 text-white"
                  : currentSeoAudit.statusColor
              }`}
            >
              {currentSeoAudit.score}%
            </span>
          </button>
        </div>

        {/* Tab 1: General Info, Pricing, Images, Descriptions & Variants */}
        {activeTab === "general" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Section 1: Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <ETextField
                  label="عنوان کامل محصول"
                  required
                  placeholder="مثال: هدفون بی‌سیم نویز کنسلینگ داینوا پرو"
                  value={formData.title}
                  onValueChange={handleTitleChange}
                  error={Boolean(errors.title)}
                  helperText={errors.title}
                />

                {/* SKU */}
                <ETextField
                  label="شناسه کالا (SKU Code)"
                  required
                  placeholder="مثال: DYN-AUD-001"
                  value={formData.sku}
                  onValueChange={(val) => {
                    setFormData((p) => ({ ...p, sku: val }));
                    if (errors.sku) setErrors((p) => ({ ...p, sku: undefined }));
                  }}
                  error={Boolean(errors.sku)}
                  helperText={errors.sku}
                  className="font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category */}
                <ESelect
                  label="دسته‌بندی"
                  required
                  value={formData.category}
                  onValueChange={(val) =>
                    setFormData((p) => ({ ...p, category: val as ProductCategory }))
                  }
                  options={categoryOptions}
                />

                {/* Base Price */}
                <ETextField
                  label="قیمت فروش پایه (تومان)"
                  required
                  type="number"
                  inputMode="numeric"
                  placeholder="مثال: 4500000"
                  value={formData.price?.toString() || ""}
                  onValueChange={(val) => {
                    const num = Number(val) || 0;
                    setFormData((p) => ({ ...p, price: num }));
                    if (errors.price) setErrors((p) => ({ ...p, price: undefined }));
                  }}
                  error={Boolean(errors.price)}
                  helperText={errors.price}
                />

                {/* Cost Price */}
                <ETextField
                  label="قیمت تمام‌شده / خرید (اختیاری)"
                  type="number"
                  inputMode="numeric"
                  placeholder="مثال: 3200000"
                  value={formData.costPrice?.toString() || ""}
                  onValueChange={(val) =>
                    setFormData((p) => ({ ...p, costPrice: Number(val) || 0 }))
                  }
                />
              </div>
            </div>

            {/* Section 2: Image & Description */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                {/* Image Preview & URL */}
                <div className="sm:col-span-2 space-y-2">
                  <ETextField
                    label="آدرس اینترنتی تصویر محصول (Image URL)"
                    required
                    placeholder="https://..."
                    value={formData.image}
                    onValueChange={(val) =>
                      setFormData((p) => ({ ...p, image: val }))
                    }
                    error={Boolean(errors.image)}
                    helperText={errors.image}
                    leftIcon={<ImageIcon className="w-4 h-4" />}
                  />

                  {/* Quick Image Presets */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>انتخاب تصاویر آماده:</span>
                    </span>
                    {DEFAULT_IMAGE_OPTIONS.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, image: opt.url }))}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Thumbnail */}
                <div className="sm:col-span-1 flex flex-col items-center">
                  <span className="text-xs text-slate-400 mb-1.5 self-start">
                    پیش‌نمایش تصویر:
                  </span>
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
                    <img
                      src={formData.image}
                      alt="پیش‌نمایش"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <ETextField
                label="توضیحات و مشخصات فنی"
                multiline
                rows={2}
                placeholder="ویژگی‌های برجسته، مواد به کار رفته و کاربرد کالا..."
                value={formData.description}
                onValueChange={(val) =>
                  setFormData((p) => ({ ...p, description: val }))
                }
              />
            </div>

            {/* Section 3: Variants Manager */}
            <div className="pt-2 border-t border-slate-800">
              <ProductVariantManager
                variants={formData.variants}
                basePrice={formData.price}
                baseSku={formData.sku}
                onChange={(variants: ProductVariant[]) =>
                  setFormData((p) => ({ ...p, variants }))
                }
              />
            </div>
          </div>
        )}

        {/* Tab 2: SEO & Metadata Optimizer */}
        {activeTab === "seo" && (
          <div className="animate-in fade-in duration-200">
            <ProductSeoOptimizer
              seo={formData.seo}
              productTitle={formData.title}
              productDescription={formData.description}
              productImage={formData.image}
              onChange={handleSeoChange}
            />
          </div>
        )}
      </form>
    </BottomSheet>
  );
};

export default ProductFormModal;
