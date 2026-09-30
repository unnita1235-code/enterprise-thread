import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/cs/Logo";

type PublicPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

const publicLinks = [
  { to: "/product", label: "Product" },
  { to: "/architecture", label: "Architecture" },
  { to: "/integrations", label: "Integrations" },
  { to: "/security", label: "Security" },
  { to: "/evaluation", label: "Evaluation" },
  { to: "/demo", label: "Demo" },
] as const;

export function PublicPage({ eyebrow, title, description, children }: PublicPageProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3 md:px-8">
          <Link to="/" aria-label="Context Synthesizer home" className="shrink-0">
            <Logo />
          </Link>
          <nav aria-label="Public navigation" className="hidden items-center gap-1 lg:flex">
            {publicLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeProps={{ className: "bg-surface-2 text-foreground" }}
                className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-1 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/app/overview"
            className="inline-flex items-center gap-2 rounded-sm bg-teal px-3 py-2 text-sm font-medium text-teal-foreground transition-opacity hover:opacity-90"
          >
            Open workspace <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-5 pb-14 pt-16 md:px-8 md:pb-20 md:pt-24">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {description}
            </p>
          </div>
        </section>
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">{children}</div>
      </main>

      <footer className="border-t border-border bg-surface-1">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
          <span>Context Synthesizer · enterprise context intelligence</span>
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 text-foreground hover:text-teal"
          >
            Inspect the demonstration <ExternalLink size={14} aria-hidden="true" />
          </Link>
        </div>
      </footer>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 md:flex-row md:items-end">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold md:text-3xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function InfoGrid({
  items,
}: {
  items: Array<{ label: string; value: string; detail: string }>;
}) {
  return (
    <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="bg-card p-5">
          <p className="eyebrow">{item.label}</p>
          <p className="mt-3 font-display text-xl font-semibold text-foreground">{item.value}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}
