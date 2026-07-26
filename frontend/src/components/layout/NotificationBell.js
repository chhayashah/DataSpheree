import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  BellOff,
  UploadCloud,
  ShieldAlert,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { useNotifications } from "../../features/notifications/hooks/useNotifications";

const TYPE_ICON = {
  upload_processed: UploadCloud,
  role_change: ShieldAlert,
  suspended: ShieldAlert,
  activated: UserCheck,
  invited: Sparkles,
};

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const { notifications, unreadCount, loading, markRead, markAllRead } =
    useNotifications(6);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        className="relative text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger" />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-white shadow-popover border border-border overflow-hidden origin-top-right animate-[fadeIn_120ms_ease-out]"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-slate-800">
              Notifications
            </p>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-accent font-medium hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {!loading && notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 px-6 text-center">
              <BellOff size={22} strokeWidth={1.5} className="text-slate-300" />
              <p className="text-sm text-slate-500">You're all caught up</p>
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = TYPE_ICON[n.type] || Bell;
                return (
                  <li key={n._id}>
                    <button
                      onClick={() => markRead(n._id)}
                      className={`w-full flex items-start gap-2.5 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                        n.read ? "" : "bg-accent-soft/40"
                      }`}
                    >
                      <Icon
                        size={15}
                        className="text-slate-400 mt-0.5 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-700">{n.message}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <Link
            to="/notifications"
            onClick={() => setOpen(false)}
            className="block text-center text-xs font-medium text-accent py-2.5 border-t border-border hover:bg-slate-50 transition-colors"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
