import { useState, useEffect } from "react";
import axiosInstance from "../../../services/axiosInstance";

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

  if (loading) return <div style={styles.loading}>Loading records...</div>;

  return (
    <div style={styles.page}>
      {/* Header */}
      {/* <div style={styles.header}>
        <div>
          <h1 style={styles.title}>All Records</h1>
          <p style={styles.subtitle}>{records.length} records found</p>
        </div>
        <div style={styles.headerBtns}>
          <a href="/data/upload" style={styles.btnPrimary}>
            + Upload CSV
          </a>
          <a href="/dashboard" style={styles.btnOutline}>
            Dashboard
          </a>
        </div>
      </div> */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>All Records</h1>
          <p style={styles.subtitle}>{records.length} records found</p>
        </div>
        <a href="/data/upload" style={styles.btnPrimary}>
          + Upload CSV
        </a>
      </div>

      {/* Table */}
      {records.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyText}>Koi records nahi hain abhi</p>
          <a href="/data/upload" style={styles.btnPrimary}>
            Upload karo
          </a>
        </div>
      ) : (
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Filename</th>
                <th style={styles.th}>Source</th>
                <th style={styles.th}>Rows</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Uploaded By</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r._id} style={styles.tr}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={styles.td}>{r.filename}</td>
                  <td style={styles.td}>
                    <span style={styles.sourceBadge}>{r.source}</span>
                  </td>
                  <td style={styles.td}>{r.totalRows}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        background:
                          r.status === "processed" ? "#d1fae5" : "#fef3c7",
                        color: r.status === "processed" ? "#065f46" : "#92400e",
                      }}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td style={styles.td}>{r.uploadedBy?.name || "—"}</td>
                  <td style={styles.td}>
                    {new Date(r.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.viewBtn}
                      onClick={() =>
                        setSelected(selected?._id === r._id ? null : r)
                      }
                    >
                      {selected?._id === r._id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Data Preview */}
      {selected && (
        <div style={styles.previewCard}>
          <h3 style={styles.previewTitle}>
            Preview — {selected.filename}
            <span style={styles.previewCount}>
              {selected.processedData?.length} rows
            </span>
          </h3>
          {selected.processedData?.length > 0 ? (
            <div style={styles.previewScroll}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    {Object.keys(selected.processedData[0]).map((key) => (
                      <th key={key} style={styles.th}>
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selected.processedData.slice(0, 10).map((row, i) => (
                    <tr key={i} style={styles.tr}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} style={styles.td}>
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={styles.emptyText}>No data to preview</p>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "sans-serif",
    background: "#f8fafc",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  title: { fontSize: "24px", fontWeight: "700", margin: 0, color: "#1e293b" },
  subtitle: { fontSize: "13px", color: "#94a3b8", margin: "4px 0 0" },
  headerBtns: { display: "flex", gap: "10px" },
  btnPrimary: {
    padding: "9px 18px",
    background: "#4f46e5",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "500",
  },
  btnOutline: {
    padding: "9px 18px",
    background: "#fff",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontSize: "16px",
    color: "#94a3b8",
  },
  emptyBox: {
    background: "#fff",
    borderRadius: "12px",
    padding: "60px",
    textAlign: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  emptyText: { color: "#94a3b8", fontSize: "14px", marginBottom: "16px" },
  card: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    overflow: "hidden",
    marginBottom: "16px",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  thead: { background: "#f8fafc" },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    color: "#94a3b8",
    fontWeight: "500",
    fontSize: "12px",
    borderBottom: "1px solid #f1f5f9",
  },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px 16px", color: "#334155" },
  badge: {
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "500",
  },
  sourceBadge: {
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "500",
    background: "#e0f2fe",
    color: "#0369a1",
  },
  viewBtn: {
    padding: "5px 12px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
  },
  previewCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  previewTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  previewCount: { fontSize: "12px", color: "#94a3b8", fontWeight: "400" },
  previewScroll: { overflowX: "auto" },
};

export default DataTablePage;
