import { Info, AlertTriangle, CheckCircle2, AlertOctagon } from "lucide-react";

const TONE_CONFIG = {
  info: { icon: Info, bg: "bg-accent-soft", text: "text-accent" },
  success: { icon: CheckCircle2, bg: "bg-success-soft", text: "text-success" },
  warning: { icon: AlertTriangle, bg: "bg-warning-soft", text: "text-warning" },
  danger: { icon: AlertOctagon, bg: "bg-danger-soft", text: "text-danger" },
};

const Alert = ({ tone = "info", children }) => {
  const { icon: Icon, bg, text } = TONE_CONFIG[tone] || TONE_CONFIG.info;
  return (
    <div className={`flex items-start gap-2.5 rounded-lg px-3.5 py-3 ${bg}`}>
      <Icon size={15} className={`${text} mt-0.5 shrink-0`} />
      <p className={`text-sm ${text}`}>{children}</p>
    </div>
  );
};

export default Alert;
