import React from "react";
import HeaderPages from "@/shared-app/headerPages";
import ProductCatalogWidget from "@/widgets/products/ui/ProductCatalogWidget";

export const ProductsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <HeaderPages
        title="مدیریت کاتالوگ محصولات و انبار"
        subtitle="مشاهده، جستجو، ثبت و ویرایش محصولات به همراه کنترل موجودی انبار به شیوه واکنش‌گرا (Mobile-First)"
      />

      <ProductCatalogWidget />
    </div>
  );
};

export default ProductsPage;
