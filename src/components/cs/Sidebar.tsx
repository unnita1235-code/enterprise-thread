import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const nav = [
  { group: "Console", items: [
    { id: "overview", label: "Overview" },
    { id: "connectors", label: "Ingestion" },
    { id: "pipeline", label: "Pipeline" },
    { id: "dashboard", label: "Dashboard" },
    { id: "query", label: "Query" },
  ]},
  { group: "System", items: [
    { id: "architecture", label: "Architecture" },
    { id: "resume", label: "Portfolio value" },
  ]},
];

export function Sidebar() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]?.target?.id) setActive(vis[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    nav.flatMap((g) => g.items).forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-surface-1 md:flex">
      <div className="border-b border-border p-6">
        <Logo />
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Enterprise RAG · v0.4
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {nav.map((g) => (
          <div key={g.group} className="mb-4">
            <div className="px-6 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {g.group}
            </div>
            {g.items.map((i) => {
              const isActive = active === i.id;
              return (
                <a
                  key={i.id}
                  href={`#${i.id}`}
                  className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "border-r-2 border-teal bg-surface-2 text-teal"
                      : "border-r-2 border-transparent text-foreground/80 hover:bg-surface-2 hover:text-foreground"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-teal" : "bg-border"}`}
                  />
                  {i.label}
                </a>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="border-t border-border bg-surface-2/60 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-sm bg-teal font-mono text-xs font-bold text-teal-foreground">
            AE
          </div>
          <div className="min-w-0 text-xs">
            <p className="truncate font-semibold text-foreground">AI Engineer</p>
            <p className="truncate text-muted-foreground">Portfolio · 2026</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>Uptime</span><span>99.998%</span>
          </div>
          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full w-[97%] bg-teal" />
          </div>
        </div>
      </div>
    </aside>
  );
}
