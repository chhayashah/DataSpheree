import { Menu } from "lucide-react";
import { LiveDot } from "../ui/Misc";
import Breadcrumbs from "./Breadcrumbs";
import QuickActions from "./QuickActions";
import NotificationBell from "./NotificationBell";
import GlobalSearchDialog from "../search/GlobalSearchDialog";

const BREADCRUMB_MAP = {
  "/dashboard": [{ label: "Dashboard" }],
  "/data": [{ label: "Datasets" }],
  "/data/upload": [{ label: "Datasets", to: "/data" }, { label: "Upload" }],
  "/insights": [{ label: "Analytics" }],
  "/reports": [{ label: "Reports" }],
  "/activity": [{ label: "Activity" }],
  "/users": [{ label: "Users" }],
  "/audit": [{ label: "Audit Logs" }],
  "/notifications": [{ label: "Notifications" }],
  "/profile": [{ label: "Profile" }],
  "/settings": [{ label: "Settings" }],
  "/monitoring": [{ label: "Monitoring" }],
};

const Topbar = ({ pathname, onOpenMobileNav }) => {
  const breadcrumbItems =
    BREADCRUMB_MAP[pathname] ||
    (/^\/data\/[^/]+$/.test(pathname)
      ? [{ label: "Datasets", to: "/data" }, { label: "Details" }]
      : [{ label: "DataSphere" }]);

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-4 border-b border-border bg-white/80 backdrop-blur px-4 md:px-8">
      <button
        onClick={onOpenMobileNav}
        className="md:hidden text-slate-500 hover:text-slate-800 p-1.5 -ml-1.5 rounded-md hover:bg-slate-100 transition-colors"
        aria-label="Open navigation"
      >
        <Menu size={19} />
      </button>

      <div className="hidden sm:block">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="flex-1" />

      <GlobalSearchDialog />
      <QuickActions pathname={pathname} />
      <NotificationBell />
      <LiveDot label="Realtime sync active" />
    </header>
  );
};

export default Topbar;
