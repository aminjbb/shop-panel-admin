import React from "react";
import {
  Smartphone,
  Tablet,
  Laptop,
  Headphones,
  Shirt,
  Sparkles,
  Home,
  Coffee,
  Dumbbell,
  Watch,
  Package,
  Tag,
  ShoppingBag,
  Tv,
  Layers,
  Folder,
  Camera,
  BookOpen,
  Music,
  Car,
  Heart,
  Briefcase,
  Zap,
} from "lucide-react";

export const CATEGORY_ICON_OPTIONS = [
  { id: "Smartphone", label: "گوشی و تبلت", icon: Smartphone },
  { id: "Tablet", label: "تبلت", icon: Tablet },
  { id: "Laptop", label: "لپ‌تاپ و کامپیوتر", icon: Laptop },
  { id: "Headphones", label: "هدفون و صوتی", icon: Headphones },
  { id: "Shirt", label: "پوشاک و مد", icon: Shirt },
  { id: "Sparkles", label: "زیبایی و درخشش", icon: Sparkles },
  { id: "Home", label: "لوازم خانگی", icon: Home },
  { id: "Coffee", label: "آشپزخانه و قهوه", icon: Coffee },
  { id: "Dumbbell", label: "ورزش و تناسب اندام", icon: Dumbbell },
  { id: "Watch", label: "ساعت و اکسسوری", icon: Watch },
  { id: "Tv", label: "تلویزیون و تصویر", icon: Tv },
  { id: "Camera", label: "دوربین و عکاسی", icon: Camera },
  { id: "BookOpen", label: "کتاب و آموزش", icon: BookOpen },
  { id: "Music", label: "موسیقی و هنر", icon: Music },
  { id: "Car", label: "خودرو و ابزار", icon: Car },
  { id: "Heart", label: "سلامت و پزشکی", icon: Heart },
  { id: "Briefcase", label: "اداری و بیزینس", icon: Briefcase },
  { id: "Zap", label: "گجت و الکترونیک", icon: Zap },
  { id: "Tag", label: "تخفیف و برچسب", icon: Tag },
  { id: "ShoppingBag", label: "فروشگاه و خرید", icon: ShoppingBag },
  { id: "Package", label: "بسته و کالا", icon: Package },
  { id: "Layers", label: "چندسطحی و لایه‌ای", icon: Layers },
  { id: "Folder", label: "پوشه عمومی", icon: Folder },
];

export function renderCategoryIcon(iconName?: string, className = "w-4 h-4") {
  const match = CATEGORY_ICON_OPTIONS.find((opt) => opt.id === iconName);
  if (match) {
    const IconComponent = match.icon;
    return <IconComponent className={className} />;
  }
  return <Folder className={className} />;
}
