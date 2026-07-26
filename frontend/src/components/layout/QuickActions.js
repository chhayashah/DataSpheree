import { Link } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import { PERMISSIONS } from "../../constants/permissions";
import { usePermission } from "../../hooks/usePermission";

const QUICK_ACTIONS = [
  {
    match: (path) => path === "/dashboard" || path.startsWith("/data"),
    label: "Upload Dataset",
    icon: UploadCloud,
    to: "/data/upload",
    permission: PERMISSIONS.DATA_UPLOAD,
  },
];

const QuickActions = ({ pathname }) => {
  const action = QUICK_ACTIONS.find((a) => a.match(pathname));
  const allowed = usePermission(action?.permission ?? "__none__");

  if (!action || !allowed) return null;

  const Icon = action.icon;

  return (
    <Link
      to={action.to}
      className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-xs font-semibold text-white hover:bg-accent-hover transition-colors"
    >
      <Icon size={14} />
      {action.label}
    </Link>
  );
};

export default QuickActions;
