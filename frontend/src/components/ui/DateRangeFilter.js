const PRESETS = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
];

const DateRangeFilter = ({ value, onChange, compare, onCompareChange }) => (
  <div className="flex items-center gap-3 flex-wrap">
    <div className="flex items-center gap-1 rounded-lg border border-border bg-white p-1">
      {PRESETS.map((p) => (
        <button
          key={p.key}
          onClick={() => onChange(p.key)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            value === p.key
              ? "bg-accent text-white"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
    <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={compare}
        onChange={(e) => onCompareChange(e.target.checked)}
        className="accent-accent"
      />
      Compare to previous period
    </label>
  </div>
);

export default DateRangeFilter;
