/**
 * Single source of truth for DataSphere authorization.
 *
 * Nothing in the codebase should ever compare a role directly
 * (e.g. `role === "admin"`). Instead, code asks a capability question —
 * "can this role do X?" — via hasPermission(role, PERMISSIONS.X).
 *
 * Adding a new capability to an existing role, or a new module's
 * permissions entirely, means editing PERMISSIONS/ROLE_PERMISSIONS below.
 * No middleware, controller, or service should need to change.
 */

const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard:view",

  DATA_VIEW_OWN: "data:view:own",
  DATA_VIEW_ALL: "data:view:all",
  DATA_UPLOAD: "data:upload",
  DATA_MANAGE: "data:manage", // delete/archive — destructive, admin-only for now

  ANALYTICS_VIEW: "analytics:view",

  ACTIVITY_VIEW_OWN: "activity:view:own",
  ACTIVITY_VIEW_ALL: "activity:view:all",

  USER_MANAGE: "user:manage",
  AUDIT_VIEW: "audit:view",
  SYSTEM_MONITOR_VIEW: "system:monitor:view",
  REPORT_VIEW: "report:view",
  REPORT_EXPORT: "report:export",
};

const ROLE_PERMISSIONS = {
  admin: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DATA_VIEW_OWN,
    PERMISSIONS.DATA_VIEW_ALL,
    PERMISSIONS.DATA_UPLOAD,
    PERMISSIONS.DATA_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ACTIVITY_VIEW_OWN,
    PERMISSIONS.ACTIVITY_VIEW_ALL,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.SYSTEM_MONITOR_VIEW,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_EXPORT,
  ],
  analyst: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DATA_VIEW_OWN,
    PERMISSIONS.DATA_UPLOAD,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ACTIVITY_VIEW_OWN,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_EXPORT,
  ],
  viewer: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DATA_VIEW_OWN,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ACTIVITY_VIEW_OWN,
    PERMISSIONS.REPORT_VIEW,
  ],
};

/**
 * Fails closed: an unknown role (not present in ROLE_PERMISSIONS — e.g.
 * a legacy or corrupted value) or an unknown permission returns false,
 * never true. Nothing is implicitly allowed.
 */
const hasPermission = (role, permission) =>
  Boolean(ROLE_PERMISSIONS[role]?.includes(permission));

module.exports = { PERMISSIONS, ROLE_PERMISSIONS, hasPermission };
