import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Boxes,
  Command,
  Database,
  FileSearch,
  Gauge,
  LayoutDashboard,
  Menu,
  Network,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/cs/Logo";

const navigation = [
  {
    label: "Operate",
    items: [
      { to: "/app/overview", label: "Overview", icon: LayoutDashboard },
      { to: "/app/ask", label: "Ask", icon: Sparkles },
      { to: "/app/sources", label: "Sources", icon: Boxes },
      { to: "/app/documents", label: "Documents", icon: Database },
    ],
  },
  {
    label: "Investigate",
    items: [
      { to: "/app/search", label: "Search", icon: Search },
      { to: "/app/entities", label: "Entities", icon: Network },
      { to: "/app/evaluations", label: "Evaluations", icon: Gauge },
      { to: "/app/traces", label: "Traces", icon: FileSearch },
    ],
  },
  {
    label: "Admin",
    items: [
      { to: "/app/analytics", label: "Analytics", icon: SlidersHorizontal },
      { to: "/app/team", label: "Team", icon: Users },
      { to: "/app/settings", label: "Settings", icon: Settings2 },
    ],
  },
] as const;

const commandActions = [
  { to: "/app/ask", label: "Ask a question", hint: "Primary workflow" },
  { to: "/app/search", label: "Search documents", hint: "Compare retrieval" },
  { to: "/app/sources", label: "Open sources", hint: "Connector health" },
  { to: "/app/traces", label: "View traces", hint: "Inspect a request" },
  { to: "/app/evaluations", label: "Run evaluation", hint: "Quality center" },
  { to: "/app/settings", label: "Open settings", hint: "Workspace controls" },
] as const;

type AppShellProps = { children: React.ReactNode };

export function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredActions = commandActions.filter((action) =>
    `${action.label} ${action.hint}`.toLowerCase().includes(query.toLowerCase()),
  );

  function go(to: (typeof commandActions)[number]["to"]) {
    setPaletteOpen(false);
    setMobileOpen(false);
    setQuery("");
    void navigate({ to });
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-surface-1 lg:flex">
        <div className="border-b border-border p-6"><Logo /><p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Context intelligence · workspace</p></div>
        <div className="border-b border-border p-4">
          <button type="button" onClick={() => setPaletteOpen(true)} className="flex w-full items-center justify-between rounded-sm border border-border bg-background px-3 py-2 text-left text-xs text-muted-foreground hover:text-foreground" aria-label="Open command palette">
            <span className="flex items-center gap-2"><Command size={14} aria-hidden="true" /> Jump to…</span><kbd className="font-mono text-[10px]">⌘K</kbd>
          </button>
        </div>
        <AppNavigation pathname={pathname} onNavigate={() => setMobileOpen(false)} />
        <div className="border-t border-border bg-surface-2/60 p-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-sm bg-teal font-mono text-xs font-bold text-teal-foreground">CS</div><div className="min-w-0 text-xs"><p className="truncate font-semibold">Workspace unavailable</p><p className="truncate text-muted-foreground">Setup required</p></div></div></div>
      </aside>

      {mobileOpen ? <div className="fixed inset-0 z-30 bg-background/70 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" /> : null}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-surface-1 transition-transform lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-border p-5"><Logo /><button type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation" className="grid h-9 w-9 place-items-center rounded-sm border border-border"><X size={16} /></button></div>
        <AppNavigation pathname={pathname} onNavigate={() => setMobileOpen(false)} />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur md:px-8">
          <div className="flex min-w-0 items-center gap-3"><button type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation" className="grid h-9 w-9 place-items-center rounded-sm border border-border lg:hidden"><Menu size={16} /></button><div className="hidden items-center gap-2 text-sm sm:flex"><span className="text-muted-foreground">Workspace</span><span className="text-muted-foreground/50">/</span><span className="truncate font-medium">{pathname.split("/").at(-1) ?? "overview"}</span></div><span className="rounded-sm border border-warn/40 bg-warn/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-warn">demo mode</span></div>
          <div className="flex items-center gap-2"><button type="button" onClick={() => setPaletteOpen(true)} aria-label="Open command palette" className="hidden items-center gap-2 rounded-sm border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground md:flex"><Command size={14} /> <span>Command palette</span><kbd className="font-mono text-[10px]">⌘K</kbd></button><button type="button" aria-label="Notifications" className="grid h-9 w-9 place-items-center rounded-sm border border-border text-muted-foreground hover:text-foreground"><Bell size={16} /></button></div>
        </header>
        <main className="min-w-0">{children}</main>
      </div>

      {paletteOpen ? <div className="fixed inset-0 z-50 grid place-items-start bg-background/75 px-4 pt-[14vh]" onMouseDown={() => setPaletteOpen(false)}><div role="dialog" aria-modal="true" aria-labelledby="command-title" className="w-full max-w-xl overflow-hidden rounded-sm border border-border bg-popover shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-center gap-3 border-b border-border px-4"><Search size={16} className="text-muted-foreground" /><label htmlFor="command-search" className="sr-only">Search commands</label><input id="command-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search workspace…" className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /><kbd className="font-mono text-[10px] text-muted-foreground">ESC</kbd></div><div className="p-2"><p id="command-title" className="px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Navigate</p>{filteredActions.length ? filteredActions.map((action) => <button key={action.to} type="button" onClick={() => go(action.to)} className="flex w-full items-center justify-between rounded-sm px-3 py-3 text-left hover:bg-surface-2"><span className="text-sm">{action.label}</span><span className="text-xs text-muted-foreground">{action.hint}</span></button>) : <p className="px-3 py-5 text-sm text-muted-foreground">No matching workspace actions.</p>}</div></div></div> : null}
    </div>
  );
}

function AppNavigation({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return <nav aria-label="Workspace navigation" className="flex-1 overflow-y-auto px-3 py-5">{navigation.map((group) => <div key={group.label} className="mb-6"><p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{group.label}</p><div className="space-y-0.5">{group.items.map((item) => { const active = pathname === item.to || pathname.startsWith(`${item.to}/`); const Icon = item.icon; return <Link key={item.to} to={item.to} onClick={onNavigate} className={`flex items-center gap-3 rounded-sm border-l-2 px-3 py-2.5 text-sm transition-colors ${active ? "border-teal bg-surface-2 text-foreground" : "border-transparent text-muted-foreground hover:bg-surface-2 hover:text-foreground"}`}><Icon size={15} aria-hidden="true" /><span>{item.label}</span></Link>; })}</div></div>)}</nav>;
}
