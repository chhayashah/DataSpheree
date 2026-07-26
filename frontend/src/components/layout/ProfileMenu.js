import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";

const ProfileMenu = ({ user, logout, forceLabels, collapsed }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const labelClass = forceLabels
    ? ""
    : collapsed
      ? "hidden"
      : "hidden lg:block";

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const goTo = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div
      ref={containerRef}
      className="relative border-t border-ink-border p-3 shrink-0"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div className="h-8 w-8 shrink-0 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-semibold">
          {user?.name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div className={`min-w-0 flex-1 text-left ${labelClass}`}>
          <p className="text-sm text-white font-medium truncate">
            {user?.name}
          </p>
          <p className="text-[11px] text-slate-500 capitalize">{user?.role}</p>
        </div>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-3 right-3 mb-2 rounded-xl bg-white shadow-popover border border-border overflow-hidden origin-bottom animate-[fadeIn_120ms_ease-out]"
        >
          <div className="px-3 py-2.5 border-b border-border">
            <p className="text-sm font-medium text-slate-800 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>

          <MenuItem
            icon={User}
            label="Profile"
            onClick={() => goTo("/profile")}
          />
          <MenuItem
            icon={Settings}
            label="Settings"
            onClick={() => goTo("/settings")}
          />

          <div className="border-t border-border" />

          <button
            role="menuitem"
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-danger hover:bg-danger-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-danger"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ icon: Icon, label, onClick }) => (
  <button
    role="menuitem"
    onClick={onClick}
    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
  >
    <Icon size={15} />
    <span className="flex-1 text-left">{label}</span>
  </button>
);

export default ProfileMenu;
