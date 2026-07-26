import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumbs = ({ items = [] }) => {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span
            key={`${item.label}-${index}`}
            className="flex items-center gap-1.5"
          >
            {index > 0 && (
              <ChevronRight size={13} className="text-slate-300 shrink-0" />
            )}
            {isLast || !item.to ? (
              <span className="font-medium text-slate-700">{item.label}</span>
            ) : (
              <Link
                to={item.to}
                className="text-slate-400 hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
