import { Server, Database, Cpu, AlertTriangle } from "lucide-react";
import { PageHeader, StatCard } from "../../../components/ui/Misc";
import { Card, CardHeader, CardBody } from "../../../components/ui/Card";
import DataTable from "../../../components/ui/DataTable";
import StatusBadge from "../../../components/ui/StatusBadge";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";
import { useMonitoring } from "../hooks/useMonitoring";

const formatUptime = (seconds) => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const MonitoringPage = () => {
  const { health, errors, loading } = useMonitoring();

  if (loading && !health) return <DashboardSkeleton />;

  const columns = [
    {
      key: "timestamp",
      label: "Time",
      className: "font-data whitespace-nowrap",
      render: (e) => new Date(e.timestamp).toLocaleString(),
    },
    {
      key: "statusCode",
      label: "Status",
      render: (e) => (
        <StatusBadge status={e.statusCode >= 500 ? "failed" : "pending"} />
      ),
    },
    { key: "message", label: "Message" },
    { key: "path", label: "Path", className: "font-data text-slate-400" },
  ];

  return (
    <div>
      <PageHeader
        title="Monitoring"
        subtitle="System health, refreshed every 10 seconds"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Uptime"
          value={formatUptime(health.uptimeSeconds)}
          icon={Server}
          accent="accent"
        />
        <StatCard
          label="DB Status"
          value={health.database.status}
          icon={Database}
          accent={
            health.database.status === "connected" ? "success" : "warning"
          }
        />
        <StatCard
          label="Active Sockets"
          value={health.socket.activeConnections}
          icon={Cpu}
          accent="teal"
        />
        <StatCard
          label="Error Rate"
          value={`${health.requests.errorRatePct}%`}
          icon={AlertTriangle}
          accent={health.requests.errorRatePct > 5 ? "danger" : "success"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <Card>
          <CardHeader title="Memory" />
          <CardBody className="space-y-2 text-sm">
            <MetaRow label="RSS" value={`${health.memory.rssMb} MB`} />
            <MetaRow
              label="Heap used"
              value={`${health.memory.heapUsedMb} MB`}
            />
            <MetaRow
              label="Heap total"
              value={`${health.memory.heapTotalMb} MB`}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Requests" />
          <CardBody className="space-y-2 text-sm">
            <MetaRow
              label="Total (since restart)"
              value={health.requests.total}
            />
            <MetaRow
              label="Errors (since restart)"
              value={health.requests.errors}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="System load (1m/5m/15m)" />
          <CardBody className="space-y-2 text-sm">
            <MetaRow label="1 min" value={health.loadAverage[0].toFixed(2)} />
            <MetaRow label="5 min" value={health.loadAverage[1].toFixed(2)} />
            <MetaRow label="15 min" value={health.loadAverage[2].toFixed(2)} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Recent Error Logs"
          subtitle="Since last server restart"
        />
        <CardBody className="p-0">
          <DataTable
            columns={columns}
            rows={errors}
            rowKey="timestamp"
            loading={false}
            emptyTitle="No errors recorded"
            emptyDescription="Nothing has returned a 4xx/5xx response since the server last restarted."
          />
        </CardBody>
      </Card>
    </div>
  );
};

const MetaRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-400">{label}</span>
    <span className="text-slate-700 font-medium font-data">{value}</span>
  </div>
);

export default MonitoringPage;
