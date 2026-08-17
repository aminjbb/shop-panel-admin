import React from "react";
import type { AdminStaff, AdminRole } from "@/types/settings";
import { EButton } from "@/shared-app/designSystem/button";
import { ESwitch } from "@/shared-app/designSystem/switch";
import { ESelect } from "@/shared-app/designSystem/select";
import ActivationBage from "@/shared-app/activationbage";
import { getRoleInfo } from "./StaffCard";
import {
  Clock,
  Trash2,
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";

export interface StaffTableProps {
  staff: AdminStaff[];
  onUpdateRole: (id: string, role: AdminRole) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export const StaffTable: React.FC<StaffTableProps> = ({
  staff,
  onUpdateRole,
  onToggleStatus,
  onDelete,
}) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] text-slate-400 font-medium border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 font-semibold">نام و مشخصات مدیر</th>
              <th className="py-3.5 px-4 font-semibold">آدرس ایمیل سازمانی</th>
              <th className="py-3.5 px-4 font-semibold">نقش و سطح دسترسی</th>
              <th className="py-3.5 px-4 font-semibold">آخرین فعالیت</th>
              <th className="py-3.5 px-4 font-semibold text-center">وضعیت حساب</th>
              <th className="py-3.5 px-4 font-semibold text-center">عملیات</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {staff.map((member) => {
              const roleInfo = getRoleInfo(member.role);
              const isActive = member.status === "active";

              return (
                <tr
                  key={member.id}
                  id={`staff-row-${member.id}`}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    !isActive ? "opacity-60 bg-slate-950/20" : ""
                  }`}
                >
                  {/* 1. Name & Avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.fullName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs">
                            {member.fullName.charAt(0)}
                          </div>
                        )}
                        <span
                          className={`absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                            isActive ? "bg-emerald-500" : "bg-slate-500"
                          }`}
                        />
                      </div>

                      <div className="flex flex-col">
                        <span className="font-bold text-white text-xs sm:text-sm">
                          {member.fullName}
                        </span>
                        {member.phone && (
                          <span className="text-[11px] text-slate-400 mt-0.5 font-mono">
                            {member.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 2. Email */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span dir="ltr" className="font-mono text-xs text-slate-300">
                      {member.email}
                    </span>
                  </td>

                  {/* 3. Role Dropdown */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-48">
                        <ESelect
                          value={member.role}
                          onValueChange={(val) => onUpdateRole(member.id, val as AdminRole)}
                          options={[
                            { value: "super_admin", label: "مدیر کل (Super Admin)" },
                            { value: "inventory_manager", label: "مدیر انبارداری و محصولات" },
                            { value: "support_agent", label: "کارشناس پشتیبانی و تیکت" },
                          ]}
                          className="w-full text-xs"
                        />
                      </div>
                    </div>
                  </td>

                  {/* 4. Last Active */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{member.lastActive}</span>
                    </div>
                  </td>

                  {/* 5. Status & Switch */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <ESwitch
                        checked={isActive}
                        onCheckedChange={() => onToggleStatus(member.id)}
                      />
                      <ActivationBage
                        label={isActive ? "حساب فعال" : "غیرفعال"}
                        status={isActive ? "active" : "inactive"}
                        className="text-[10px] px-1.5 py-0"
                      />
                    </div>
                  </td>

                  {/* 6. Actions */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <EButton
                      variant="secondary"
                      size="sm"
                      onClick={() => onDelete(member.id)}
                      icon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
                      className="p-1.5 hover:bg-rose-500/10 text-rose-400 border-rose-500/20"
                      title="حذف دسترسی مدیر"
                    />
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

export default StaffTable;
