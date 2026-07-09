import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  UploadCloud,
  Sparkles,
  Activity,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/data", label: "Records", icon: Database },
  { to: "/data/upload", label: "Upload", icon: UploadCloud },
  { to: "/insights", label: "AI Insights", icon: Sparkles },
  { to: "/activity", label: "Activity", icon: Activity },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-ink flex flex-col z-40">
      <div className="flex items-center gap-2.5 h-16 px-5 border-b border-ink-border">
        <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-white text-xs font-bold">
          DS
        </div>
        <span className="text-white font-semibold text-[15px] tracking-tight">
          DataSphere
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink-border p-3">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="h-8 w-8 shrink-0 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white font-medium truncate">
              {user?.name}
            </p>
            <p className="text-[11px] text-slate-500 capitalize">
              {user?.role}
            </p>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/5"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
