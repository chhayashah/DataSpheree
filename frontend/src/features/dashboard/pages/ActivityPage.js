import { useState, useEffect } from "react";
import axiosInstance from "../../../services/axiosInstance";

const ACTION_COLORS = {
  login: { bg: "#eff6ff", color: "#1d4ed8", label: "Login" },
  logout: { bg: "#f0fdf4", color: "#15803d", label: "Logout" },
  upload: { bg: "#fdf4ff", color: "#7e22ce", label: "Upload" },
  view: { bg: "#fff7ed", color: "#c2410c", label: "View" },
  download: { bg: "#ecfdf5", color: "#065f46", label: "Download" },
};

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [actRes, statRes] = await Promise.all([
          axiosInstance.get("/activity"),
          axiosInstance.get("/activity/stats"),
        ]);
        setActivities(actRes.data.data);
        setStats(statRes.data.data);
      } catch (err) {
        console.error("Activity fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []); // eslint-disable-line

  if (loading) return <div style={styles.loading}>Loading activity...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Activity Dashboard</h1>
          <p style={styles.subtitle}>
            Track all user actions and system events
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.grid4}>
        <StatCard
          label="Total Logins"
          value={stats?.totalLogins ?? 0}
          color="#4f46e5"
        />
        <StatCard
          label="Total Uploads"
          value={stats?.totalUploads ?? 0}
          color="#7e22ce"
        />
        <StatCard
          label="Total Actions"
          value={activities.length}
          color="#0ea5e9"
        />
        <StatCard
          label="Active Users"
          value={stats?.mostActive?.length ?? 0}
          color="#10b981"
        />
      </div>

      <div style={styles.row2}>
        {/* Most Active Users */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Most Active Users</h3>
          {stats?.mostActive?.length === 0 ? (
            <p style={styles.empty}>No activity yet</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Logins</th>
                  <th style={styles.th}>Uploads</th>
                </tr>
              </thead>
              <tbody>
                {stats?.mostActive?.map((u, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={styles.avatar}>
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={styles.userName}>{u.name}</div>
                          <div style={styles.userEmail}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>{u.totalActions}</td>
                    <td style={styles.td}>{u.logins}</td>
                    <td style={styles.td}>{u.uploads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Activity Timeline */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Recent Activity</h3>
          {activities.length === 0 ? (
            <p style={styles.empty}>No activity recorded yet</p>
          ) : (
            <div style={styles.timeline}>
              {activities.slice(0, 10).map((a, i) => {
                const c = ACTION_COLORS[a.action] || ACTION_COLORS.view;
                return (
                  <div key={i} style={styles.timelineItem}>
                    <span
                      style={{
                        ...styles.actionBadge,
                        background: c.bg,
                        color: c.color,
                      }}
                    >
                      {c.label}
                    </span>
                    <div style={styles.timelineContent}>
                      <span style={styles.timelineUser}>
                        {a.user?.name || "Unknown"}
                      </span>
                      <span style={styles.timelineDetails}>{a.details}</span>
                    </div>
                    <span style={styles.timelineTime}>
                      {new Date(a.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Full Activity Table */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>All Activity Log</h3>
        {activities.length === 0 ? (
          <p style={styles.empty}>No activities yet</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Action</th>
                <th style={styles.th}>Details</th>
                <th style={styles.th}>Time</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a, i) => {
                const c = ACTION_COLORS[a.action] || ACTION_COLORS.view;
                return (
                  <tr key={a._id} style={styles.tr}>
                    <td style={styles.td}>{i + 1}</td>
                    <td style={styles.td}>{a.user?.name || "—"}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.actionBadge,
                          background: c.bg,
                          color: c.color,
                        }}
                      >
                        {c.label}
                      </span>
                    </td>
                    <td style={styles.td}>{a.details}</td>
                    <td style={styles.td}>
                      {new Date(a.createdAt).toLocaleString("en-IN")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
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
    marginBottom: "16px",
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
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: {
    textAlign: "left",
    padding: "10px 8px",
    color: "#94a3b8",
    fontWeight: "500",
    fontSize: "12px",
    borderBottom: "1px solid #f1f5f9",
  },
  tr: { borderBottom: "1px solid #f8fafc" },
  td: { padding: "10px 8px", color: "#334155" },
  actionBadge: {
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
  },
  userCell: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  userName: { fontSize: "13px", fontWeight: "500", color: "#1e293b" },
  userEmail: { fontSize: "11px", color: "#94a3b8" },
  timeline: { display: "flex", flexDirection: "column", gap: "10px" },
  timelineItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 0",
    borderBottom: "1px solid #f8fafc",
  },
  timelineContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  timelineUser: { fontSize: "13px", fontWeight: "500", color: "#1e293b" },
  timelineDetails: { fontSize: "11px", color: "#94a3b8" },
  timelineTime: { fontSize: "11px", color: "#94a3b8", flexShrink: 0 },
};

export default ActivityPage;
