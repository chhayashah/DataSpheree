import { LiveDot } from "../ui/Misc";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/data": "Records",
  "/data/upload": "Upload",
  "/insights": "AI Insights",
  "/activity": "Activity",
};

const Topbar = ({ pathname }) => {
  const title = PAGE_TITLES[pathname] || "DataSphere";

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between border-b border-border bg-white/80 backdrop-blur px-8">
      <span className="text-sm font-medium text-slate-500">{title}</span>
      <LiveDot label="Realtime sync active" />
    </header>
  );
};

export default Topbar;
