import React, { useState } from "react";
import type { SectionType } from "@/types/homepage";
import { SECTION_TYPE_META } from "./SectionTypeHelper";
import BottomSheet from "@/shared-app/bottomSheet";
import EButton from "@/shared-app/designSystem/button";
import ETextField from "@/shared-app/designSystem/textField";
import { Plus, Check, LayoutGrid, Layers } from "lucide-react";

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (type: SectionType, title?: string) => void;
  isUpdating?: boolean;
}

const SECTION_OPTIONS: {
  type: SectionType;
  defaultTitle: string;
}[] = [
  {
    type: "product_grid",
    defaultTitle: "ردیف کالاهای منتخب جدید",
  },
  {
    type: "banner_grid_2",
    defaultTitle: "بنرهای تبلیغاتی دو ستونه ویژه",
  },
  {
    type: "banner_grid_3",
    defaultTitle: "بنرهای دسته‌بندی سه ستونه",
  },
  {
    type: "flash_deals",
    defaultTitle: "پیشنهادهای شگفت‌انگیز روز",
  },
  {
    type: "hero_banner",
    defaultTitle: "اسلایدر بنر هیرو صفحه اصلی",
  },
];

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  onAddSection,
  isUpdating = false,
}) => {
  const [selectedType, setSelectedType] = useState<SectionType>("product_grid");
  const [customTitle, setCustomTitle] = useState<string>("");

  const currentOption = SECTION_OPTIONS.find((o) => o.type === selectedType);
  const effectiveTitle = customTitle.trim() || currentOption?.defaultTitle || "";

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onAddSection(selectedType, effectiveTitle);
    setCustomTitle("");
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Plus className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-base">
            افزودن سکشن جدید به صفحه اصلی
          </span>
        </div>
      }
      subtitle="نوع بلوک محتوایی مورد نظر را انتخاب و عنوان نمایشی آن را تعیین کنید"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <EButton variant="outlined" size="sm" onClick={onClose}>
            انصراف
          </EButton>

          <EButton
            type="button"
            variant="primary"
            size="sm"
            isLoading={isUpdating}
            onClick={handleSubmit}
            icon={<Plus className="w-4 h-4" />}
            className="shadow-lg shadow-indigo-600/30"
          >
            ایجاد و ورود به پیکربندی
          </EButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step 1: Select Section Type */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
            <span>۱. نوع بلوک محتوایی را انتخاب کنید:</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SECTION_OPTIONS.map((opt) => {
              const meta = SECTION_TYPE_META[opt.type];
              const isSelected = selectedType === opt.type;

              return (
                <div
                  key={opt.type}
                  onClick={() => {
                    setSelectedType(opt.type);
                    if (!customTitle) {
                      setCustomTitle(opt.defaultTitle);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 relative ${
                    isSelected
                      ? "bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-600/25 ring-1 ring-indigo-500"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center border ${meta.badgeBg} ${meta.badgeBorder}`}
                      >
                        {meta.icon}
                      </div>
                      <span className="text-xs font-bold text-slate-100">
                        {meta.shortLabel}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {meta.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Custom Title */}
        <div className="pt-2 border-t border-slate-800/80">
          <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>۲. عنوان نمایشی بخش در فروشگاه:</span>
          </label>
          <ETextField
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder={currentOption?.defaultTitle || "عنوان بخش..."}
            helperText="این عنوان به عنوان هدر ردیف در صفحه اصلی فروشگاه نمایش داده می‌شود."
          />
        </div>
      </form>
    </BottomSheet>
  );
};

export default AddSectionModal;
