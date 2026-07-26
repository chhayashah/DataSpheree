import {
  UploadCloud,
  CheckCircle2,
  Trash2,
  LogIn,
  LogOut,
  Eye,
  Download,
  Activity,
} from "lucide-react";

const TYPE_ICON = {
  upload: { icon: UploadCloud, className: "text-accent" },
  processed: { icon: CheckCircle2, className: "text-success" },
  delete: { icon: Trash2, className: "text-danger" },
  login: { icon: LogIn, className: "text-slate-400" },
  logout: { icon: LogOut, className: "text-slate-400" },
  view: { icon: Eye, className: "text-slate-400" },
  download: { icon: Download, className: "text-slate-400" },
};

const ActivityTimeline = ({ entries, emptyLabel = "No activity yet" }) => {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-300">
        <Activity size={22} strokeWidth={1.5} />
        <p className="text-sm text-slate-400">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {entries.map((entry) => {
        const { icon: Icon, className } = TYPE_ICON[entry.type] || {
          icon: Activity,
          className: "text-slate-400",
        };
        return (
          <li key={entry.id} className="flex items-start gap-2.5">
            <Icon size={15} className={`${className} mt-0.5 shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700">{entry.message}</p>
              <p className="text-[11px] text-slate-400">
                {new Date(entry.timestamp).toLocaleString()}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ActivityTimeline;
