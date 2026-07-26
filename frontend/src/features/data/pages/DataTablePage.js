import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2, X } from "lucide-react";
import { PageHeader } from "../../../components/ui/Misc";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";
import SearchBar from "../../../components/ui/SearchBar";
import FilterBar from "../../../components/ui/FilterBar";
import StatusBadge from "../../../components/ui/StatusBadge";
import { useDatasetList } from "../hooks/useDatasetList";
import { useAuth } from "../../../context/AuthContext";
import { PERMISSIONS } from "../../../constants/permissions";

const STATUS_FILTER_OPTIONS = [
  { value: "processed", label: "Processed" },
  { value: "processing", label: "Processing" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

const formatBytes = (bytes) => {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const DataTablePage = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const canManage = hasPermission(PERMISSIONS.DATA_MANAGE);
  const canViewAll = hasPermission(PERMISSIONS.DATA_VIEW_ALL);

  const {
    rows,
    pagination,
    loading,
    search,
    setSearch,
    filters,
    setFilters,
    sortBy,
    sortDir,
    handleSort,
    setPage,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    removeOne,
    removeSelected,
    dateRange,
    clearDateRange,
  } = useDatasetList();

  const columns = [
    { key: "filename", label: "Filename", sortable: true },
    { key: "totalRows", label: "Rows", sortable: true, className: "font-data" },
    {
      key: "fileSize",
      label: "Size",
      render: (r) => formatBytes(r.fileSize),
      className: "font-data",
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (r) => <StatusBadge status={r.status} />,
    },
    ...(canViewAll
      ? [
          {
            key: "owner",
            label: "Owner",
            render: (r) => r.uploadedBy?.name || "—",
          },
        ]
      : []),
    {
      key: "createdAt",
      label: "Last updated",
      sortable: true,
      className: "font-data",
      render: (r) =>
        new Date(r.updatedAt || r.createdAt).toLocaleDateString("en-IN"),
    },
    ...(canManage
      ? [
          {
            key: "actions",
            label: "",
            className: "text-right",
            render: (r) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeOne(r._id);
                }}
                aria-label={`Delete ${r.filename}`}
                className="text-slate-300 hover:text-danger p-1 rounded-md hover:bg-danger-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
              >
                <Trash2 size={14} />
              </button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <PageHeader
        title="Datasets"
        subtitle={`${pagination.total} dataset${pagination.total === 1 ? "" : "s"}`}
      />

      {dateRange && (
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft text-accent text-xs font-medium pl-3 pr-2 py-1">
            {new Date(dateRange.from).toLocaleDateString("en-IN")}
            <button
              onClick={clearDateRange}
              aria-label="Clear date filter"
              className="hover:bg-accent/20 rounded-full p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </span>
          <span className="text-xs text-slate-400">
            from Analytics drill-down
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search datasets…"
          />
          <FilterBar
            filters={[
              {
                key: "status",
                label: "All statuses",
                options: STATUS_FILTER_OPTIONS,
              },
            ]}
            values={filters}
            onChange={setFilters}
          />
        </div>

        {canManage && selectedIds.size > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>{selectedIds.size} selected</span>
            <Button size="sm" variant="danger" onClick={removeSelected}>
              <Trash2 size={13} /> Delete
            </Button>
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No datasets yet"
        emptyDescription="Upload a CSV file to start seeing your data here."
        emptyAction={
          <Link to="/data/upload">
            <Button size="sm">
              <Plus size={14} /> Upload your first dataset
            </Button>
          </Link>
        }
        onRowClick={(row) => navigate(`/data/${row._id}`)}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={handleSort}
        selectedIds={canManage ? selectedIds : undefined}
        onToggleSelect={canManage ? toggleSelect : undefined}
        onToggleSelectAll={canManage ? toggleSelectAll : undefined}
        page={pagination.page}
        pages={pagination.pages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default DataTablePage;
