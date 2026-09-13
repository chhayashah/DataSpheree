import {
  UploadCloud,
  ShieldAlert,
  UserCheck,
  Sparkles,
  Bell,
} from "lucide-react";
import { PageHeader } from "../../../components/ui/Misc";
import DataTable from "../../../components/ui/DataTable";
import Button from "../../../components/ui/Button";
import { useNotifications } from "../hooks/useNotifications";

const TYPE_ICON = {
  upload_processed: UploadCloud,
  role_change: ShieldAlert,
  suspended: ShieldAlert,
  activated: UserCheck,
  invited: Sparkles,
};

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    pagination,
    loading,
    setPage,
    markRead,
    markAllRead,
  } = useNotifications(20);

  const columns = [
    {
      key: "message",
      label: "",
      render: (n) => {
        const Icon = TYPE_ICON[n.type] || Bell;
        return (
          <button
            onClick={() => markRead(n._id)}
            className="w-full flex items-start gap-3 text-left"
          >
            <Icon size={16} className="text-slate-400 mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm ${n.read ? "text-slate-600" : "text-slate-900 font-medium"}`}
              >
                {n.message}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
            {!n.read && (
              <span className="h-1.5 w-1.5 rounded-full bg-accent mt-2 shrink-0" />
            )}
          </button>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`${pagination.total} notification${pagination.total === 1 ? "" : "s"}${unreadCount > 0 ? ` · ${unreadCount} unread` : ""}`}
        action={
          unreadCount > 0 && (
            <Button size="sm" variant="outline" onClick={markAllRead}>
              Mark all read
            </Button>
          )
        }
      />

      <DataTable
        columns={columns}
        rows={notifications}
        rowKey="_id"
        loading={loading}
        emptyTitle="No notifications yet"
        emptyDescription="Upload completions, role changes, and account updates will show up here."
        page={pagination.page}
        pages={pagination.pages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default NotificationsPage;
