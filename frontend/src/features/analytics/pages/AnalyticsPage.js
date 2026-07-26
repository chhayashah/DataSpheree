import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "../../../components/ui/Misc";
import { Card, CardHeader, CardBody } from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import DateRangeFilter from "../../../components/ui/DateRangeFilter";
import Alert from "../../../components/ui/Alert";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";
import { useAnalytics } from "../hooks/useAnalytics";

const tooltipStyle = {
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "12px",
};

const EmptyChart = ({ label = "No data in this range" }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-300">
    <BarChart3 size={26} strokeWidth={1.5} />
    <p className="text-sm text-slate-400">{label}</p>
  </div>
);

const pctDelta = (current, previous) => {
  if (previous === undefined || previous === null) return null;
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

const DeltaKpiCard = ({ label, value, previousValue }) => {
  const delta = pctDelta(value, previousValue);
  const positive = delta !== null && delta >= 0;
  return (
    <Card>
      <CardBody>
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-semibold text-slate-900 font-data">
            {value}
          </p>
          {delta !== null && (
            <span
              className={`flex items-center gap-0.5 text-xs font-medium ${positive ? "text-success" : "text-danger"}`}
            >
              {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(delta)}%
            </span>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const {
    rangeKey,
    setRangeKey,
    compare,
    setCompare,
    stats,
    previousStats,
    trend,
    topUsers,
    insights,
    loading,
    exportCsv,
  } = useAnalytics();

  if (loading && !stats) return <DashboardSkeleton />;

  const handleBarClick = (data) => {
    if (!data?.date) return;
    const from = new Date(data.date);
    const to = new Date(data.date);
    to.setDate(to.getDate() + 1);
    navigate(`/data?from=${from.toISOString()}&to=${to.toISOString()}`);
  };

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Trends, anomalies, and rule-based insights across your datasets"
        action={
          <Button
            size="sm"
            variant="outline"
            onClick={exportCsv}
            disabled={trend.length === 0}
          >
            <Download size={13} /> Export CSV
          </Button>
        }
      />

      <div className="mb-5">
        <DateRangeFilter
          value={rangeKey}
          onChange={setRangeKey}
          compare={compare}
          onCompareChange={setCompare}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <DeltaKpiCard
          label="Total Datasets"
          value={stats?.totalRecords ?? 0}
          previousValue={compare ? previousStats?.totalRecords : null}
        />
        <DeltaKpiCard
          label="Total Rows"
          value={stats?.totalRows ?? 0}
          previousValue={compare ? previousStats?.totalRows : null}
        />
        <DeltaKpiCard
          label="Contributors"
          value={stats?.totalUsers ?? 0}
          previousValue={compare ? previousStats?.totalUsers : null}
        />
        <DeltaKpiCard
          label="Avg Uploads/Day"
          value={insights?.summary?.avgUploadsPerDay ?? 0}
          previousValue={null}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Upload Trend"
            subtitle="Click a bar to view that day's datasets"
          />
          <CardBody>
            {trend.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
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
                  <Bar
                    dataKey="uploads"
                    radius={[4, 4, 0, 0]}
                    cursor="pointer"
                    onClick={handleBarClick}
                  >
                    {trend.map((_, i) => (
                      <Cell key={i} fill="#3B5BFD" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Top Contributors" />
          <CardBody>
            {topUsers.length === 0 ? (
              <EmptyChart label="No contributors in this range" />
            ) : (
              <div className="flex flex-col gap-3">
                {topUsers.map((u, i) => (
                  <div key={u.userId} className="flex items-center gap-2.5">
                    <span className="w-5 text-xs text-slate-400 font-data">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700 truncate">
                        {u.name}
                      </p>
                      <p className="text-xs text-slate-400 font-data">
                        {u.uploadCount} uploads · {u.totalRows} rows
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Insights & Suggestions" />
          <CardBody>
            {(insights?.suggestions?.length ?? 0) === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                No suggestions for this range.
              </p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {insights.suggestions.map((s, i) => (
                  <Alert key={i} tone={s.type}>
                    {s.message}
                  </Alert>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Anomaly Detection" />
          <CardBody>
            {(insights?.anomalies?.length ?? 0) === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 size={22} className="text-success mx-auto mb-2" />
                <p className="text-sm font-medium text-success">
                  No anomalies detected
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Upload pattern looks normal for this range
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {insights.anomalies.map((a, i) => (
                  <Alert key={i} tone={a.type}>
                    {a.message}
                  </Alert>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
