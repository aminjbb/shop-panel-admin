import React, { useState, useEffect } from "react";
import type {
  HomepageSection,
  HeroBannerSection,
  FlashDealsSection,
  ProductGridSection,
  BannerGridSection,
  BannerItem,
} from "@/types/homepage";
import type { Product } from "@/types/product";
import { getSectionMeta } from "./SectionTypeHelper";
import ProductPickerModal from "./ProductPickerModal";
import BottomSheet from "@/shared-app/bottomSheet";
import ETextField from "@/shared-app/designSystem/textField";
import EButton from "@/shared-app/designSystem/button";
import ImageUploader from "@/shared-app/designSystem/imageUploader";
import { ESwitch } from "@/shared-app/designSystem/switch";
import {
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  ShoppingBag,
  Clock,
  Flame,
  Layers,
  Sparkles,
  AlertCircle,
  Link as LinkIcon,
} from "lucide-react";

interface SectionConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: HomepageSection | null;
  onSave: (updatedSection: HomepageSection) => void;
  catalogProducts: Product[];
  isUpdating?: boolean;
}

// Preset banner images for rapid mockup configuration
const SAMPLE_BANNER_PRESETS = [
  {
    name: "لوازم دیجیتال و هدفون",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&auto=format&fit=crop&q=80",
  },
  {
    name: "ساعت هوشمند و اکسسوری",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&auto=format&fit=crop&q=80",
  },
  {
    name: "مد و پوشاک",
    url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1600&auto=format&fit=crop&q=80",
  },
  {
    name: "میز کار و لپ‌تاپ اداری",
    url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1600&auto=format&fit=crop&q=80",
  },
  {
    name: "قهوه‌ساز و لوازم خانگی",
    url: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=1600&auto=format&fit=crop&q=80",
  },
  {
    name: "آرایشی و بهداشتی",
    url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&auto=format&fit=crop&q=80",
  },
];

