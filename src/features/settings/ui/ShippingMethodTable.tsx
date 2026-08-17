import React from "react";
import type { ShippingMethod } from "@/types/settings";
import { EButton } from "@/shared-app/designSystem/button";
import { ESwitch } from "@/shared-app/designSystem/switch";
import ActivationBage from "@/shared-app/activationbage";
import {
  Truck,
  Clock,
  MapPin,
  Edit2,
  Trash2,
} from "lucide-react";

export interface ShippingMethodTableProps {
  shippingMethods: ShippingMethod[];
  onToggleStatus: (id: string) => void;
  onEdit: (method: ShippingMethod) => void;
  onDelete: (id: string) => void;
}

export const ShippingMethodTable: React.FC<ShippingMethodTableProps> = ({
  shippingMethods,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] text-slate-400 font-medium border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 font-semibold">عنوان روش ارسال</th>
              <th className="py-3.5 px-4 font-semibold">هزینه پایه</th>
              <th className="py-3.5 px-4 font-semibold">زمان تقریبی تحویل</th>
              <th className="py-3.5 px-4 font-semibold">پوشش جغرافیایی و شهرها</th>
              <th className="py-3.5 px-4 font-semibold text-center">وضعیت</th>
              <th className="py-3.5 px-4 font-semibold text-center">عملیات</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {shippingMethods.map((method) => {
              return (
                <tr
                  key={method.id}
                  id={`shipping-row-${method.id}`}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    !method.isActive ? "opacity-60 bg-slate-950/20" : ""
                  }`}
                >
                  {/* 1. Title & Icon */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          method.isActive
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-xs sm:text-sm">
                          {method.title}
                        </span>
                        {method.description && (
                          <span className="text-[11px] text-slate-400 max-w-xs truncate mt-0.5">
                            {method.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 2. Cost */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {method.cost === 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">
                        رایگان
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 font-bold text-white text-xs">
                        <span>{method.cost.toLocaleString("fa-IR")}</span>
                        <span className="text-[10px] text-slate-400 font-normal">تومان</span>
                      </div>
                    )}
                  </td>

                  {/* 3. Estimated Days */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{method.estimatedDays}</span>
                    </div>
                  </td>

                  {/* 4. Allowed Cities */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {method.allowedCities.includes("همه") ? (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-[11px] font-medium border border-indigo-500/20">
                          سراسر کشور
                        </span>
                      ) : (
                        method.allowedCities.map((city, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] border border-slate-700"
                          >
                            {city}
                          </span>
                        ))
                      )}
                    </div>
                  </td>

                  {/* 5. Status & Switch */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <ESwitch
                        checked={method.isActive}
                        onCheckedChange={() => onToggleStatus(method.id)}
                      />
                      <ActivationBage
                        label={method.isActive ? "فعال" : "غیرفعال"}
                        status={method.isActive ? "active" : "inactive"}
                        className="text-[10px] px-1.5 py-0"
                      />
                    </div>
                  </td>

                  {/* 6. Actions */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <EButton
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(method)}
                        icon={<Edit2 className="w-3.5 h-3.5 text-slate-300" />}
                        className="p-1.5 hover:bg-slate-800 text-slate-300"
                        title="ویرایش روش ارسال"
                      />
                      <EButton
                        variant="secondary"
                        size="sm"
                        onClick={() => onDelete(method.id)}
                        icon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
                        className="p-1.5 hover:bg-rose-500/10 text-rose-400"
                        title="حذف روش ارسال"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShippingMethodTable;
