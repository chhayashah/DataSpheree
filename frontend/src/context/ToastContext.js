import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: { icon: CheckCircle2, className: "text-success" },
  error: { icon: XCircle, className: "text-danger" },
  info: { icon: Info, className: "text-accent" },
};

const BORDER = {
  success: "border-l-success",
  error: "border-l-danger",
  info: "border-l-accent",
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, type = "info", duration = 4000) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
        {toasts.map(({ id, message, type }) => {
          const { icon: Icon, className } = ICONS[type] || ICONS.info;
          return (
            <div
              key={id}
              className={`flex items-start gap-2.5 bg-white rounded-lg border border-l-4 ${BORDER[type] || BORDER.info} border-border shadow-popover px-3.5 py-3 animate-toast-in`}
            >
              <Icon size={16} className={`${className} mt-0.5 shrink-0`} />
              <p className="text-sm text-slate-700 flex-1 leading-snug">
                {message}
              </p>
              <button
                onClick={() => dismiss(id)}
                className="text-slate-300 hover:text-slate-500 shrink-0"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
};
