const FilterBar = ({ filters, values, onChange }) => (
  <div className="flex flex-wrap items-center gap-2">
    {filters.map((filter) => (
      <select
        key={filter.key}
        value={values[filter.key] || ""}
        onChange={(e) => onChange({ ...values, [filter.key]: e.target.value })}
        className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="">{filter.label}</option>
        {filter.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ))}
  </div>
);

export default FilterBar;
