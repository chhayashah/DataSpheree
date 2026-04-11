import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../../services/axiosInstance";
import { useAuth } from "../../../context/AuthContext";

const COLORS = [
  "#4f46e5",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, trendRes, topRes] = await Promise.all([
        axiosInstance.get("/analytics/stats"),
        axiosInstance.get("/analytics/daily-trend"),
        axiosInstance.get("/analytics/top-users"),
      ]);
      setStats(statsRes.data.data);
      setTrend(trendRes.data.data);
      setRecentUploads(statsRes.data.data.recentRecords || []);
      setTopUsers(topRes.data.data || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line

  if (loading) return <div style={styles.loading}>Loading dashboard...</div>;

  // Pie chart data
  const pieData =
    topUsers.length > 0
      ? topUsers.map((u) => ({ name: u.name, value: u.uploadCount }))
      : [{ name: "No data", value: 1 }];

  // Source distribution for pie
  // const sourceData = [
  //   { name: "CSV", value: stats?.totalRecords || 0 },
  //   { name: "API", value: 0 },
  // ];

  return (
    <div style={styles.page}>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Welcome back, {user?.name}!</p>
        </div>
        <button style={styles.refreshBtn} onClick={fetchData}>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <StatCard
          label="Total Records"
          value={stats?.totalRecords ?? 0}
          color="#4f46e5"
          border="#4f46e5"
        />
        <StatCard
          label="Total Rows"
          value={stats?.totalRows ?? 0}
          color="#0ea5e9"
          border="#0ea5e9"
        />
        <StatCard
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          color="#10b981"
          border="#10b981"
        />
        <StatCard
          label="Today Uploads"
          value={trend[trend.length - 1]?.uploads ?? 0}
          color="#f59e0b"
          border="#f59e0b"
        />
      </div>

      {/* Charts Row 1 — Bar + Line */}
      <div style={styles.row2}>
        {/* Bar Chart — Daily Trend */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Daily Upload Trend</h3>
          {trend.length === 0 ? (
            <p style={styles.empty}>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={trend}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(v) => v?.slice(5)}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                  formatter={(v) => [v, "Uploads"]}
                />
                <Bar dataKey="uploads" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Line Chart — Rows Trend */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Rows Processed Over Time</h3>
          {trend.length === 0 ? (
            <p style={styles.empty}>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={trend}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(v) => v?.slice(5)}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                  formatter={(v) => [v, "Rows"]}
                />
                <Line
                  type="monotone"
                  dataKey="totalRows"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts Row 2 — Pie + Recent */}
      <div style={styles.row2}>
        {/* Pie Chart — Top Users */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Upload Distribution by User</h3>
          {topUsers.length === 0 ? (
            <p style={styles.empty}>No user data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => (
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      {v}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Uploads Table */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Recent Uploads</h3>
          {recentUploads.length === 0 ? (
            <p style={styles.empty}>No uploads yet</p>
          ) : (
            <>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>File</th>
                    <th style={styles.th}>Rows</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>By</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUploads.map((r) => (
                    <tr key={r._id} style={styles.tr}>
                      <td style={styles.td}>{r.filename}</td>
                      <td style={styles.td}>{r.totalRows}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.badge,
                            background:
                              r.status === "processed" ? "#d1fae5" : "#fef3c7",
                            color:
                              r.status === "processed" ? "#065f46" : "#92400e",
                          }}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td style={styles.td}>{r.uploadedBy?.name || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <a href="/data" style={styles.viewAll}>
                View all records →
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, border }) => (
  <div style={{ ...styles.statCard, borderTop: `3px solid ${border}` }}>
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
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  title: { fontSize: "24px", fontWeight: "700", margin: 0, color: "#1e293b" },
  subtitle: { fontSize: "13px", color: "#94a3b8", margin: "4px 0 0" },
  refreshBtn: {
    padding: "8px 16px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
    color: "#64748b",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
    fontSize: "16px",
    color: "#94a3b8",
  },
  statsGrid: {
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
  statValue: { margin: 0, fontSize: "32px", fontWeight: "700" },
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
    padding: "40px 0",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: {
    textAlign: "left",
    padding: "8px",
    color: "#94a3b8",
    fontWeight: "500",
    fontSize: "12px",
    borderBottom: "1px solid #f1f5f9",
  },
  tr: { borderBottom: "1px solid #f8fafc" },
  td: { padding: "10px 8px", color: "#334155" },
  badge: {
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "500",
  },
  viewAll: {
    display: "block",
    marginTop: "12px",
    fontSize: "13px",
    color: "#4f46e5",
    textDecoration: "none",
  },
};

export default DashboardPage;