export const SectionConfigModal: React.FC<SectionConfigModalProps> = ({
  isOpen,
  onClose,
  section,
  onSave,
  catalogProducts,
  isUpdating = false,
}) => {
  const [formData, setFormData] = useState<HomepageSection | null>(null);
  const [isProductPickerOpen, setIsProductPickerOpen] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync state whenever section changes
  useEffect(() => {
    if (section) {
      setFormData(JSON.parse(JSON.stringify(section)));
      setFormError(null);
    }
  }, [section, isOpen]);

  if (!isOpen || !formData) return null;

  const meta = getSectionMeta(formData.type);

  // Handle General Base Fields
  const handleTitleChange = (val: string) => {
    setFormData((prev) => (prev ? { ...prev, title: val } : prev));
  };

  const handleActiveToggle = () => {
    setFormData((prev) => (prev ? { ...prev, isActive: !prev.isActive } : prev));
  };

  // --- Hero Banner Handlers ---
  const handleHeroIntervalChange = (val: number) => {
    setFormData((prev) => {
      if (!prev || prev.type !== "hero_banner") return prev;
      return { ...prev, autoSlideIntervalSeconds: val } as HeroBannerSection;
    });
  };

  const handleAddHeroSlide = () => {
    setFormData((prev) => {
      if (!prev || prev.type !== "hero_banner") return prev;
      const hero = prev as HeroBannerSection;
      const newBanner: BannerItem = {
        id: `banner-slide-${Date.now()}`,
        title: "اسلاید جدید بنر هیرو",
        subtitle: "توضیح تکمیلی درباره این پیشنهاد جذاب",
        imageUrl: SAMPLE_BANNER_PRESETS[0].url,
        linkUrl: "/products",
        buttonText: "مشاهده پیشنهاد",
      };
      return { ...hero, banners: [...hero.banners, newBanner] };
    });
  };

  const handleUpdateBannerItem = (
    index: number,
    field: keyof BannerItem,
    value: string
  ) => {
    setFormData((prev) => {
      if (!prev) return prev;
      if (
        prev.type === "hero_banner" ||
        prev.type === "banner_grid_2" ||
        prev.type === "banner_grid_3"
      ) {
        const banners = [...(prev as any).banners];
        banners[index] = { ...banners[index], [field]: value };
        return { ...prev, banners };
      }
      return prev;
    });
  };

  const handleDeleteBannerItem = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev;
      if (prev.type === "hero_banner") {
        const hero = prev as HeroBannerSection;
        if (hero.banners.length <= 1) {
          setFormError("اسلایدر هیرو باید حداقل دارای یک اسلاید باشد.");
          return prev;
        }
        const banners = hero.banners.filter((_, idx) => idx !== index);
        return { ...hero, banners };
      }
      return prev;
    });
  };

  // --- Flash Deals Handlers ---
  const handleEndDateTimeChange = (val: string) => {
    setFormData((prev) => {
      if (!prev || prev.type !== "flash_deals") return prev;
      return { ...prev, endDateTime: val } as FlashDealsSection;
    });
  };

  const handleDiscountPercentChange = (val: number) => {
    setFormData((prev) => {
      if (!prev || prev.type !== "flash_deals") return prev;
      return { ...prev, discountPercentBadge: val } as FlashDealsSection;
    });
  };

  // --- Product Grid Handlers ---
  const handleSubtitleChange = (val: string) => {
    setFormData((prev) => {
      if (!prev || prev.type !== "product_grid") return prev;
      return { ...prev, subtitle: val } as ProductGridSection;
    });
  };

  const handleViewAllLinkChange = (val: string) => {
    setFormData((prev) => {
      if (!prev || prev.type !== "product_grid") return prev;
      return { ...prev, viewAllLink: val } as ProductGridSection;
    });
  };

  // --- Product Selection Confirm ---
  const handleConfirmProducts = (productIds: string[]) => {
    setFormData((prev) => {
      if (!prev) return prev;
      if (prev.type === "flash_deals" || prev.type === "product_grid") {
        return { ...prev, productIds };
      }
      return prev;
    });
  };

  // Form Submit Validation
  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError("لطفاً عنوان سکشن را وارد نمایید.");
      return;
    }

    if (formData.type === "banner_grid_2") {
      const g2 = formData as BannerGridSection;
      if (!g2.banners || g2.banners.length !== 2) {
        setFormError("گرید ۲ ستونه باید دقیقاً شامل ۲ بنر باشد.");
        return;
      }
    } else if (formData.type === "banner_grid_3") {
      const g3 = formData as BannerGridSection;
      if (!g3.banners || g3.banners.length !== 3) {
        setFormError("گرید ۳ ستونه باید دقیقاً شامل ۳ بنر باشد.");
        return;
      }
    } else if (formData.type === "flash_deals" || formData.type === "product_grid") {
      const pCount = (formData as any).productIds?.length || 0;
      if (pCount === 0) {
        setFormError("حداقل یک محصول باید به این ردیف متصل باشد.");
        return;
      }
    }

    onSave(formData);
  };

  // Selected products details for preview inside modal
  const linkedProducts =
    formData.type === "flash_deals" || formData.type === "product_grid"
      ? catalogProducts.filter((p) =>
          (formData as any).productIds?.includes(p.id)
        )
      : [];

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        title={
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${meta.badgeBg} ${meta.badgeBorder}`}
            >
              {meta.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">
                  پیکربندی {formData.title}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}
                >
                  {meta.shortLabel}
                </span>
              </div>
            </div>
          </div>
        }
        subtitle={
          <span className="text-xs text-slate-400">
            شناسه یکتا: <span className="font-mono text-slate-300">{formData.id}</span>
          </span>
        }
        footer={
          <div className="flex items-center justify-between w-full">
            <EButton variant="outlined" size="sm" onClick={onClose}>
              انصراف
            </EButton>

            <EButton
              type="button"
              variant="primary"
              size="sm"
              onClick={handleFormSubmit}
              isLoading={isUpdating}
              icon={<Save className="w-4 h-4" />}
              className="shadow-lg shadow-indigo-600/30"
            >
              ذخیره تغییرات سکشن
            </EButton>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Error Alert */}
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1: General Info & Visibility */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>تنظیمات پایه و وضعیت انتشار</span>
              </h4>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">وضعیت در صفحه:</span>
                <ESwitch
                  checked={formData.isActive}
                  onCheckedChange={handleActiveToggle}
                  activeLabel="فعال"
                  inActiveLabel="غیرفعال"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                عنوان بخش در صفحه اصلی:
              </label>
              <ETextField
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="عنوان سکشن..."
              />
            </div>
          </div>

          {/* Section 2: Type Specific Fields */}

          {/* --- HERO BANNER CONFIG --- */}
          {formData.type === "hero_banner" && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>سرعت تغییر خودکار اسلایدها (ثانیه)</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    {[3, 5, 7, 10].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => handleHeroIntervalChange(sec)}
                        className={`px-3 py-1 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                          (formData as HeroBannerSection).autoSlideIntervalSeconds === sec
                            ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                            : "bg-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Banners List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-400" />
                    <span>اسلایدهای بنر هیرو ({(formData as HeroBannerSection).banners?.length || 0})</span>
                  </h4>

                  <EButton
                    variant="secondary"
                    size="sm"
                    onClick={handleAddHeroSlide}
                    icon={<Plus className="w-3.5 h-3.5" />}
                  >
                    افزودن اسلاید جدید
                  </EButton>
                </div>

                {(formData as HeroBannerSection).banners?.map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                      <span className="text-xs font-bold text-indigo-400 font-mono">
                        اسلاید شماره #{idx + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteBannerItem(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/30 transition-colors cursor-pointer"
                        title="حذف این اسلاید"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image Uploader */}
                    <ImageUploader
                      label="تصویر اسلاید بنر"
                      value={slide.imageUrl}
                      onChange={(val) =>
                        handleUpdateBannerItem(idx, "imageUrl", val)
                      }
                      presets={SAMPLE_BANNER_PRESETS.map((p) => ({ label: p.name, url: p.url }))}
                      variant="compact"
                      helperText="آپلود فایل بنر از سیستم یا انتخاب از نمونه‌ها."
                    />

                    {/* Title, Subtitle, CTA */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          عنوان روی بنر:
                        </label>
                        <ETextField
                          value={slide.title || ""}
                          onChange={(e) =>
                            handleUpdateBannerItem(idx, "title", e.target.value)
                          }
                          placeholder="عنوان اسلاید..."
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          متن دکمه اقدام (CTA):
                        </label>
                        <ETextField
                          value={slide.buttonText || ""}
                          onChange={(e) =>
                            handleUpdateBannerItem(idx, "buttonText", e.target.value)
                          }
                          placeholder="مثال: خرید با تخفیف"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-slate-400 mb-1">
                          توضیح زیرعنوان:
                        </label>
                        <ETextField
                          value={slide.subtitle || ""}
                          onChange={(e) =>
                            handleUpdateBannerItem(idx, "subtitle", e.target.value)
                          }
                          placeholder="توضیحات تکمیلی..."
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-slate-400 mb-1">
                          لینک مقصد دکمه (URL):
                        </label>
                        <ETextField
                          value={slide.linkUrl || ""}
                          onChange={(e) =>
                            handleUpdateBannerItem(idx, "linkUrl", e.target.value)
                          }
                          placeholder="/products?category=electronics"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- BANNER GRID 2 & 3 CONFIG --- */}
          {(formData.type === "banner_grid_2" || formData.type === "banner_grid_3") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span>
                    تنظیم تصاویر بنرهای گرید (
                    {formData.type === "banner_grid_2" ? "۲ بنر تبلیغاتی" : "۳ بنر تبلیغاتی"})
                  </span>
                </h4>
              </div>

              {(formData as BannerGridSection).banners?.map((banner, idx) => (
                <div
                  key={banner.id || idx}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                    <span className="text-xs font-bold text-cyan-400 font-mono">
                      جایگاه بنر #{idx + 1}
                    </span>
                  </div>

                  <ImageUploader
                    label="تصویر بنر تبلیغاتی"
                    value={banner.imageUrl}
                    onChange={(val) =>
                      handleUpdateBannerItem(idx, "imageUrl", val)
                    }
                    presets={SAMPLE_BANNER_PRESETS.map((p) => ({ label: p.name, url: p.url }))}
                    variant="compact"
                    helperText="آپلود فایل بنر از سیستم یا انتخاب از نمونه‌ها."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        عنوان بنر:
                      </label>
                      <ETextField
                        value={banner.title || ""}
                        onChange={(e) =>
                          handleUpdateBannerItem(idx, "title", e.target.value)
                        }
                        placeholder="عنوان بنر..."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        لینک مقصد کلیک:
                      </label>
                      <ETextField
                        value={banner.linkUrl || ""}
                        onChange={(e) =>
                          handleUpdateBannerItem(idx, "linkUrl", e.target.value)
                        }
                        placeholder="/products"
                      />
                    </div>

                    {formData.type === "banner_grid_2" && (
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-slate-400 mb-1">
                          زیرعنوان بنر (اختیاری):
                        </label>
                        <ETextField
                          value={banner.subtitle || ""}
                          onChange={(e) =>
                            handleUpdateBannerItem(idx, "subtitle", e.target.value)
                          }
                          placeholder="توضیح کوتاه بنر..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* --- FLASH DEALS CONFIG --- */}
          {formData.type === "flash_deals" && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>تایمر معکوس و درصد تخفیف شگفت‌انگیز</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      تاریخ و ساعت پایان پیشنهاد (ISO):
                    </label>
                    <ETextField
                      value={(formData as FlashDealsSection).endDateTime || ""}
                      onChange={(e) => handleEndDateTimeChange(e.target.value)}
                      placeholder="2026-08-20T23:59:59.000Z"
                      helperText="فرمت استاندارد تاریخ انقضای تایمر معکوس"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      حداکثر درصد تخفیف شگفت‌انگیز:
                    </label>
                    <div className="flex items-center gap-2">
                      {[20, 30, 40, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => handleDiscountPercentChange(pct)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                            (formData as FlashDealsSection).discountPercentBadge === pct
                              ? "bg-rose-600 text-white shadow-sm"
                              : "bg-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          تا {pct}٪
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Picker Trigger */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-rose-400" />
                      <span>
                        کالاهای شگفت‌انگیز (
                        {(formData as FlashDealsSection).productIds?.length || 0})
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      محصولات متصل به این ردیف ویژه با نشان تخفیف قرمز نمایش داده می‌شوند.
                    </p>
                  </div>

                  <EButton
                    variant="primary"
                    size="sm"
                    onClick={() => setIsProductPickerOpen(true)}
                    icon={<ShoppingBag className="w-3.5 h-3.5" />}
                    className="bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 shrink-0"
                  >
                    انتخاب کالاها ({linkedProducts.length})
                  </EButton>
                </div>

                {/* Preview linked products */}
                {linkedProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    {linkedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center gap-2"
                      >
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-medium text-slate-200 truncate">
                            {prod.title}
                          </p>
                          <p className="text-[10px] font-mono text-rose-300">
                            {prod.price.toLocaleString("fa-IR")} ت
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">
                    هیچ کالایی برای این ردیف انتخاب نشده است.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* --- PRODUCT GRID CONFIG --- */}
          {formData.type === "product_grid" && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>توضیحات و لینک مشاهده همه</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      زیرعنوان بخش:
                    </label>
                    <ETextField
                      value={(formData as ProductGridSection).subtitle || ""}
                      onChange={(e) => handleSubtitleChange(e.target.value)}
                      placeholder="توضیح کوتاه زیر عنوان ردیف..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      آدرس صفحه مشاهده همه (View All Link):
                    </label>
                    <ETextField
                      value={(formData as ProductGridSection).viewAllLink || ""}
                      onChange={(e) => handleViewAllLinkChange(e.target.value)}
                      placeholder="/products?category=..."
                    />
                  </div>
                </div>
              </div>

              {/* Products Picker Trigger */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-emerald-400" />
                      <span>
                        کالاهای این ردیف (
                        {(formData as ProductGridSection).productIds?.length || 0})
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      کالاهایی که در این ردیف ۴ ستونه نمایش داده می‌شوند.
                    </p>
                  </div>

                  <EButton
                    variant="primary"
                    size="sm"
                    onClick={() => setIsProductPickerOpen(true)}
                    icon={<ShoppingBag className="w-3.5 h-3.5" />}
                    className="bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 shrink-0"
                  >
                    مدیریت کالاها ({linkedProducts.length})
                  </EButton>
                </div>

                {/* Preview linked products */}
                {linkedProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    {linkedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center gap-2"
                      >
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-medium text-slate-200 truncate">
                            {prod.title}
                          </p>
                          <p className="text-[10px] font-mono text-emerald-300">
                            {prod.price.toLocaleString("fa-IR")} ت
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">
                    هیچ کالایی برای این ردیف انتخاب نشده است.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </BottomSheet>

      {/* Product Picker Modal (Unified Nested Modal) */}
      <ProductPickerModal
        isOpen={isProductPickerOpen}
        onClose={() => setIsProductPickerOpen(false)}
        products={catalogProducts}
        selectedProductIds={
          (formData as FlashDealsSection | ProductGridSection).productIds || []
        }
        onConfirm={handleConfirmProducts}
        title={`انتخاب کالاهای ردیف «${formData.title}»`}
      />
    </>
  );
};

export default SectionConfigModal;
