import { Moon, Sun, Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useTheme } from "@/lib/theme";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "dashboard", label: "Dashboard" },
  { id: "query", label: "Query" },
  { id: "architecture", label: "Architecture" },
  { id: "resume", label: "Value" },
];

export function Nav() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 md:px-8">
        <a href="#overview" className="min-w-0">
          <Logo />
        </a>
        <div className="flex items-center gap-1 md:gap-2">
          <nav className="hidden items-center gap-1 md:flex">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface-1 hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
          </nav>
          <a
            href="#dashboard"
            className="hidden rounded-md bg-teal px-3 py-1.5 text-sm font-medium text-teal-foreground transition-opacity hover:opacity-90 md:inline-flex"
          >
            View dashboard
          </a>
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-surface-1"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
          >
            <Menu size={16} />
          </button>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-border bg-background px-5 pb-3 md:hidden">
          <ul className="flex flex-col">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2 text-sm text-foreground hover:bg-surface-1"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
