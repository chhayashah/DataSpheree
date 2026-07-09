import { useState, useEffect } from "react";
import {
  Info,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import axiosInstance from "../../../services/axiosInstance";
import { Card, CardHeader, CardBody } from "../../../components/ui/Card";
import { StatCard, PageHeader } from "../../../components/ui/Misc";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";

const TYPE_STYLES = {
  info: { icon: Info, bg: "bg-accent-soft", text: "text-accent" },
  warning: { icon: AlertTriangle, bg: "bg-warning-soft", text: "text-warning" },
  alert: { icon: AlertOctagon, bg: "bg-danger-soft", text: "text-danger" },
  success: { icon: CheckCircle2, bg: "bg-success-soft", text: "text-success" },
};

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

  if (loading) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader
        title="AI Insights"
        subtitle="Smart analysis of your data patterns"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Total Records"
          value={insights?.summary?.totalRecords ?? 0}
          accent="accent"
        />
        <StatCard
          label="Total Rows"
          value={insights?.summary?.totalRows ?? 0}
          accent="teal"
        />
        <StatCard
          label="Avg Uploads/Day"
          value={insights?.summary?.avgUploadsPerDay ?? 0}
          accent="success"
        />
        <StatCard
          label="Active Days"
          value={insights?.summary?.activeDays ?? 0}
          accent="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <Card>
          <CardHeader title="Smart Suggestions" />
          <CardBody>
            {insights?.suggestions?.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                No suggestions yet — upload more data.
              </p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {insights?.suggestions?.map((s, i) => {
                  const t = TYPE_STYLES[s.type] || TYPE_STYLES.info;
                  const Icon = t.icon;
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-2.5 rounded-lg px-3.5 py-3 ${t.bg}`}
                    >
                      <Icon size={16} className={`${t.text} mt-0.5 shrink-0`} />
                      <span className={`text-sm leading-relaxed ${t.text}`}>
                        {s.message}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Anomaly Detection" />
          <CardBody>
            {insights?.anomalies?.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 size={22} className="text-success mx-auto mb-2" />
                <p className="text-sm font-medium text-success">
                  No anomalies detected
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Your upload pattern looks normal
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {insights?.anomalies?.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg px-3.5 py-3 bg-danger-soft"
                  >
                    <AlertTriangle
                      size={16}
                      className="text-danger mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-danger leading-relaxed">
                      {a.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {insights?.peakDay && (
        <Card>
          <CardHeader
            title="Peak Activity Day"
            action={<TrendingUp size={16} className="text-accent" />}
          />
          <CardBody>
            <div className="flex gap-10">
              <div>
                <p className="text-xs text-slate-400 mb-1">Day of Month</p>
                <p className="font-data text-2xl font-bold text-slate-900">
                  {insights.peakDay._id}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Uploads</p>
                <p className="font-data text-2xl font-bold text-accent">
                  {insights.peakDay.uploads}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Rows Processed</p>
                <p className="font-data text-2xl font-bold text-success">
                  {insights.peakDay.totalRows}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default InsightsPage;
