import React from "react";
import type { AdminStaff, AdminRole } from "@/types/settings";
import { EButton } from "@/shared-app/designSystem/button";
import { ESwitch } from "@/shared-app/designSystem/switch";
import { ESelect } from "@/shared-app/designSystem/select";
import ActivationBage from "@/shared-app/activationbage";
import {
  ShieldCheck,
  Shield,
  Headphones,
  Mail,
  Phone,
  Clock,
  Trash2,
  UserCheck,
} from "lucide-react";

export interface StaffCardProps {
  member: AdminStaff;
  onUpdateRole: (id: string, role: AdminRole) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export const getRoleInfo = (role: AdminRole) => {
  switch (role) {
    case "super_admin":
      return {
        label: "مدیر کل (Super Admin)",
        shortLabel: "مدیر کل",
        colorClass: "bg-purple-500/10 text-purple-300 border-purple-500/20",
        icon: <ShieldCheck className="w-3.5 h-3.5" />,
      };
    case "inventory_manager":
      return {
        label: "مدیر انبارداری و کالا",
        shortLabel: "مدیر انبار",
        colorClass: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
        icon: <Shield className="w-3.5 h-3.5" />,
      };
    case "support_agent":
      return {
        label: "کارشناس پشتیبانی",
        shortLabel: "پشتیبان",
        colorClass: "bg-amber-500/10 text-amber-300 border-amber-500/20",
        icon: <Headphones className="w-3.5 h-3.5" />,
      };
    default:
      return {
        label: "عضو سیستم",
        shortLabel: "عضو",
        colorClass: "bg-slate-800 text-slate-300 border-slate-700",
        icon: <Shield className="w-3.5 h-3.5" />,
      };
  }
};

export const StaffCard: React.FC<StaffCardProps> = ({
  member,
  onUpdateRole,
  onToggleStatus,
  onDelete,
}) => {
  const roleInfo = getRoleInfo(member.role);
  const isActive = member.status === "active";

  return (
    <div
      id={`staff-card-${member.id}`}
      className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col gap-3.5 ${
        isActive
          ? "bg-slate-900/90 border-slate-800 shadow-xs"
          : "bg-slate-950/60 border-slate-900 opacity-75"
      }`}
    >
      {/* Top Header: Avatar + Name + Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.fullName}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-xl object-cover border border-slate-700"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
                {member.fullName.charAt(0)}
              </div>
            )}
            <span
              className={`absolute -bottom-1 -left-1 w-3 h-3 rounded-full border-2 border-slate-900 ${
                isActive ? "bg-emerald-500" : "bg-slate-500"
              }`}
            />
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate">
              {member.fullName}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400">
              <span dir="ltr" className="truncate font-mono">{member.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <ESwitch
            checked={isActive}
            onCheckedChange={() => onToggleStatus(member.id)}
          />
          <ActivationBage
            label={isActive ? "فعال" : "غیرفعال"}
            status={isActive ? "active" : "inactive"}
            className="text-[10px] px-1.5 py-0.5"
          />
        </div>
      </div>

      {/* Details Row: Role Badge & Last active */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${roleInfo.colorClass}`}
        >
          {roleInfo.icon}
          <span>{roleInfo.label}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{member.lastLogin || "اخیراً"}</span>
        </div>
      </div>

      {/* Role Selection & Actions Footer */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
        <div className="w-44">
          <ESelect
            value={member.role}
            onValueChange={(val) => onUpdateRole(member.id, val as AdminRole)}
            options={[
              { value: "super_admin", label: "مدیر کل (Super Admin)" },
              { value: "inventory_manager", label: "مدیر انبارداری" },
              { value: "support_agent", label: "کارشناس پشتیبانی" },
            ]}
            className="w-full text-xs"
          />
        </div>

        <EButton
          variant="secondary"
          size="sm"
          onClick={() => onDelete(member.id)}
          icon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
          className="text-xs py-1 px-2.5 text-rose-400 hover:bg-rose-500/10 border-rose-500/20"
        >
          حذف
        </EButton>
      </div>
    </div>
  );
};

export default StaffCard;
