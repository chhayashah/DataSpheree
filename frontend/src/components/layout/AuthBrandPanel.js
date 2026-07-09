const NODES = [
  [40, 60],
  [140, 30],
  [230, 90],
  [90, 150],
  [200, 190],
  [310, 140],
  [60, 250],
  [260, 260],
  [340, 60],
  [350, 230],
];
const EDGES = [
  [0, 1],
  [1, 2],
  [1, 3],
  [3, 4],
  [4, 5],
  [2, 5],
  [3, 6],
  [4, 7],
  [2, 8],
  [5, 9],
];

const AuthBrandPanel = () => (
  <div className="relative hidden lg:flex flex-col justify-between w-[440px] shrink-0 bg-ink overflow-hidden px-10 py-12">
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.35]"
      viewBox="0 0 400 320"
      fill="none"
    >
      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={NODES[a][0]}
          y1={NODES[a][1]}
          x2={NODES[b][0]}
          y2={NODES[b][1]}
          stroke="#3B5BFD"
          strokeWidth="1"
        />
      ))}
      {NODES.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 5 ? 5 : 3} fill="#3B5BFD" />
      ))}
    </svg>

    <div className="relative flex items-center gap-2.5">
      <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-white text-xs font-bold">
        DS
      </div>
      <span className="text-white font-semibold text-[15px] tracking-tight">
        DataSphere
      </span>
    </div>

    <div className="relative">
      <p className="text-white text-2xl font-semibold leading-snug tracking-tight">
        Every record,
        <br />
        one live picture.
      </p>
      <p className="text-slate-400 text-sm mt-3 max-w-xs">
        Ingest CSVs, watch analytics update in real time, and let anomaly
        detection flag what needs attention.
      </p>
    </div>
  </div>
);

export default AuthBrandPanel;
