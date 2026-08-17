import React, { useState, useEffect } from "react";
import type {
  HomepageSection,
  HeroBannerSection,
  FlashDealsSection,
  ProductGridSection,
  BannerGridSection,
  PreviewDeviceMode,
} from "@/types/homepage";
import type { Product } from "@/types/product";
import {
  X,
  Monitor,
  Smartphone,
  ChevronRight,
  ChevronLeft,
  Flame,
  Clock,
  ShoppingBag,
  ArrowLeft,
  Star,
  Search,
  ShoppingCart,
  Menu,
  Heart,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

interface LivePreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sections: HomepageSection[];
  catalogProducts: Product[];
}

export const LivePreviewDrawer: React.FC<LivePreviewDrawerProps> = ({
  isOpen,
  onClose,
  sections,
  catalogProducts,
}) => {
  const [deviceMode, setDeviceMode] = useState<PreviewDeviceMode>("desktop");
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 14, minutes: 35, seconds: 20 });

  // Only render active sections in preview!
  const activeSections = sections
    .filter((s) => s.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Find hero section if any
  const heroSection = activeSections.find(
    (s) => s.type === "hero_banner"
  ) as HeroBannerSection | undefined;

  // Auto-slide effect for hero banner in preview
  useEffect(() => {
    if (!heroSection || !heroSection.banners || heroSection.banners.length <= 1)
      return;

    const intervalSec = heroSection.autoSlideIntervalSeconds || 5;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % heroSection.banners.length);
    }, intervalSec * 1000);

    return () => clearInterval(timer);
  }, [heroSection]);

  // Live ticking countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  // Helper to get products for a section
  const getSectionProducts = (productIds: string[]) => {
    return productIds
      .map((id) => catalogProducts.find((p) => p.id === id))
      .filter(Boolean) as Product[];
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Preview Control Bar */}
      <div className="h-16 px-6 border-b border-slate-800 bg-slate-900 flex items-center justify-between shrink-0 shadow-lg">
        {/* Title and Active count */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
              <span>پیش‌نمایش زنده ویترین فروشگاه داینوا</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                {activeSections.length} سکشن فعال
              </span>
            </h3>
          </div>
        </div>

        {/* Device Switcher Controls */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setDeviceMode("desktop")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === "desktop"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">نمای دسکتاپ</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === "mobile"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">نمای موبایل</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="بستن پیش‌نمایش"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Preview Viewport */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-6 flex items-start justify-center bg-slate-950">
        {deviceMode === "desktop" ? (
          /* =========================================================================
             DESKTOP PREVIEW CONTAINER
             ========================================================================= */
          <div className="w-full max-w-6xl bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all">
            {/* Mock Store Header */}
            <div className="bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-black text-sm">
                  D
                </div>
                <span className="font-bold text-white text-base">فروشگاه آنلاین داینوا</span>
              </div>

              <div className="flex-1 max-w-md relative hidden md:block">
                <input
                  type="text"
                  readOnly
                  placeholder="جستجو در بین ۲۰,۰۰۰ کالای داینوا..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-400 focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-500 absolute end-3 top-2.5" />
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <button className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
                  ورود / ثبت‌نام
                </button>
              </div>
            </div>

            {/* Render Store Sections in order */}
            <div className="p-5 space-y-8">
              {activeSections.map((section) => (
                <div key={section.id} className="animate-in fade-in duration-300">
                  {/* --- HERO BANNER DESKTOP --- */}
                  {section.type === "hero_banner" && (
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-950 h-80 sm:h-96">
                      {(section as HeroBannerSection).banners?.map((slide, idx) => {
                        const isCurrent = idx === (activeSlideIndex % ((section as HeroBannerSection).banners?.length || 1));
                        return (
                          <div
                            key={slide.id || idx}
                            className={`absolute inset-0 transition-opacity duration-700 ${
                              isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                            }`}
                          >
                            <img
                              src={slide.imageUrl}
                              alt={slide.title || "Banner"}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-8 sm:p-12">
                              {slide.title && (
                                <h2 className="text-2xl sm:text-3xl font-black text-white max-w-xl">
                                  {slide.title}
                                </h2>
                              )}
                              {slide.subtitle && (
                                <p className="text-sm text-slate-200 mt-2 max-w-lg">
                                  {slide.subtitle}
                                </p>
                              )}
                              {slide.buttonText && (
                                <div className="mt-4">
                                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/40 cursor-pointer">
                                    <span>{slide.buttonText}</span>
                                    <ArrowLeft className="w-4 h-4" />
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Slider Dots */}
                      <div className="absolute bottom-4 start-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                        {(section as HeroBannerSection).banners?.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveSlideIndex(idx)}
                            className={`h-2 rounded-full transition-all cursor-pointer ${
                              idx === (activeSlideIndex % ((section as HeroBannerSection).banners?.length || 1))
                                ? "w-6 bg-indigo-500"
                                : "w-2 bg-white/40 hover:bg-white/80"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* --- FLASH DEALS DESKTOP --- */}
                  {section.type === "flash_deals" && (
                    <div className="rounded-3xl bg-gradient-to-l from-rose-700 via-rose-600 to-rose-800 p-5 sm:p-6 shadow-xl text-white">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                            <Flame className="w-6 h-6 text-yellow-300" />
                          </div>
                          <div>
                            <h3 className="font-black text-xl text-white">{section.title}</h3>
                            <span className="text-xs text-rose-100">
                              تا {(section as FlashDealsSection).discountPercentBadge || 35}٪ تخفیف شگفت‌انگیز
                            </span>
                          </div>
                        </div>

                        {/* Ticking Timer Badges */}
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-rose-200" />
                          <span className="text-xs text-rose-100">فرصت باقی‌مانده:</span>
                          <div className="flex items-center gap-1 font-mono font-bold text-sm">
                            <span className="px-2 py-1 rounded-lg bg-black/30 backdrop-blur-sm">
                              {String(timeRemaining.hours).padStart(2, "0")}
                            </span>
                            :
                            <span className="px-2 py-1 rounded-lg bg-black/30 backdrop-blur-sm">
                              {String(timeRemaining.minutes).padStart(2, "0")}
                            </span>
                            :
                            <span className="px-2 py-1 rounded-lg bg-black/30 backdrop-blur-sm text-yellow-300">
                              {String(timeRemaining.seconds).padStart(2, "0")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Products Grid in Flash Deals */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        {getSectionProducts((section as FlashDealsSection).productIds || []).map((prod) => (
                          <div
                            key={prod.id}
                            className="bg-slate-950/90 rounded-2xl p-3 border border-white/10 flex flex-col justify-between hover:scale-[1.02] transition-all group"
                          >
                            <div className="relative">
                              <img
                                src={prod.image}
                                alt={prod.title}
                                className="w-full h-36 object-cover rounded-xl bg-slate-900"
                                referrerPolicy="no-referrer"
                              />
                              <span className="absolute top-2 start-2 px-2 py-0.5 rounded-md bg-rose-600 text-white font-mono font-bold text-[10px]">
                                ۳۰٪ تخفیف
                              </span>
                            </div>

                            <div className="mt-3">
                              <h4 className="text-xs font-bold text-slate-100 truncate">
                                {prod.title}
                              </h4>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs font-mono font-bold text-rose-400">
                                  {(prod.price * 0.7).toLocaleString("fa-IR")} ت
                                </span>
                                <span className="text-[11px] font-mono line-through text-slate-500">
                                  {prod.price.toLocaleString("fa-IR")}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* --- BANNER GRID 2 DESKTOP --- */}
                  {section.type === "banner_grid_2" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(section as BannerGridSection).banners?.map((b, idx) => (
                        <div
                          key={b.id || idx}
                          className="relative rounded-3xl overflow-hidden h-48 sm:h-56 group cursor-pointer border border-slate-800 shadow-lg"
                        >
                          <img
                            src={b.imageUrl}
                            alt={b.title || "Banner"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6">
                            {b.title && (
                              <h3 className="font-black text-lg text-white">{b.title}</h3>
                            )}
                            {b.subtitle && (
                              <p className="text-xs text-slate-300 mt-1">{b.subtitle}</p>
                            )}
                            {b.buttonText && (
                              <span className="mt-2 text-xs font-bold text-indigo-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                <span>{b.buttonText}</span>
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* --- BANNER GRID 3 DESKTOP --- */}
                  {section.type === "banner_grid_3" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {(section as BannerGridSection).banners?.map((b, idx) => (
                        <div
                          key={b.id || idx}
                          className="relative rounded-2xl overflow-hidden h-40 group cursor-pointer border border-slate-800 shadow-md"
                        >
                          <img
                            src={b.imageUrl}
                            alt={b.title || "Banner"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-4">
                            {b.title && (
                              <h3 className="font-bold text-sm text-white">{b.title}</h3>
                            )}
                            {b.subtitle && (
                              <p className="text-[11px] text-slate-300">{b.subtitle}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* --- PRODUCT GRID DESKTOP --- */}
                  {section.type === "product_grid" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-black text-slate-100">{section.title}</h3>
                          {(section as ProductGridSection).subtitle && (
                            <p className="text-xs text-slate-400 mt-0.5">
                              {(section as ProductGridSection).subtitle}
                            </p>
                          )}
                        </div>

                        {(section as ProductGridSection).viewAllLink && (
                          <span className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer">
                            <span>مشاهده همه</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {getSectionProducts((section as ProductGridSection).productIds || []).map((prod) => (
                          <div
                            key={prod.id}
                            className="bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all group"
                          >
                            <div className="relative">
                              <img
                                src={prod.image}
                                alt={prod.title}
                                className="w-full h-40 object-cover rounded-xl bg-slate-900"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            <div className="mt-3">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                                {prod.categoryLabel || prod.category}
                              </span>
                              <h4 className="text-xs font-bold text-slate-100 mt-1 truncate">
                                {prod.title}
                              </h4>
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-xs font-mono font-bold text-emerald-400">
                                  {prod.price.toLocaleString("fa-IR")} تومان
                                </span>
                                <button className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors">
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* =========================================================================
             REALISTIC SMARTPHONE MOCKUP FRAME (MOBILE PREVIEW)
             ========================================================================= */
          <div className="w-[380px] max-w-[90vw] bg-slate-950 rounded-[44px] p-3 border-[6px] border-slate-800 shadow-2xl shadow-black/80 flex flex-col relative overflow-hidden">
            {/* Phone Top Notch & Speaker */}
            <div className="h-6 w-full flex items-center justify-between px-6 mb-1">
              <span className="text-[11px] font-mono text-slate-400">09:41</span>
              <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                <div className="w-8 h-1 bg-slate-800 rounded-full" />
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <span>5G</span>
              </div>
            </div>

            {/* Mobile Viewport Screen */}
            <div className="bg-slate-900 rounded-[32px] overflow-y-auto custom-scrollbar h-[620px] flex flex-col">
              {/* Mobile Store Header */}
              <div className="bg-slate-950 p-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-2">
                  <Menu className="w-5 h-5 text-slate-300" />
                  <span className="font-bold text-white text-xs">فروشگاه داینوا</span>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <ShoppingCart className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Mobile Sections Content */}
              <div className="p-3 space-y-5">
                {activeSections.map((section) => (
                  <div key={section.id} className="space-y-2">
                    {/* Hero Banner Mobile */}
                    {section.type === "hero_banner" && (
                      <div className="relative rounded-2xl overflow-hidden h-48 bg-slate-950">
                        {(section as HeroBannerSection).banners?.map((slide, idx) => {
                          const isCurrent = idx === (activeSlideIndex % ((section as HeroBannerSection).banners?.length || 1));
                          return (
                            <div
                              key={slide.id || idx}
                              className={`absolute inset-0 transition-opacity duration-500 ${
                                isCurrent ? "opacity-100 z-10" : "opacity-0 z-0"
                              }`}
                            >
                              <img
                                src={slide.imageUrl}
                                alt={slide.title || "Banner"}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-4">
                                {slide.title && (
                                  <h3 className="text-sm font-black text-white">{slide.title}</h3>
                                )}
                                {slide.buttonText && (
                                  <span className="mt-2 text-[10px] font-bold text-indigo-300 flex items-center gap-1">
                                    <span>{slide.buttonText}</span>
                                    <ArrowLeft className="w-3 h-3" />
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Flash Deals Mobile */}
                    {section.type === "flash_deals" && (
                      <div className="rounded-2xl bg-gradient-to-l from-rose-700 to-rose-900 p-3 text-white space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-yellow-300" />
                            <span className="font-bold text-xs">{section.title}</span>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30">
                            {timeRemaining.hours}:{timeRemaining.minutes}:{timeRemaining.seconds}
                          </span>
                        </div>

                        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                          {getSectionProducts((section as FlashDealsSection).productIds || []).map((prod) => (
                            <div
                              key={prod.id}
                              className="w-28 shrink-0 bg-slate-950/90 rounded-xl p-2 border border-white/10"
                            >
                              <img
                                src={prod.image}
                                alt={prod.title}
                                className="w-full h-20 object-cover rounded-lg"
                                referrerPolicy="no-referrer"
                              />
                              <p className="text-[10px] font-bold text-slate-100 truncate mt-1">
                                {prod.title}
                              </p>
                              <p className="text-[10px] font-mono text-rose-300 font-bold">
                                {(prod.price * 0.7).toLocaleString("fa-IR")} ت
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Banner Grid 2 Mobile */}
                    {section.type === "banner_grid_2" && (
                      <div className="grid grid-cols-2 gap-2">
                        {(section as BannerGridSection).banners?.map((b, idx) => (
                          <div
                            key={b.id || idx}
                            className="relative rounded-xl overflow-hidden h-28 border border-slate-800"
                          >
                            <img
                              src={b.imageUrl}
                              alt={b.title || "Banner"}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-2">
                              <span className="text-[10px] font-bold text-white truncate">
                                {b.title}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Banner Grid 3 Mobile */}
                    {section.type === "banner_grid_3" && (
                      <div className="grid grid-cols-3 gap-1.5">
                        {(section as BannerGridSection).banners?.map((b, idx) => (
                          <div
                            key={b.id || idx}
                            className="relative rounded-xl overflow-hidden h-20 border border-slate-800"
                          >
                            <img
                              src={b.imageUrl}
                              alt={b.title || "Banner"}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-1.5">
                              <span className="text-[9px] font-bold text-white truncate">
                                {b.title}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Product Grid Mobile */}
                    {section.type === "product_grid" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">{section.title}</span>
                          <span className="text-[10px] text-indigo-400">مشاهده همه</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {getSectionProducts((section as ProductGridSection).productIds || []).map((prod) => (
                            <div
                              key={prod.id}
                              className="bg-slate-950/80 rounded-xl p-2 border border-slate-800"
                            >
                              <img
                                src={prod.image}
                                alt={prod.title}
                                className="w-full h-24 object-cover rounded-lg"
                                referrerPolicy="no-referrer"
                              />
                              <p className="text-[11px] font-bold text-slate-100 truncate mt-1">
                                {prod.title}
                              </p>
                              <p className="text-[10px] font-mono text-emerald-400 font-bold mt-1">
                                {prod.price.toLocaleString("fa-IR")} تومان
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Phone Bottom Home Bar */}
            <div className="h-4 w-full flex items-center justify-center pt-2">
              <div className="w-32 h-1 bg-slate-700 rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePreviewDrawer;
