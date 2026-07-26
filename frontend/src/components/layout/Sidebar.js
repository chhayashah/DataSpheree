import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  UploadCloud,
  Sparkles,
  Activity,
  ChevronsLeft,
  Users,
  ShieldCheck,
  Bell,
  Gauge,
  FileBarChart2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PERMISSIONS } from "../../constants/permissions";
import Drawer from "../ui/Drawer";
import ProfileMenu from "./ProfileMenu";

const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        permission: PERMISSIONS.DASHBOARD_VIEW,
        end: true,
      },
      {
        to: "/data",
        label: "Datasets",
        icon: Database,
        permission: PERMISSIONS.DATA_VIEW_OWN,
      },
      {
        to: "/data/upload",
        label: "Upload",
        icon: UploadCloud,
        permission: PERMISSIONS.DATA_UPLOAD,
      },
      {
        to: "/insights",
        label: "Analytics",
        icon: Sparkles,
        permission: PERMISSIONS.ANALYTICS_VIEW,
      },
      {
        to: "/reports",
        label: "Reports",
        icon: FileBarChart2,
        permission: PERMISSIONS.REPORT_VIEW,
      },
    ],
  },
  {
    label: "Personal",
    items: [
      {
        to: "/activity",
        label: "Activity",
        icon: Activity,
        permission: PERMISSIONS.ACTIVITY_VIEW_OWN,
      },
      {
        to: "/notifications",
        label: "Notifications",
        icon: Bell,
        permission: PERMISSIONS.DASHBOARD_VIEW,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        to: "/users",
        label: "Users",
        icon: Users,
        permission: PERMISSIONS.USER_MANAGE,
      },
      {
        to: "/audit",
        label: "Audit Logs",
        icon: ShieldCheck,
        permission: PERMISSIONS.AUDIT_VIEW,
      },
      {
        to: "/monitoring",
        label: "Monitoring",
        icon: Gauge,
        permission: PERMISSIONS.SYSTEM_MONITOR_VIEW,
      },
    ],
  },
];

const labelVisibility = (forceLabels, collapsed) => {
  if (forceLabels) return "";
  if (collapsed) return "hidden";
  return "hidden lg:inline";
};

const tooltipVisibility = (forceLabels, collapsed) => {
  if (forceLabels) return "hidden";
  if (collapsed) return "hidden group-hover:block";
  return "hidden md:group-hover:block lg:!hidden";
};

const SidebarNav = ({ groups, forceLabels, collapsed, onNavigate }) => (
  <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
    {groups.map((group) => (
      <div key={group.label}>
        <p
          className={`px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 ${
            forceLabels ? "" : collapsed ? "hidden" : "hidden lg:block"
          }`}
        >
          {group.label}
        </p>
        <div className="space-y-0.5">
          {group.items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onNavigate}
              title={!forceLabels && collapsed ? label : undefined}
              className={({ isActive }) =>
                `group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <Icon size={16} strokeWidth={2} className="shrink-0" />
              <span className={labelVisibility(forceLabels, collapsed)}>
                {label}
              </span>
              {!forceLabels && (
                <span
                  className={`pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-white shadow-popover ${tooltipVisibility(
                    forceLabels,
                    collapsed,
                  )}`}
                >
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    ))}
  </nav>
);

const SidebarBrand = ({ forceLabels, collapsed }) => (
  <div className="flex items-center gap-2.5 h-16 px-5 border-b border-ink-border shrink-0">
    <div className="h-8 w-8 shrink-0 rounded-lg bg-accent flex items-center justify-center text-white text-xs font-bold">
      DS
    </div>
    <span
      className={`text-white font-semibold text-[15px] tracking-tight ${labelVisibility(forceLabels, collapsed)}`}
    >
      DataSphere
    </span>
  </div>
);

const Sidebar = ({
  mobileOpen,
  onCloseMobile,
  collapsed,
  onToggleCollapsed,
}) => {
  const { user, logout, hasPermission } = useAuth();

  const visibleGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => hasPermission(item.permission)),
  })).filter((group) => group.items.length > 0);

  const widthClasses = collapsed ? "md:w-16" : "md:w-16 lg:w-60";

  return (
    <>
      <aside
        className={`hidden md:flex ${widthClasses} fixed inset-y-0 left-0 bg-ink flex-col z-40 transition-[width] duration-150`}
      >
        <SidebarBrand collapsed={collapsed} />
        <SidebarNav groups={visibleGroups} collapsed={collapsed} />
        <ProfileMenu user={user} logout={logout} collapsed={collapsed} />

        <button
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className="hidden lg:flex items-center justify-center absolute -right-3 top-20 h-6 w-6 rounded-full bg-ink border border-ink-border text-slate-400 hover:text-white hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ChevronsLeft
            size={13}
            className={`transition-transform duration-150 ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </aside>

      <Drawer
        open={mobileOpen}
        onClose={onCloseMobile}
        side="left"
        size="sm"
        bare
      >
        <div className="flex flex-col h-full bg-ink">
          <SidebarBrand forceLabels />
          <SidebarNav
            groups={visibleGroups}
            forceLabels
            onNavigate={onCloseMobile}
          />
          <ProfileMenu user={user} logout={logout} forceLabels />
        </div>
      </Drawer>
    </>
  );
};

export default Sidebar;
