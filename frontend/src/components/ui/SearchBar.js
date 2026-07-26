import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search…",
  debounceMs = 300,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef(null);

  useEffect(() => setLocalValue(value), [value]);

  const handleChange = (e) => {
    const next = e.target.value;
    setLocalValue(next);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onChange(next), debounceMs);
  };

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 flex-1 max-w-sm focus-within:ring-2 focus-within:ring-accent">
      <Search size={14} className="text-slate-400 shrink-0" />
      <input
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 outline-none text-sm placeholder:text-slate-400"
      />
    </div>
  );
};

export default SearchBar;
