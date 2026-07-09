const Shimmer = ({ className = "" }) => (
  <div
    className={`relative overflow-hidden bg-slate-100 rounded-md ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-border shadow-card p-5">
    <div className="flex items-center justify-between mb-4">
      <Shimmer className="h-3 w-20" />
      <Shimmer className="h-7 w-7 rounded-lg" />
    </div>
    <Shimmer className="h-7 w-16" />
  </div>
);

export const ChartCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-border shadow-card p-5">
    <Shimmer className="h-3.5 w-32 mb-5" />
    <Shimmer className="h-[180px] w-full" />
  </div>
);

export const TableRowSkeleton = ({ cols = 4 }) => (
  <tr className="border-b border-slate-50 last:border-0">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3.5">
        <Shimmer className="h-3.5 w-full max-w-[110px]" />
      </td>
    ))}
  </tr>
);

export const TableCardSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
    <table className="w-full">
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} cols={cols} />
        ))}
      </tbody>
    </table>
  </div>
);

export const DashboardSkeleton = () => (
  <div>
    <div className="flex items-start justify-between mb-6">
      <div>
        <Shimmer className="h-7 w-40 mb-2" />
        <Shimmer className="h-4 w-56" />
      </div>
      <Shimmer className="h-9 w-24 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      <ChartCardSkeleton />
      <ChartCardSkeleton />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ChartCardSkeleton />
      <ChartCardSkeleton />
    </div>
  </div>
);

export const PageWithTableSkeleton = ({ rows = 6, cols = 5 }) => (
  <div>
    <div className="flex items-start justify-between mb-6">
      <div>
        <Shimmer className="h-7 w-32 mb-2" />
        <Shimmer className="h-4 w-44" />
      </div>
      <Shimmer className="h-9 w-28 rounded-xl" />
    </div>
    <TableCardSkeleton rows={rows} cols={cols} />
  </div>
);

export default Shimmer;
