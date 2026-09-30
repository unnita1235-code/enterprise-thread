import { ArrowLeft, LockKeyhole, ServerOff } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SectionHeading } from "./PublicPage";

type AppPageProps = { eyebrow: string; title: string; description: string; area: string };

export function AppPage({ eyebrow, title, description, area }: AppPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
      <SectionHeading eyebrow={eyebrow} title={title}>
        <span className="inline-flex items-center gap-2 rounded-sm border border-warn/40 bg-warn/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-warn">
          <ServerOff size={13} /> Not connected
        </span>
      </SectionHeading>
      <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section
          className="border border-border bg-card p-6 md:p-8"
          aria-labelledby="workspace-required-title"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-warn/40 bg-warn/10 text-warn">
            <LockKeyhole size={18} />
          </div>
          <h2 id="workspace-required-title" className="mt-6 text-xl font-semibold">
            Connect a workspace to open {area}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
          <p className="mt-5 border-l-2 border-teal pl-4 text-sm leading-relaxed text-foreground">
            This screen is intentionally unavailable in the current build. It contains no fabricated
            live data and will become operational after workspace identity, permissions, and data
            services are connected.
          </p>
          <Link
            to="/"
            className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-teal hover:underline"
          >
            <ArrowLeft size={15} /> Return to public overview
          </Link>
        </section>
        <aside className="border border-border bg-surface-1 p-6">
          <p className="eyebrow">Foundation status</p>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Identity</dt>
              <dd className="font-mono text-warn">not configured</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Workspace</dt>
              <dd className="font-mono text-warn">not configured</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Data plane</dt>
              <dd className="font-mono text-warn">not connected</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Mode</dt>
              <dd className="font-mono text-teal">demo only</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
