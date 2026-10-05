export type ShippingIconName = "truck" | "motorcycle" | "store" | "package";

export interface ShippingMethodInput {
  name: string;
  price: string | number;
  estimatedDays: number;
  coveredCities: string[] | null;
  iconName: ShippingIconName;
  isActive?: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: string;
  estimatedDays: number;
  coveredCities: "all" | string[];
  iconName: ShippingIconName;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
