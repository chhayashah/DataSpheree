import { Loader2 } from "lucide-react";

/** Small pulsing dot used next to anything driven by the real-time socket layer. */
export const LiveDot = ({ label = "Live" }) => (
  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-success">
    <span className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full rounded-full bg-success animate-pulse-dot" />
    </span>
    {label}
  </span>
);

const ICON_TONES = {
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  teal: "bg-data-teal/10 text-data-teal",
};

export const StatCard = ({ label, value, accent = "accent", icon: Icon }) => (
  <div className="bg-white rounded-xl border border-border shadow-card p-5">
    <div className="flex items-center justify-between mb-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      {Icon && (
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${ICON_TONES[accent]}`}
        >
          <Icon size={14} />
        </span>
      )}
    </div>
    <p className="font-data text-3xl font-bold text-slate-900">{value}</p>
  </div>
);

export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
        {title}
      </h1>
      {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const EmptyState = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6">
    <p className="text-sm font-semibold text-slate-700">{title}</p>
    {description && (
      <p className="text-sm text-slate-400 mt-1 max-w-sm">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const PageSpinner = ({ label = "Loading…" }) => (
  <div className="flex flex-col items-center justify-center gap-3 h-[60vh] text-slate-400">
    <Loader2 size={22} className="animate-spin text-accent" />
    <p className="text-sm">{label}</p>
  </div>
);
