import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

function useClock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return t.toISOString().slice(11, 19) + "Z";
}

export function TopBar({ onMenu }: { onMenu?: () => void }) {
  const time = useClock();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation"
          className="grid h-9 w-9 place-items-center rounded-sm border border-border md:hidden"
        >
          <Menu size={16} />
        </button>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Dashboard</span>
          <span className="text-muted-foreground/60">/</span>
          <span className="text-foreground">Pipeline overview</span>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-sm border border-border bg-surface-1 px-3 py-1.5 sm:flex">
          <span className="signal-pulse h-2 w-2 rounded-full bg-teal" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-teal">Live context sync</span>
        </div>
        <div className="hidden font-mono text-[11px] uppercase tracking-widest text-muted-foreground lg:block">
          us-east-1 · {time}
        </div>
      </div>
    </header>
  );
}
