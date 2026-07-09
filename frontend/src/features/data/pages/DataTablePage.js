import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import axiosInstance from "../../../services/axiosInstance";
import { Card, CardBody } from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { PageHeader, EmptyState } from "../../../components/ui/Misc";
import { PageWithTableSkeleton } from "../../../components/ui/Skeleton";

const DataTablePage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axiosInstance.get("/data");
        setRecords(res.data.data);
      } catch (err) {
        console.error("Records fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  if (loading) return <PageWithTableSkeleton rows={6} cols={8} />;

  return (
    <div>
      <PageHeader
        title="Records"
        subtitle={`${records.length} record${records.length === 1 ? "" : "s"} found`}
        action={
          <Link to="/data/upload">
            <Button size="sm">
              <Plus size={14} /> Upload CSV
            </Button>
          </Link>
        }
      />

      {records.length === 0 ? (
        <Card>
          <EmptyState
            title="No records yet"
            description="Upload a CSV file to start seeing your data here."
            action={
              <Link to="/data/upload">
                <Button size="sm">
                  <Plus size={14} /> Upload your first file
                </Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <Card className="overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <Th>#</Th>
                  <Th>Filename</Th>
                  <Th>Source</Th>
                  <Th>Rows</Th>
                  <Th>Status</Th>
                  <Th>Uploaded By</Th>
                  <Th>Date</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr
                    key={r._id}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <Td className="font-data">{i + 1}</Td>
                    <Td>{r.filename}</Td>
                    <Td>
                      <Badge tone="accent">{r.source}</Badge>
                    </Td>
                    <Td className="font-data">{r.totalRows}</Td>
                    <Td>
                      <Badge
                        tone={r.status === "processed" ? "success" : "warning"}
                      >
                        {r.status}
                      </Badge>
                    </Td>
                    <Td>{r.uploadedBy?.name || "—"}</Td>
                    <Td className="font-data">
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        variant={
                          selected?._id === r._id ? "outline" : "primary"
                        }
                        onClick={() =>
                          setSelected(selected?._id === r._id ? null : r)
                        }
                      >
                        {selected?._id === r._id ? "Hide" : "View"}
                      </Button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selected && (
        <Card>
          <CardBody>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Preview — {selected.filename}
              </h3>
              <span className="text-xs text-slate-400">
                {selected.processedData?.length} rows
              </span>
            </div>
            {selected.processedData?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {Object.keys(selected.processedData[0]).map((key) => (
                        <Th key={key}>{key}</Th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selected.processedData.slice(0, 10).map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-slate-50 last:border-0"
                      >
                        {Object.values(row).map((val, j) => (
                          <Td key={j} className="font-data">
                            {val}
                          </Td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-400">No data to preview</p>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};

const Th = ({ children }) => (
  <th className="text-left px-4 py-3 text-[11px] font-medium text-slate-400 border-b border-slate-100">
    {children}
  </th>
);
const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-slate-700 ${className}`}>{children}</td>
);

export default DataTablePage;
