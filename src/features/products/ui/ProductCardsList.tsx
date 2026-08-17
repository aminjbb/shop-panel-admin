import React from "react";
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

export interface ProductCardsListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onQuickStockUpdate: (productId: string, variantId: string | null, delta: number) => void;
  className?: string;
}

export const ProductCardsList: React.FC<ProductCardsListProps> = ({
  products,
  onEdit,
  onDelete,
  onQuickStockUpdate,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-3.5 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onQuickStockUpdate={onQuickStockUpdate}
        />
      ))}
    </div>
  );
};

export default ProductCardsList;
