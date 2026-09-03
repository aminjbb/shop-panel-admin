import { UserRound } from "lucide-react";
import { resolveApiAssetUrl } from "@/config/api";
import type { AdminAvatarProps } from "../types";

export function AdminAvatar({
  user,
  className = "w-10 h-10 rounded-xl",
  iconClassName = "w-5 h-5",
}: AdminAvatarProps) {
  if (user.avatarUrl) {
    return (
      <img
        src={resolveApiAssetUrl(user.avatarUrl)}
        alt={user.fullName}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={user.fullName}
      className={`inline-flex items-center justify-center bg-indigo-500/20 text-indigo-300 ${className}`}
    >
      <UserRound className={iconClassName} />
    </span>
  );
}
