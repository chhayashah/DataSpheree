import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2, FileText } from "lucide-react";
import {
  PageHeader,
  EmptyState,
  PageSpinner,
} from "../../../components/ui/Misc";
import { Card, CardHeader, CardBody } from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Tabs from "../../../components/ui/Tabs";
import Alert from "../../../components/ui/Alert";
import StatusBadge from "../../../components/ui/StatusBadge";
import ActivityTimeline from "../../../components/ui/ActivityTimeline";
import { useDatasetDetails } from "../hooks/useDatasetDetails";
import { useAuth } from "../../../context/AuthContext";
import { PERMISSIONS } from "../../../constants/permissions";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "schema", label: "Schema" },
  { key: "timeline", label: "Timeline" },
  { key: "insights", label: "Insights" },
  { key: "related", label: "Related" },
];

const formatBytes = (bytes) => {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const inferType = (values) => {
  const sample = values.find((v) => v !== null && v !== undefined && v !== "");
  if (sample === undefined) return "unknown";
  if (!isNaN(Number(sample)) && sample !== "") return "number";
  if (!isNaN(Date.parse(sample)) && String(sample).length > 6) return "date";
  return "string";
};

const StatCard = ({ label, value }) => (
  <div className="bg-slate-50 rounded-xl p-4">
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    <p className="text-xl font-semibold text-slate-900 font-data">{value}</p>
  </div>
);

const DatasetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const canManage = hasPermission(PERMISSIONS.DATA_MANAGE);
  const [activeTab, setActiveTab] = useState("overview");

  const { record, insights, related, activity, loading, notFound, remove } =
    useDatasetDetails(id);

  if (loading) return <PageSpinner label="Loading dataset…" />;

  if (notFound || !record) {
    return (
      <Card>
        <EmptyState
          title="Dataset not found"
          description="It may have been deleted, or you may not have access to it."
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/data")}
            >
              Back to Datasets
            </Button>
          }
        />
      </Card>
    );
  }

  const previewRows = record.processedData?.slice(0, 20) || [];
  const columns = previewRows.length > 0 ? Object.keys(previewRows[0]) : [];

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${record.filename}"? This can't be undone.`))
      return;
    const ok = await remove();
    if (ok) navigate("/data");
  };

  return (
    <div>
      <PageHeader
        title={record.filename}
        subtitle={`Uploaded ${new Date(record.createdAt).toLocaleDateString("en-IN")}`}
        action={
          canManage && (
            <Button size="sm" variant="danger" onClick={handleDelete}>
              <Trash2 size={13} /> Delete
            </Button>
          )
        }
      />

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Rows" value={record.totalRows} />
            <StatCard label="File size" value={formatBytes(record.fileSize)} />
            <StatCard label="Columns" value={columns.length || "—"} />
            <StatCard
              label="Status"
              value={<StatusBadge status={record.status} />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Metadata" />
              <CardBody className="space-y-2 text-sm">
                <MetaRow label="Owner" value={record.uploadedBy?.name || "—"} />
                <MetaRow label="Source" value={record.source} />
                <MetaRow
                  label="Uploaded"
                  value={new Date(record.createdAt).toLocaleString()}
                />
                <MetaRow
                  label="Last updated"
                  value={new Date(record.updatedAt).toLocaleString()}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Preview" />
              <CardBody>
                {previewRows.length === 0 ? (
                  <p className="text-sm text-slate-400">No preview available</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr>
                          {columns.slice(0, 5).map((c) => (
                            <th
                              key={c}
                              className="text-left px-2 py-1.5 text-slate-400 font-medium"
                            >
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewRows.slice(0, 5).map((row, i) => (
                          <tr key={i} className="border-t border-slate-50">
                            {columns.slice(0, 5).map((c) => (
                              <td
                                key={c}
                                className="px-2 py-1.5 font-data text-slate-600"
                              >
                                {String(row[c])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "schema" && (
        <Card>
          <CardBody>
            {columns.length === 0 ? (
              <p className="text-sm text-slate-400">No schema to display.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left px-2 py-2 text-[11px] font-medium text-slate-400 border-b border-slate-100">
                      Column
                    </th>
                    <th className="text-left px-2 py-2 text-[11px] font-medium text-slate-400 border-b border-slate-100">
                      Inferred type
                    </th>
                    <th className="text-left px-2 py-2 text-[11px] font-medium text-slate-400 border-b border-slate-100">
                      Sample value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {columns.map((col) => {
                    const values = previewRows.map((r) => r[col]);
                    return (
                      <tr
                        key={col}
                        className="border-b border-slate-50 last:border-0"
                      >
                        <td className="px-2 py-2.5 font-medium text-slate-700">
                          {col}
                        </td>
                        <td className="px-2 py-2.5">
                          <span className="text-xs bg-slate-100 text-slate-500 rounded px-2 py-0.5">
                            {inferType(values)}
                          </span>
                        </td>
                        <td className="px-2 py-2.5 font-data text-slate-500">
                          {String(
                            values.find((v) => v !== "" && v != null) ?? "—",
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      )}

      {activeTab === "timeline" && (
        <Card>
          <CardBody>
            <ActivityTimeline
              entries={activity}
              emptyLabel="No recorded activity for this dataset"
            />
          </CardBody>
        </Card>
      )}

      {activeTab === "insights" && (
        <div className="space-y-2.5">
          {insights.map((insight, i) => (
            <Alert key={i} tone={insight.type}>
              {insight.message}
            </Alert>
          ))}
        </div>
      )}

      {activeTab === "related" && (
        <Card>
          {related.length === 0 ? (
            <EmptyState
              title="No related datasets"
              description="Other datasets from this uploader will appear here."
            />
          ) : (
            <div className="divide-y divide-slate-50">
              {related.map((r) => (
                <button
                  key={r._id}
                  onClick={() => navigate(`/data/${r._id}`)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-slate-50 transition-colors"
                >
                  <FileText size={15} className="text-slate-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-800 truncate">
                      {r.filename}
                    </p>
                    <p className="text-xs text-slate-400">{r.totalRows} rows</p>
                  </div>
                  <StatusBadge status={r.status} />
                </button>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

const MetaRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-400">{label}</span>
    <span className="text-slate-700 font-medium">{value}</span>
  </div>
);

export default DatasetDetailsPage;
