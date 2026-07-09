const TONES = {
  neutral: "bg-slate-100 text-slate-600",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

const Badge = ({ children, tone = "neutral", className = "" }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${TONES[tone]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
