import { Navigate } from "react-router-dom";
import { usePermission } from "../../hooks/usePermission";
import { useToast } from "../../context/ToastContext";
import { useRef, useEffect } from "react";

const RequireRole = ({ permission, children }) => {
  const allowed = usePermission(permission);
  const toast = useToast();

  const hasNotified = useRef(false);
  useEffect(() => {
    if (!allowed && !hasNotified.current) {
      hasNotified.current = true;
      toast("You don't have permission to access that page", "error");
    }
  }, [allowed, toast]);

  if (!allowed) return <Navigate to="/dashboard" replace />;
  return children;
};

export default RequireRole;
