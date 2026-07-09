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
import {
  RefreshCw,
  Database,
  Rows3,
  Users,
  UploadCloud,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";
import { useAuth } from "../../../context/AuthContext";
import { Card, CardHeader, CardBody } from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { StatCard, PageHeader } from "../../../components/ui/Misc";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";

const COLORS = [
  "#3B5BFD",
  "#0EA5A4",
  "#16A34A",
  "#F0A93A",
  "#DC2626",
  "#7C6CF6",
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

  if (loading) return <DashboardSkeleton />;

  const pieData =
    topUsers.length > 0
      ? topUsers.map((u) => ({ name: u.name, value: u.uploadCount }))
      : [{ name: "No data", value: 1 }];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name}`}
        action={
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw size={13} /> Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Total Records"
          value={stats?.totalRecords ?? 0}
          accent="accent"
          icon={Database}
        />
        <StatCard
          label="Total Rows"
          value={stats?.totalRows ?? 0}
          accent="teal"
          icon={Rows3}
        />
        <StatCard
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          accent="success"
          icon={Users}
        />
        <StatCard
          label="Today's Uploads"
          value={trend[trend.length - 1]?.uploads ?? 0}
          accent="warning"
          icon={UploadCloud}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <Card>
          <CardHeader title="Daily Upload Trend" />
          <CardBody>
            {trend.length === 0 ? (
              <EmptyChart />
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
                    contentStyle={tooltipStyle}
                    formatter={(v) => [v, "Uploads"]}
                  />
                  <Bar dataKey="uploads" fill="#3B5BFD" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Rows Processed Over Time" />
          <CardBody>
            {trend.length === 0 ? (
              <EmptyChart />
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
                    contentStyle={tooltipStyle}
                    formatter={(v) => [v, "Rows"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalRows"
                    stroke="#0EA5A4"
                    strokeWidth={2}
                    dot={{ fill: "#0EA5A4", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Upload Distribution by User" />
          <CardBody>
            {topUsers.length === 0 ? (
              <EmptyChart label="No user data yet" />
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
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => (
                      <span className="text-xs text-slate-500">{v}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recent Uploads" />
          <CardBody>
            {recentUploads.length === 0 ? (
              <EmptyChart label="No uploads yet" />
            ) : (
              <>
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <Th>File</Th>
                      <Th>Rows</Th>
                      <Th>Status</Th>
                      <Th>By</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUploads.map((r) => (
                      <tr
                        key={r._id}
                        className="border-b border-slate-50 last:border-0"
                      >
                        <Td>{r.filename}</Td>
                        <Td className="font-data">{r.totalRows}</Td>
                        <Td>
                          <Badge
                            tone={
                              r.status === "processed" ? "success" : "warning"
                            }
                          >
                            {r.status}
                          </Badge>
                        </Td>
                        <Td>{r.uploadedBy?.name || "—"}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Link
                  to="/data"
                  className="block mt-3 text-sm text-accent font-medium hover:underline"
                >
                  View all records →
                </Link>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

const Th = ({ children }) => (
  <th className="text-left px-2 py-2 text-[11px] font-medium text-slate-400 border-b border-slate-100">
    {children}
  </th>
);
const Td = ({ children, className = "" }) => (
  <td className={`px-2 py-2.5 text-slate-700 ${className}`}>{children}</td>
);
const EmptyChart = ({ label = "No data yet" }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-300">
    <BarChart3 size={26} strokeWidth={1.5} />
    <p className="text-sm text-slate-400">{label}</p>
  </div>
);
const tooltipStyle = {
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "12px",
};

export default DashboardPage;
