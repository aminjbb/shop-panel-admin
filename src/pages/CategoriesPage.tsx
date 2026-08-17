import React from "react";
import HeaderPages from "@/shared-app/headerPages";
import CategoriesContainer from "@/features/categories/ui/CategoriesContainer";
import { FolderTree } from "lucide-react";

export interface CategoriesPageProps {
  onRedirectToLogin?: () => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = () => {
  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <HeaderPages
        title="مدیریت دسته‌بندی‌ها و ساختار کالا"
        subtitle="سازمان‌دهی درختی و چندسطحی کاتالوگ، تعیین دسته‌های والد/فرزند و تعریف ویژگی‌های اختصاصی (اسپرینت ۷)"
      />

      {/* 2. Main Content Container */}
      <CategoriesContainer />
    </div>
  );
};

export default CategoriesPage;
