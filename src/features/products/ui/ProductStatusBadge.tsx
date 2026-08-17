import React from "react";
import type { StockStatus } from "@/types/product";
import ActivationBage from "@/shared-app/activationbage";

export interface ProductStatusBadgeProps {
  status: StockStatus;
  totalStock?: number;
  className?: string;
}

export const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({
  status,
  totalStock,
  className = "",
}) => {
  let label = "موجود در انبار";
  let badgeStatus: "active" | "inactive" | "info" = "active";

  if (status === "out_of_stock" || (totalStock !== undefined && totalStock <= 0)) {
    label = "ناموجود";
    badgeStatus = "inactive";
  } else if (status === "low_stock" || (totalStock !== undefined && totalStock <= 10)) {
    label = `موجودی اندک (${totalStock ?? ""} عدد)`;
    badgeStatus = "info";
  }

  return (
    <ActivationBage
      label={label}
      status={badgeStatus}
      className={`text-[11px] font-medium ${className}`}
    />
  );
};

export default ProductStatusBadge;
