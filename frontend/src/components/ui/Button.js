import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-accent text-white hover:bg-accent-hover disabled:bg-accent/50",
  outline:
    "bg-white text-slate-600 border border-border hover:bg-slate-50 disabled:opacity-50",
  ghost: "bg-transparent text-slate-500 hover:bg-slate-100 disabled:opacity-50",
  danger: "bg-danger text-white hover:bg-danger/90 disabled:bg-danger/50",
};

const SIZES = {
  sm: "text-xs px-3 py-1.5 rounded-lg",
  md: "text-sm px-4 py-2.5 rounded-xl",
  lg: "text-sm px-5 py-3 rounded-xl",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  ...props
}) => (
  <button
    className={`inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading && <Loader2 size={14} className="animate-spin" />}
    {children}
  </button>
);

export default Button;
