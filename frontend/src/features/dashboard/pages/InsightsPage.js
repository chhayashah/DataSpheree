import { useState, useEffect } from "react";
import axiosInstance from "../../../services/axiosInstance";

const InsightsPage = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get("/analytics/insights");
        setInsights(res.data.data);
      } catch (err) {
        console.error("Insights error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []); // eslint-disable-line

  if (loading) return <div style={styles.loading}>Loading insights...</div>;

  const typeColors = {
    info: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    warning: { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
    alert: { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" },
    success: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  };

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>AI Insights</h1>
          <p style={styles.subtitle}>Smart analysis of your data patterns</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={styles.grid4}>
        <SummaryCard
          label="Total Records"
          value={insights?.summary?.totalRecords ?? 0}
          color="#4f46e5"
        />
        <SummaryCard
          label="Total Rows"
          value={insights?.summary?.totalRows ?? 0}
          color="#0ea5e9"
        />
        <SummaryCard
          label="Avg Uploads/Day"
          value={insights?.summary?.avgUploadsPerDay ?? 0}
          color="#10b981"
        />
        <SummaryCard
          label="Active Days"
          value={insights?.summary?.activeDays ?? 0}
          color="#f59e0b"
        />
      </div>

      <div style={styles.row2}>
        {/* Smart Suggestions */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Smart Suggestions</h3>
          {insights?.suggestions?.length === 0 ? (
            <p style={styles.empty}>No suggestions yet — upload more data!</p>
          ) : (
            <div style={styles.suggList}>
              {insights?.suggestions?.map((s, i) => {
                const c = typeColors[s.type] || typeColors.info;
                return (
                  <div
                    key={i}
                    style={{
                      ...styles.suggItem,
                      background: c.bg,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    <span style={{ ...styles.suggType, color: c.color }}>
                      {s.type === "info" && "ℹ"}
                      {s.type === "warning" && "⚠"}
                      {s.type === "alert" && "🔴"}
                      {s.type === "success" && "✅"}
                    </span>
                    <span style={{ ...styles.suggMsg, color: c.color }}>
                      {s.message}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Anomalies */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Anomaly Detection</h3>
          {insights?.anomalies?.length === 0 ? (
            <div style={styles.noAnomaly}>
              <p style={styles.noAnomalyText}>No anomalies detected</p>
              <p style={styles.noAnomalySubtext}>
                Your upload pattern looks normal
              </p>
            </div>
          ) : (
            <div style={styles.suggList}>
              {insights?.anomalies?.map((a, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.suggItem,
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                  }}
                >
                  <span style={{ color: "#b91c1c", fontSize: "16px" }}>⚠</span>
                  <span style={{ color: "#b91c1c", fontSize: "13px" }}>
                    {a.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Peak Day */}
      {insights?.peakDay && (
        <div style={styles.peakCard}>
          <h3 style={styles.cardTitle}>Peak Activity Day</h3>
          <div style={styles.peakContent}>
            <div style={styles.peakStat}>
              <p style={styles.peakLabel}>Day of Month</p>
              <p style={styles.peakValue}>{insights.peakDay._id}</p>
            </div>
            <div style={styles.peakStat}>
              <p style={styles.peakLabel}>Uploads</p>
              <p style={{ ...styles.peakValue, color: "#4f46e5" }}>
                {insights.peakDay.uploads}
              </p>
            </div>
            <div style={styles.peakStat}>
              <p style={styles.peakLabel}>Rows Processed</p>
              <p style={{ ...styles.peakValue, color: "#10b981" }}>
                {insights.peakDay.totalRows}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, color }) => (
  <div style={{ ...styles.statCard, borderTop: `3px solid ${color}` }}>
    <p style={styles.statLabel}>{label}</p>
    <p style={{ ...styles.statValue, color }}>{value}</p>
  </div>
);

const styles = {
  page: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "sans-serif",
  },
  pageHeader: { marginBottom: "24px" },
  title: { fontSize: "24px", fontWeight: "700", margin: 0, color: "#1e293b" },
  subtitle: { fontSize: "13px", color: "#94a3b8", margin: "4px 0 0" },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
    fontSize: "16px",
    color: "#94a3b8",
  },
  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "20px",
  },
  statCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px 24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  statLabel: {
    margin: "0 0 8px",
    fontSize: "11px",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  statValue: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "700",
    color: "#1e293b",
  },
  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px 24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  cardTitle: {
    margin: "0 0 16px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
  },
  empty: {
    color: "#94a3b8",
    fontSize: "13px",
    textAlign: "center",
    padding: "30px 0",
  },
  suggList: { display: "flex", flexDirection: "column", gap: "10px" },
  suggItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "12px 14px",
    borderRadius: "8px",
  },
  suggType: { fontSize: "16px", flexShrink: 0 },
  suggMsg: { fontSize: "13px", lineHeight: "1.5" },
  noAnomaly: { textAlign: "center", padding: "30px 0" },
  noAnomalyText: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#10b981",
    margin: "0 0 4px",
  },
  noAnomalySubtext: { fontSize: "13px", color: "#94a3b8", margin: 0 },
  peakCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px 24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  peakContent: { display: "flex", gap: "40px" },
  peakStat: {},
  peakLabel: { fontSize: "12px", color: "#94a3b8", margin: "0 0 4px" },
  peakValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
  },
};

export default InsightsPage;
