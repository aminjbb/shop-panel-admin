import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  CheckCheck,
  ShoppingBag,
  AlertTriangle,
  MessageSquare,
  Headphones,
  Trash2,
  ExternalLink,
  Clock,
  Inbox,
} from "lucide-react";
import useNotifications from "@/features/feedback/hooks/useNotifications";
import type { AdminNotification, NotificationType } from "@/types/feedback";
import type { AppRoute } from "@/shared-app/appSidebar/types";
import BottomSheet from "@/shared-app/bottomSheet";
import EButton from "@/shared-app/designSystem/button";

export interface NotificationCenterProps {
  onNavigate: (route: AppRoute) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onNavigate }) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Check screen size for desktop popover vs mobile bottomsheet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen && !isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isMobile]);

  const handleNotificationClick = async (notif: AdminNotification) => {
    if (!notif.isRead) {
      await markAsRead(notif.id);
    }
    setIsOpen(false);
    if (notif.targetUrl) {
      onNavigate(notif.targetUrl as AppRoute);
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      case "low_stock":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "review":
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case "ticket":
        return <Headphones className="w-4 h-4 text-indigo-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTypeBadgeColor = (type: NotificationType) => {
    switch (type) {
      case "order":
        return "bg-emerald-500/15 border-emerald-500/30 text-emerald-300";
      case "low_stock":
        return "bg-amber-500/15 border-amber-500/30 text-amber-300";
      case "review":
        return "bg-purple-500/15 border-purple-500/30 text-purple-300";
      case "ticket":
        return "bg-indigo-500/15 border-indigo-500/30 text-indigo-300";
      default:
        return "bg-slate-800 border-slate-700 text-slate-300";
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const now = new Date().getTime();
      const diff = now - new Date(dateStr).getTime();
      const mins = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (mins < 2) return "هم‌اکنون";
      if (mins < 60) return `${mins} دقیقه پیش`;
      if (hours < 24) return `${hours} ساعت پیش`;
      if (days < 7) return `${days} روز پیش`;
      return new Date(dateStr).toLocaleDateString("fa-IR");
    } catch {
      return dateStr;
    }
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === "unread" ? !n.isRead : true
  );

  const renderNotificationList = () => {
    if (filteredNotifications.length === 0) {
      return (
        <div className="py-12 px-4 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <Inbox className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-300">
            {filter === "unread"
              ? "هیچ اعلان خوانده‌نشده‌ای ندارید"
              : "لیست اعلان‌ها خالی است"}
          </p>
          <p className="text-[11px] text-slate-400">
            رویدادهای جدید سفارش‌ها، تیکت‌ها و نظرات در اینجا ثبت می‌شوند.
          </p>
        </div>
      );
    }

    return (
      <div className="divide-y divide-slate-800/60 max-h-[380px] overflow-y-auto scrollbar-thin">
        {filteredNotifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => handleNotificationClick(notif)}
            className={`p-3.5 flex items-start gap-3 hover:bg-slate-800/40 transition-colors cursor-pointer group ${
              !notif.isRead ? "bg-indigo-950/20" : ""
            }`}
          >
            {/* Category Icon */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${getTypeBadgeColor(
                notif.type
              )}`}
            >
              {getTypeIcon(notif.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h5
                  className={`text-xs leading-snug line-clamp-1 ${
                    !notif.isRead ? "font-bold text-white" : "font-medium text-slate-300"
                  }`}
                >
                  {notif.title}
                </h5>
                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 animate-pulse" />
                )}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                {notif.message}
              </p>

              <div className="flex items-center justify-between gap-2 pt-1 text-[10px] text-slate-400">
                <div className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{formatRelativeTime(notif.createdAt)}</span>
                </div>

                <div
                  className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => deleteNotification(notif.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="حذف اعلان"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNotificationClick(notif)}
                    className="p-1 rounded text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors cursor-pointer flex items-center gap-0.5"
                    title="مشاهده جزئیات"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        id="header-notification-bell-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
        aria-label="مرکز اعلان‌های سیستم"
        title="اعلان‌ها و رویدادها"
      >
        <Bell className="w-4 h-4 text-slate-300 group-hover:text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-md shadow-rose-500/40 animate-pulse">
            {unreadCount > 9 ? "+9" : unreadCount}
          </span>
        )}
      </button>

      {/* Desktop Popover Dropdown */}
      {!isMobile && isOpen && (
        <div
          id="header-notifications-dropdown"
          className="absolute end-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl shadow-black/80 z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Header */}
          <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">مرکز اعلان‌های ادمین</h4>
                <p className="text-[10px] text-slate-400">
                  {unreadCount} پیام خوانده‌نشده
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <EButton
                variant="secondary"
                size="sm"
                onClick={markAllAsRead}
                icon={<CheckCheck className="w-3.5 h-3.5 text-indigo-400" />}
                className="text-[11px] py-1 px-2.5 text-indigo-300 hover:bg-indigo-500/10"
              >
                خواندن همه
              </EButton>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center px-3 pt-2 pb-1 border-b border-slate-800/80 gap-1 bg-slate-900/40 text-xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
                filter === "all"
                  ? "bg-slate-800 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              همه ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
                filter === "unread"
                  ? "bg-slate-800 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              خوانده‌نشده ({unreadCount})
            </button>
          </div>

          {/* List Content */}
          {renderNotificationList()}
        </div>
      )}

      {/* Mobile Drawer / BottomSheet */}
      {isMobile && (
        <BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={
            <div className="flex items-center justify-between gap-3 w-full pe-6">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Bell className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  مرکز اعلان‌های ادمین ({unreadCount} جدید)
                </h4>
              </div>
              {unreadCount > 0 && (
                <EButton
                  variant="secondary"
                  size="sm"
                  onClick={markAllAsRead}
                  icon={<CheckCheck className="w-3 h-3 text-indigo-400" />}
                  className="text-[11px] py-1 px-2"
                >
                  خواندن همه
                </EButton>
              )}
            </div>
          }
          size="md"
        >
          <div className="space-y-3 -mx-4 -mb-4">
            <div className="flex items-center px-4 gap-1 text-xs">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                  filter === "all"
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-slate-900 text-slate-400"
                }`}
              >
                همه ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("unread")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                  filter === "unread"
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-slate-900 text-slate-400"
                }`}
              >
                خوانده‌نشده ({unreadCount})
              </button>
            </div>

            {renderNotificationList()}
          </div>
        </BottomSheet>
      )}
    </div>
  );
};

export default NotificationCenter;
