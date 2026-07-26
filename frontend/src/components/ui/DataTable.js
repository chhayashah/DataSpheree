import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "./Card";
import { EmptyState } from "./Misc";
import { TableCardSkeleton } from "./Skeleton";

const DataTable = ({
  columns,
  rows,
  rowKey = "_id",
  loading,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  emptyAction,
  onRowClick,
  sortBy,
  sortDir,
  onSort,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  page,
  pages,
  onPageChange,
}) => {
  if (loading) return <TableCardSkeleton rows={6} cols={columns.length} />;

  if (rows.length === 0) {
    return (
      <Card>
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      </Card>
    );
  }

  const selectable = Boolean(selectedIds);
  const allSelected =
    selectable && rows.every((r) => selectedIds.has(r[rowKey]));

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onToggleSelectAll(e.target.checked)}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 text-[11px] font-medium text-slate-400 border-b border-slate-100"
                >
                  {col.sortable ? (
                    <button
                      onClick={() => onSort(col.key)}
                      className="flex items-center gap-1 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                    >
                      {col.label}
                      {sortBy === col.key &&
                        (sortDir === "asc" ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        ))}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row[rowKey]}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-slate-50 last:border-0 ${
                  onRowClick ? "cursor-pointer hover:bg-slate-50" : ""
                } transition-colors`}
              >
                {selectable && (
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(row[rowKey])}
                      onChange={() => onToggleSelect(row[rowKey])}
                      aria-label={`Select row ${row[rowKey]}`}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-slate-700 ${col.className || ""}`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            Page {page} of {pages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= pages}
              aria-label="Next page"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DataTable;
