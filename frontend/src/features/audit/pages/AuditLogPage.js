import { PageHeader } from "../../../components/ui/Misc";
import DataTable from "../../../components/ui/DataTable";
import FilterBar from "../../../components/ui/FilterBar";
import Badge from "../../../components/ui/Badge";
import { useAuditLog } from "../hooks/useAuditLog";

const ACTION_LABELS = {
  invite: "User invited",
  role_change: "Role changed",
  suspend: "User suspended",
  activate: "User reactivated",
  delete: "Dataset deleted",
  update: "Profile updated",
};

const ACTION_TONE = {
  invite: "accent",
  role_change: "warning",
  suspend: "danger",
  activate: "success",
  delete: "danger",
  update: "neutral",
};

const AuditLogPage = () => {
  const {
    rows,
    pagination,
    actionTypes,
    loading,
    filters,
    setFilters,
    setPage,
  } = useAuditLog();

  const actionFilterOptions = actionTypes.map((a) => ({
    value: a,
    label: ACTION_LABELS[a] || a,
  }));

  const columns = [
    {
      key: "createdAt",
      label: "Time",
      className: "font-data whitespace-nowrap",
      render: (r) => new Date(r.createdAt).toLocaleString(),
    },
    {
      key: "user",
      label: "Actor",
      render: (r) => (r.user ? `${r.user.name} (${r.user.role})` : "—"),
    },
    {
      key: "action",
      label: "Action",
      render: (r) => (
        <Badge tone={ACTION_TONE[r.action] || "neutral"}>
          {ACTION_LABELS[r.action] || r.action}
        </Badge>
      ),
    },
    { key: "details", label: "Details" },
    { key: "ipAddress", label: "IP", className: "font-data text-slate-400" },
  ];

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        subtitle="Immutable record of sensitive account and dataset actions"
      />

      <div className="mb-4">
        <FilterBar
          filters={[
            {
              key: "action",
              label: "All actions",
              options: actionFilterOptions,
            },
          ]}
          values={filters}
          onChange={setFilters}
        />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No audit events yet"
        emptyDescription="Sensitive actions — role changes, invites, suspensions, deletions — will appear here as they happen."
        page={pagination.page}
        pages={pagination.pages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default AuditLogPage;
