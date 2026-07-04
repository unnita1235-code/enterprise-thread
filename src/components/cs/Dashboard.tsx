import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  evalTrends,
  failedQueries,
  graphEdges,
  graphNodes,
  ingestionRows,
  kpis,
  sourceContribution,
  traces,
  entities,
} from "@/data/demo";
import { SourceIcon } from "./Connectors";

function Sparkline({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-10 w-full">
      <polyline points={pts} fill="none" stroke="var(--teal)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const statusBadgeStyle: Record<string, string> = {
  healthy: "border-success/40 text-success",
  syncing: "border-teal/40 text-teal",
  degraded: "border-warn/40 text-warn",
};

function StatusBadges() {
  const items = [
    { l: "Ingestion", s: "healthy" },
    { l: "Retrieval", s: "healthy" },
    { l: "Reranker", s: "healthy" },
    { l: "Graph", s: "syncing" },
    { l: "Eval loop", s: "healthy" },
    { l: "Notion sync", s: "degraded" },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <span
          key={i.l}
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] ${statusBadgeStyle[i.s]}`}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          {i.l}
        </span>
      ))}
    </div>
  );
}

function EntityGraph() {
  const byId = Object.fromEntries(graphNodes.map((n) => [n.id, n]));
  return (
    <svg viewBox="0 0 380 260" className="h-52 w-full">
      {graphEdges.map(([a, b], i) => (
        <line
          key={i}
          x1={byId[a].x}
          y1={byId[a].y}
          x2={byId[b].x}
          y2={byId[b].y}
          stroke="var(--border)"
          strokeWidth="1"
        />
      ))}
      {graphNodes.map((n) => (
        <g key={n.id}>
          <circle
            cx={n.x}
            cy={n.y}
            r={n.kind === "project" ? 8 : 5}
            fill={n.kind === "project" ? "var(--teal)" : "var(--card)"}
            stroke="var(--teal)"
            strokeWidth="1.5"
          />
          <text
            x={n.x + 10}
            y={n.y + 4}
            className="fill-foreground"
            style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

const chartTooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 6,
    fontSize: 12,
    color: "var(--popover-foreground)",
  },
  labelStyle: { color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", fontSize: 11 },
};

export function Dashboard() {
  return (
    <section id="dashboard" className="border-b border-border" aria-labelledby="dash-title">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Live dashboard · demo data</p>
            <h2 id="dash-title" className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Retrieval, evaluation, and ingestion health
            </h2>
          </div>
          <StatusBadges />
        </div>

        {/* KPI row */}
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
          {kpis.map((k) => (
            <article key={k.label} className="rounded-md border border-border bg-card p-4">
              <p className="eyebrow">{k.label}</p>
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <span className="font-mono text-2xl text-foreground">{k.value}</span>
                <span className={`font-mono text-xs ${k.positive ? "text-success" : "text-warn"}`}>
                  {k.delta}
                </span>
              </div>
              <div className="mt-3">
                <Sparkline data={k.trend} />
              </div>
            </article>
          ))}
        </div>

        {/* Charts row */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article className="rounded-md border border-border bg-card p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Evaluation trends · 14 days</p>
                <h3 className="mt-1 text-base font-medium">Precision · faithfulness · recall</h3>
              </div>
              <div className="flex gap-3 font-mono text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-chart-1" />precision</span>
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-chart-3" />faithfulness</span>
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-chart-2" />recall</span>
              </div>
            </div>
            <div className="mt-4 h-56">
              <ResponsiveContainer>
                <LineChart data={evalTrends} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="var(--grid-line)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis domain={[0.8, 1]} stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip {...chartTooltipStyle} />
                  <Line type="monotone" dataKey="precision" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="faithfulness" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="recall" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-md border border-border bg-card p-5">
            <p className="eyebrow">Source contribution</p>
            <h3 className="mt-1 text-base font-medium">Citations by system · 7 days</h3>
            <div className="mt-4 h-56">
              <ResponsiveContainer>
                <BarChart data={sourceContribution} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="var(--grid-line)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip {...chartTooltipStyle} />
                  <Bar dataKey="slack" stackId="a" fill="var(--chart-1)" />
                  <Bar dataKey="jira" stackId="a" fill="var(--chart-2)" />
                  <Bar dataKey="drive" stackId="a" fill="var(--chart-3)" />
                  <Bar dataKey="notion" stackId="a" fill="var(--chart-4)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </div>

        {/* Ingestion + Retrieval viz */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article className="rounded-md border border-border bg-card lg:col-span-2">
            <header className="border-b border-border px-5 py-3">
              <p className="eyebrow">Ingestion health</p>
              <h3 className="mt-1 text-base font-medium">By source</h3>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    {["Source", "Docs", "Freshness", "Error rate", "Last sync", "Status"].map((h) => (
                      <th key={h} className="eyebrow px-5 py-2.5 font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ingestionRows.map((r) => (
                    <tr key={r.source} className="border-b border-border last:border-0">
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-2">
                          <SourceIcon id={r.source} size={14} />
                          <span className="capitalize">{r.source}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono">{r.docs.toLocaleString()}</td>
                      <td className="px-5 py-3 font-mono">{(r.freshness * 100).toFixed(0)}%</td>
                      <td className="px-5 py-3 font-mono">{(r.errorRate * 100).toFixed(2)}%</td>
                      <td className="px-5 py-3 font-mono text-muted-foreground">{r.lastSync}</td>
                      <td className="px-5 py-3">
                        <span className={`font-mono text-xs ${statusBadgeStyle[r.status]}`}>● {r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-md border border-border bg-card p-5">
            <p className="eyebrow">Retrieval pipeline</p>
            <h3 className="mt-1 text-base font-medium">Query → top-8</h3>
            <svg viewBox="0 0 320 200" className="mt-4 h-52 w-full">
              <defs>
                <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill="var(--muted-foreground)" />
                </marker>
              </defs>
              {[
                { x: 10, y: 90, w: 60, l: "query", n: "1" },
                { x: 100, y: 30, w: 70, l: "BM25", n: "412" },
                { x: 100, y: 150, w: 70, l: "vector", n: "512" },
                { x: 200, y: 90, w: 60, l: "RRF", n: "40" },
                { x: 275, y: 90, w: 40, l: "rerank", n: "8" },
              ].map((b, i) => (
                <g key={i}>
                  <rect x={b.x} y={b.y - 14} width={b.w} height={28} rx="4" fill="var(--surface-2)" stroke="var(--border)" />
                  <text x={b.x + b.w / 2} y={b.y - 1} textAnchor="middle" style={{ fontSize: 10, fontFamily: "var(--font-mono)" }} fill="var(--muted-foreground)">{b.l}</text>
                  <text x={b.x + b.w / 2} y={b.y + 10} textAnchor="middle" style={{ fontSize: 10, fontFamily: "var(--font-mono)" }} fill="var(--foreground)">{b.n}</text>
                </g>
              ))}
              {[
                [70, 90, 100, 30],
                [70, 90, 100, 150],
                [170, 30, 200, 90],
                [170, 150, 200, 90],
                [260, 90, 275, 90],
              ].map(([x1, y1, x2, y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-foreground)" strokeWidth="1" markerEnd="url(#arr)" />
              ))}
            </svg>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">
              latencies: p50 620ms · p95 1.4s
            </p>
          </article>
        </div>

        {/* Traces + failed */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article className="rounded-md border border-border bg-card lg:col-span-2">
            <header className="flex items-center justify-between border-b border-border px-5 py-3">
              <div>
                <p className="eyebrow">Recent traces</p>
                <h3 className="mt-1 text-base font-medium">Last 5 runs</h3>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">phoenix://traces</span>
            </header>
            <ul className="divide-y divide-border">
              {traces.map((t) => (
                <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-muted-foreground">{t.id}</span>
                      <span
                        className={`font-mono text-[11px] ${t.status === "ok" ? "text-success" : "text-warn"}`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-foreground">{t.query}</p>
                    <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">
                      {t.stages.join(" → ")}
                    </p>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <div className="text-foreground">{t.latency}ms</div>
                    <div className="text-muted-foreground">f{t.faithfulness.toFixed(2)} · {t.citations} cites</div>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-md border border-border bg-card">
            <header className="border-b border-border px-5 py-3">
              <p className="eyebrow">Failed retrievals</p>
              <h3 className="mt-1 text-base font-medium">Needs attention</h3>
            </header>
            <ul className="divide-y divide-border">
              {failedQueries.map((f) => (
                <li key={f.id} className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">{f.id}</span>
                    <span className="rounded-sm border border-warn/40 px-1.5 font-mono text-[10px] text-warn">
                      {f.reason}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{f.query}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{f.detail}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {/* Graph + entities */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article className="rounded-md border border-border bg-card p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Semantic entity graph</p>
                <h3 className="mt-1 text-base font-medium">Cross-system topology</h3>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">42 nodes · 118 edges</span>
            </div>
            <EntityGraph />
          </article>
          <article className="rounded-md border border-border bg-card">
            <header className="border-b border-border px-5 py-3">
              <p className="eyebrow">Top entities · 24h</p>
              <h3 className="mt-1 text-base font-medium">By retrieval weight</h3>
            </header>
            <ul className="divide-y divide-border">
              {entities.map((e) => (
                <li key={e.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">{e.label}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{e.type}</p>
                  </div>
                  <span className="font-mono text-xs text-teal">{e.weight}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {/* Small area chart: freshness */}
        <div className="mt-6 rounded-md border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Ingestion freshness</p>
              <h3 className="mt-1 text-base font-medium">Median seconds behind source</h3>
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">SLA · 120s</span>
          </div>
          <div className="mt-4 h-32">
            <ResponsiveContainer>
              <AreaChart data={evalTrends.map((d, i) => ({ day: d.day, s: 140 - i * 3.2 }))}>
                <defs>
                  <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--grid-line)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="s" stroke="var(--teal)" strokeWidth={2} fill="url(#fg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
