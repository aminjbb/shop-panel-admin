import React, { useState, useEffect, useMemo } from "react";
import type {
  Category,
  CategoryAttribute,
  CategoryFormData,
  AttributeType,
} from "@/types/category";
import BottomSheet from "@/shared-app/bottomSheet";
import ETextField from "@/shared-app/designSystem/textField";
import ESelect from "@/shared-app/designSystem/select";
import { ESwitch } from "@/shared-app/designSystem/switch";
import EButton from "@/shared-app/designSystem/button";
import ImageUploader from "@/shared-app/designSystem/imageUploader";
import { CATEGORY_ICON_OPTIONS, renderCategoryIcon } from "./CategoryIconHelper";
import { mockCategoryService } from "../api/mockCategoryService";
import {
  Save,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Image as ImageIcon,
  FolderTree,
  X,
  Check,
} from "lucide-react";

export interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "createChild";
  category?: Category | null;
  parentCategory?: Category | null;
  allCategories: Category[];
  onSave: (formData: CategoryFormData, editId?: string) => Promise<void>;
  isLoading?: boolean;
}

const PRESET_THUMBNAILS = [
  { label: "دیجیتال و هدفون", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80" },
  { label: "موبایل هوشمند", url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80" },
  { label: "لپ‌تاپ و کاربری", url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&auto=format&fit=crop&q=80" },
  { label: "پوشاک و مد", url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&auto=format&fit=crop&q=80" },
  { label: "لوازم خانگی", url: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&auto=format&fit=crop&q=80" },
  { label: "ساعت و اکسسوری", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80" },
  { label: "زیبایی و پوست", url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80" },
  { label: "ورزش و سفر", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80" },
];

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  category,
  parentCategory,
  allCategories,
  onSave,
  isLoading = false,
}) => {
  const isEditing = mode === "edit" && Boolean(category);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Folder");
  const [thumbnail, setThumbnail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [attributes, setAttributes] = useState<CategoryAttribute[]>([]);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // New option tag state for select attributes
  const [newOptionInputs, setNewOptionInputs] = useState<Record<string, string>>({});

  // Helper to generate slug from name
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/[^\w\u0600-\u06FF-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Synchronize form when opened or category changes
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && category) {
      setName(category.name);
      setSlug(category.slug);
      setIsSlugManuallyEdited(true);
      setParentId(category.parentId);
      setDescription(category.description || "");
      setIcon(category.icon || "Folder");
      setThumbnail(category.thumbnail || "");
      setIsActive(category.isActive);
      setDisplayOrder(category.displayOrder || 1);
      setAttributes(category.attributes ? JSON.parse(JSON.stringify(category.attributes)) : []);
    } else if (mode === "createChild" && parentCategory) {
      setName("");
      setSlug("");
      setIsSlugManuallyEdited(false);
      setParentId(parentCategory.id);
      setDescription("");
      setIcon(parentCategory.icon || "Folder");
      setThumbnail("");
      setIsActive(true);
      setDisplayOrder(allCategories.filter((c) => c.parentId === parentCategory.id).length + 1);
      setAttributes([]);
    } else {
      // Create root
      setName("");
      setSlug("");
      setIsSlugManuallyEdited(false);
      setParentId(null);
      setDescription("");
      setIcon("Folder");
      setThumbnail(PRESET_THUMBNAILS[0].url);
      setIsActive(true);
      setDisplayOrder(allCategories.filter((c) => c.parentId === null).length + 1);
      setAttributes([]);
    }

    setErrors({});
    setNewOptionInputs({});
  }, [isOpen, mode, category, parentCategory, allCategories]);

  // Auto slug generation if not manually edited
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setIsSlugManuallyEdited(true);
  };

  // Filter valid parent category choices (preventing cycle)
  const parentOptions = useMemo(() => {
    let invalidIds = new Set<string>();

    if (isEditing && category) {
      invalidIds.add(category.id);
      const descendants = mockCategoryService.getDescendantIds(category.id, allCategories);
      descendants.forEach((id) => invalidIds.add(id));
    }

    const validCategories = allCategories.filter((c) => !invalidIds.has(c.id));

    const options = [
      { value: "ROOT", label: "بدون والد (دسته اصلی ریشه - سطح صفر)" },
      ...validCategories.map((c) => {
        const isSub = Boolean(c.parentId);
        return {
          value: c.id,
          label: `${isSub ? "↳ " : "📁 "}${c.name} (${c.slug})`,
        };
      }),
    ];

    return options;
  }, [allCategories, isEditing, category]);

  // Attribute builder operations
  const handleAddAttribute = () => {
    const newAttr: CategoryAttribute = {
      id: `attr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      name: "",
      type: "text",
      options: [],
      isRequired: false,
    };
    setAttributes((prev) => [...prev, newAttr]);
  };

  const handleUpdateAttribute = (id: string, updates: Partial<CategoryAttribute>) => {
    setAttributes((prev) =>
      prev.map((attr) => {
        if (attr.id === id) {
          const updated = { ...attr, ...updates };
          // If changed from select to something else, clear options
          if (updates.type && updates.type !== "select") {
            updated.options = undefined;
          } else if (updates.type === "select" && !updated.options) {
            updated.options = [];
          }
          return updated;
        }
        return attr;
      })
    );
  };

  const handleRemoveAttribute = (id: string) => {
    setAttributes((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddSelectOption = (attrId: string) => {
    const optionVal = (newOptionInputs[attrId] || "").trim();
    if (!optionVal) return;

    setAttributes((prev) =>
      prev.map((attr) => {
        if (attr.id === attrId) {
          const currentOptions = attr.options || [];
          if (!currentOptions.includes(optionVal)) {
            return { ...attr, options: [...currentOptions, optionVal] };
          }
        }
        return attr;
      })
    );

    setNewOptionInputs((prev) => ({ ...prev, [attrId]: "" }));
  };

  const handleRemoveSelectOption = (attrId: string, optionToRemove: string) => {
    setAttributes((prev) =>
      prev.map((attr) => {
        if (attr.id === attrId && attr.options) {
          return {
            ...attr,
            options: attr.options.filter((o) => o !== optionToRemove),
          };
        }
        return attr;
      })
    );
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = "عنوان دسته‌بندی باید حداقل ۲ کاراکتر باشد.";
    }

    if (!slug.trim() || slug.trim().length < 2) {
      newErrors.slug = "اسلاگ یکتا الزامی است و باید حداقل ۲ کاراکتر باشد.";
    }

    // Check duplicate attribute names
    const attrNames = attributes.map((a) => a.name.trim().toLowerCase()).filter(Boolean);
    const hasDuplicateAttr = new Set(attrNames).size !== attrNames.length;
    if (hasDuplicateAttr) {
      newErrors.attributes = "نام ویژگی‌های کالا باید یکتا باشند.";
    }

    // Check empty attribute names
    if (attributes.some((a) => !a.name.trim())) {
      newErrors.attributes = "عنوان تمام ویژگی‌ها باید تکمیل شود.";
    }

    // Check select attributes with empty options
    if (attributes.some((a) => a.type === "select" && (!a.options || a.options.length === 0))) {
      newErrors.attributes = "برای ویژگی‌های از نوع انتخابی (Select) باید حداقل یک گزینه تعریف کنید.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CategoryFormData = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      parentId: parentId === "ROOT" || !parentId ? null : parentId,
      description: description.trim(),
      icon,
      thumbnail: thumbnail.trim(),
      isActive,
      displayOrder: Number(displayOrder) || 1,
      attributes,
    };

    await onSave(payload, isEditing && category ? category.id : undefined);
  };

  const modalTitle =
    mode === "edit"
      ? `ویرایش دسته‌بندی: ${category?.name}`
      : mode === "createChild"
      ? `افزودن زیردسته برای: ${parentCategory?.name}`
      : "ایجاد دسته‌بندی اصلی جدید";

  const modalSubtitle =
    mode === "edit"
      ? "تغییر ساختار، مشخصات، آیکون و ویژگی‌های اختصاصی این دسته"
      : "تعریف مشخصات سلسله‌مراتب، اسلاگ، آیکون و ویژگی‌های کالا در این دسته‌بندی";

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      subtitle={modalSubtitle}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Info Alert */}
        {parentCategory && mode === "createChild" && (
          <div className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center gap-2.5 text-xs text-indigo-300">
            <FolderTree className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              این دسته‌بندی به عنوان زیرشاخه مستقیم دسته{" "}
              <strong className="text-white">«{parentCategory.name}»</strong> ثبت خواهد شد.
            </span>
          </div>
        )}

        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>مشخصات اصلی و سلسله‌مراتب</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <ETextField
                label="نام دسته‌بندی *"
                value={name}
                onValueChange={(val) => handleNameChange(val)}
                placeholder="مثال: گوشی هوشمند یا پوشاک زنانه"
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
            </div>

            <div>
              <ETextField
                label="اسلاگ یکتا (Slug) *"
                value={slug}
                onValueChange={(val) => handleSlugChange(val)}
                placeholder="مثال: smartphones"
                dir="ltr"
                error={Boolean(errors.slug)}
                helperText={errors.slug || "شناسه یکتای دسته‌بندی در آدرس URL"}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                دسته والد (سلسله‌مراتب)
              </label>
              <ESelect
                value={parentId || "ROOT"}
                onValueChange={(val) => setParentId(val === "ROOT" ? null : val)}
                options={parentOptions}
                placeholder="انتخاب دسته والد"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                برای ایجاد دسته ریشه، گزینه «بدون والد» را انتخاب کنید.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                ترتیب نمایش (اولویت عددی)
              </label>
              <input
                type="number"
                min="1"
                max="999"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-full h-10 px-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              توضیحات کوتاه
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="توضیح کوتاه درباره ماهیت و کالاهای این دسته‌بندی..."
              className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Section 2: Icon & Visual Branding */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>آیکون و تصویر شاخص</span>
          </h4>

          {/* Icon Selector Grid */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              انتخاب نماد گرافیکی (آیکون):
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800 thin-scrollbar">
              {CATEGORY_ICON_OPTIONS.map((item) => {
                const isSelected = icon === item.id;
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIcon(item.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs gap-1 transition-all cursor-pointer select-none ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400"
                        : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                    }`}
                    title={item.label}
                  >
                    <IconComp className="w-4 h-4" />
                    <span className="text-[10px] truncate max-w-full">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thumbnail Uploader */}
          <ImageUploader
            label="تصویر بنر و تامبنیل دسته‌بندی"
            value={thumbnail}
            onChange={(val) => setThumbnail(val)}
            presets={PRESET_THUMBNAILS}
            variant="compact"
            helperText="آپلود تصویر اختصاصی از کامپیوتر یا انتخاب سریع از نمونه‌های آماده."
          />
        </div>

        {/* Section 3: Dynamic Attribute Builder (PBI-7.3 Requirement) */}
        <div className="space-y-4 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ویژگی‌های اختصاصی کالا (Attribute Builder)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                ویژگی‌هایی مانند سایز، جنس، گارانتی یا حافظه که محصولات این دسته‌بندی باید داشته باشند.
              </p>
            </div>

            <EButton
              variant="outlined"
              size="sm"
              onClick={handleAddAttribute}
              icon={<Plus className="w-3.5 h-3.5 text-indigo-400" />}
            >
              افزودن فیلد ویژگی
            </EButton>
          </div>

          {errors.attributes && (
            <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/30">
              {errors.attributes}
            </p>
          )}

          {attributes.length === 0 ? (
            <div className="text-center py-6 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-xs text-slate-400">
              هنوز هیچ ویژگی اختصاصی برای این دسته‌بندی تعریف نشده است. با کلیک بر روی «افزودن فیلد ویژگی» می‌توانید فیلدهای دلخواه ایجاد کنید.
            </div>
          ) : (
            <div className="space-y-3">
              {attributes.map((attr, index) => (
                <div
                  key={attr.id}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-mono shrink-0">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={attr.name}
                        onChange={(e) =>
                          handleUpdateAttribute(attr.id, { name: e.target.value })
                        }
                        placeholder="نام ویژگی (مثلاً: ظرفیت باتری یا جنس)"
                        className="flex-1 h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={attr.type}
                        onChange={(e) =>
                          handleUpdateAttribute(attr.id, {
                            type: e.target.value as AttributeType,
                          })
                        }
                        className="h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="text">متنی (Text)</option>
                        <option value="number">عددی (Number)</option>
                        <option value="select">لیست انتخابی (Select)</option>
                      </select>

                      <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
                        <input
                          type="checkbox"
                          checked={attr.isRequired}
                          onChange={(e) =>
                            handleUpdateAttribute(attr.id, {
                              isRequired: e.target.checked,
                            })
                          }
                          className="rounded text-indigo-600 focus:ring-0"
                        />
                        <span>اجباری</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(attr.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="حذف این ویژگی"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Select Options Builder */}
                  {attr.type === "select" && (
                    <div className="ps-7 space-y-2 pt-2 border-t border-slate-800/60">
                      <span className="text-[11px] text-slate-400 block">
                        گزینه‌های قابل انتخاب برای این ویژگی:
                      </span>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {(attr.options || []).map((opt) => (
                          <span
                            key={opt}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-xs text-indigo-200"
                          >
                            <span>{opt}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSelectOption(attr.id, opt)}
                              className="text-indigo-400 hover:text-rose-400 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 max-w-sm">
                        <input
                          type="text"
                          value={newOptionInputs[attr.id] || ""}
                          onChange={(e) =>
                            setNewOptionInputs((prev) => ({
                              ...prev,
                              [attr.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSelectOption(attr.id);
                            }
                          }}
                          placeholder="افزودن گزینه (مثلاً: ۱۲۸ گیگابایت)..."
                          className="h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 flex-1 focus:outline-none focus:border-indigo-500"
                        />
                        <EButton
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAddSelectOption(attr.id)}
                          className="h-8 text-xs"
                        >
                          ثبت گزینه
                        </EButton>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Status Switch */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-slate-200 block">
              وضعیت انتشار دسته‌بندی
            </span>
            <span className="text-xs text-slate-400 block">
              در صورت غیرفعال بودن، این دسته و کالاهایش در بخش‌های فروشگاهی مخفی می‌شوند.
            </span>
          </div>

          <ESwitch
            checked={isActive}
            onCheckedChange={setIsActive}
            activeLabel="فعال"
            inActiveLabel="غیرفعال"
          />
        </div>

        {/* Sticky Form Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <EButton variant="outlined" onClick={onClose} disabled={isLoading}>
            انصراف
          </EButton>

          <EButton
            type="submit"
            variant="primary"
            isLoading={isLoading}
            icon={<Save className="w-4 h-4" />}
            className="shadow-lg shadow-indigo-600/30"
          >
            {isEditing ? "ذخیره تغییرات" : "ایجاد دسته‌بندی"}
          </EButton>
        </div>
      </form>
    </BottomSheet>
  );
};

export default CategoryFormModal;
