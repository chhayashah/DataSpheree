export const Card = ({ children, className = "", ...props }) => (
  <div
    className={`bg-white rounded-xl border border-border shadow-card transition-shadow duration-200 hover:shadow-popover ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ title, action, subtitle }) => (
  <div className="flex items-center justify-between px-5 pt-5">
    <div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const CardBody = ({ children, className = "" }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

export default Card;
