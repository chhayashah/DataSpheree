const Tabs = ({ tabs, active, onChange }) => (
  <div
    className="flex items-center gap-1 border-b border-border mb-5"
    role="tablist"
  >
    {tabs.map((tab) => (
      <button
        key={tab.key}
        role="tab"
        aria-selected={active === tab.key}
        onClick={() => onChange(tab.key)}
        className={`px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-t ${
          active === tab.key
            ? "border-accent text-accent"
            : "border-transparent text-slate-400 hover:text-slate-600"
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default Tabs;
