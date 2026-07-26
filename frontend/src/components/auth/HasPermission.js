import { usePermission } from "../../hooks/usePermission";

const HasPermission = ({ permission, children, fallback = null }) => {
  const allowed = usePermission(permission);
  return allowed ? children : fallback;
};

export default HasPermission;
