import Badge from "./Badge";

const STATUS_TONE = {
  processed: "success",
  processing: "warning",
  pending: "warning",
  failed: "danger",
};

const StatusBadge = ({ status }) => (
  <Badge tone={STATUS_TONE[status] || "neutral"}>{status}</Badge>
);

export default StatusBadge;
