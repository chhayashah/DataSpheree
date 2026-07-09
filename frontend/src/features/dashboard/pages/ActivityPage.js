import { useState, useEffect } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { Card, CardHeader, CardBody } from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import { StatCard, PageHeader } from "../../../components/ui/Misc";
import { PageWithTableSkeleton } from "../../../components/ui/Skeleton";

const ACTION_TONES = {
  login: { tone: "accent", label: "Login" },
  logout: { tone: "success", label: "Logout" },
  upload: { tone: "neutral", label: "Upload" },
  view: { tone: "warning", label: "View" },
  download: { tone: "success", label: "Download" },
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

  if (loading) return <PageWithTableSkeleton rows={7} cols={4} />;

  return (
    <div>
      <PageHeader
        title="Activity"
        subtitle="Track all user actions and system events"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Total Logins"
          value={stats?.totalLogins ?? 0}
          accent="accent"
        />
        <StatCard
          label="Total Uploads"
          value={stats?.totalUploads ?? 0}
          accent="teal"
        />
        <StatCard
          label="Total Actions"
          value={activities.length}
          accent="success"
        />
        <StatCard
          label="Active Users"
          value={stats?.mostActive?.length ?? 0}
          accent="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader title="Most Active Users" />
          <CardBody>
            {stats?.mostActive?.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                No activity yet
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <Th>User</Th>
                    <Th>Total</Th>
                    <Th>Logins</Th>
                    <Th>Uploads</Th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.mostActive?.map((u, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 shrink-0 rounded-full bg-accent flex items-center justify-center text-white text-xs font-semibold">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {u.name}
                            </p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <Td className="font-data">{u.totalActions}</Td>
                      <Td className="font-data">{u.logins}</Td>
                      <Td className="font-data">{u.uploads}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recent Activity" />
          <CardBody>
            {activities.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                No activity recorded yet
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                {activities.slice(0, 10).map((a, i) => {
                  const c = ACTION_TONES[a.action] || ACTION_TONES.view;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 py-2 border-b border-slate-50 last:border-0"
                    >
                      <Badge tone={c.tone}>{c.label}</Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {a.user?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {a.details}
                        </p>
                      </div>
                      <span className="font-data text-xs text-slate-400 shrink-0">
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
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="All Activity Log" />
        <CardBody className="overflow-x-auto">
          {activities.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">
              No activities yet
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <Th>#</Th>
                  <Th>User</Th>
                  <Th>Action</Th>
                  <Th>Details</Th>
                  <Th>Time</Th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a, i) => {
                  const c = ACTION_TONES[a.action] || ACTION_TONES.view;
                  return (
                    <tr
                      key={a._id}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <Td className="font-data">{i + 1}</Td>
                      <Td>{a.user?.name || "—"}</Td>
                      <Td>
                        <Badge tone={c.tone}>{c.label}</Badge>
                      </Td>
                      <Td>{a.details}</Td>
                      <Td className="font-data">
                        {new Date(a.createdAt).toLocaleString("en-IN")}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

const Th = ({ children }) => (
  <th className="text-left py-2 text-[11px] font-medium text-slate-400 border-b border-slate-100">
    {children}
  </th>
);
const Td = ({ children, className = "" }) => (
  <td className={`py-2.5 text-slate-700 ${className}`}>{children}</td>
);

export default ActivityPage;
