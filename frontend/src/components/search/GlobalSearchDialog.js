import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Loader2 } from "lucide-react";
import Dialog from "../ui/Dialog";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { PERMISSIONS } from "../../constants/permissions";

const SEARCH_SOURCES = [
  {
    key: "datasets",
    label: "Datasets",
    permission: PERMISSIONS.DATA_VIEW_OWN,
    fetch: async () => {
      const res = await axiosInstance.get("/data");
      return (res.data.data || []).map((r) => ({
        id: r._id,
        title: r.filename,
        subtitle: `${r.totalRows} rows`,
        to: `/data/${r._id}`,
      }));
    },
  },
  {
    key: "users",
    label: "Users",
    permission: PERMISSIONS.USER_MANAGE,
    fetch: async () => {
      const res = await axiosInstance.get("/users");
      return (res.data.data || []).map((u) => ({
        id: u.id,
        title: u.name,
        subtitle: u.email,
        to: `/users?open=${u.id}`,
      }));
    },
  },
];

const GlobalSearchDialog = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const openDialog = useCallback(() => setOpen(true), []);
  const closeDialog = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openDialog();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openDialog]);

  useEffect(() => {
    if (!open || items !== null) return undefined;
    let cancelled = false;

    const loadSources = async () => {
      setLoading(true);
      const results = [];
      for (const source of SEARCH_SOURCES) {
        if (source.permission && !hasPermission(source.permission)) continue;
        try {
          const sourceItems = await source.fetch();
          results.push(
            ...sourceItems.map((i) => ({ ...i, sourceLabel: source.label })),
          );
        } catch {
          // A failed source shouldn't block results from the others.
        }
      }
      if (!cancelled) {
        setItems(results);
        setLoading(false);
      }
    };

    loadSources();
    return () => {
      cancelled = true;
    };
  }, [open, items, hasPermission]);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [open]);

  const filtered = (items || []).filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (item) => {
    navigate(item.to);
    closeDialog();
  };

  return (
    <>
      <button
        onClick={openDialog}
        className="flex items-center gap-2 rounded-lg border border-border bg-slate-50 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-100 transition-colors w-36 sm:w-56"
      >
        <Search size={13} className="shrink-0" />
        <span className="flex-1 text-left truncate">Search...</span>
        <kbd className="hidden sm:inline text-[10px] font-medium text-slate-400 bg-white border border-border rounded px-1.5 py-0.5">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onClose={closeDialog} hideCloseButton size="lg">
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-border">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search datasets…"
            className="flex-1 outline-none text-sm placeholder:text-slate-400"
          />
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
              <Loader2 size={14} className="animate-spin" /> Searching…
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-8">
              {query
                ? `No results for "${query}"`
                : "Start typing to search datasets"}
            </p>
          )}

          {!loading &&
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors"
              >
                <FileText size={15} className="text-slate-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-800 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400">{item.subtitle}</p>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wide text-slate-300 shrink-0">
                  {item.sourceLabel}
                </span>
              </button>
            ))}
        </div>
      </Dialog>
    </>
  );
};

export default GlobalSearchDialog;
