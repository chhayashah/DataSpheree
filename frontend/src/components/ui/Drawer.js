import { useEffect } from "react";
import { X } from "lucide-react";

const SIDE_STYLES = {
  right: "right-0 translate-x-full",
  left: "left-0 -translate-x-full",
};

const SIZES = {
  sm: "max-w-xs",
  md: "max-w-md",
  lg: "max-w-xl",
};

const Drawer = ({
  open,
  onClose,
  title,
  side = "right",
  size = "md",
  children,
  bare = false,
}) => {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-200 ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className={`absolute inset-y-0 w-full ${SIZES[size]} bg-white shadow-popover flex flex-col transition-transform duration-200 ${
          side === "right" ? "right-0" : "left-0"
        } ${open ? "translate-x-0" : SIDE_STYLES[side]}`}
      >
        {!bare && (
          <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-50 transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
