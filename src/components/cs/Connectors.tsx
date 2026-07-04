import { connectors, type SourceType } from "@/data/demo";

export function SourceIcon({ id, size = 18 }: { id: SourceType; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24" as const };
  switch (id) {
    case "slack":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="10" width="8" height="4" rx="2" fill="#36C5F0" />
          <rect x="10" y="3" width="4" height="8" rx="2" fill="#2EB67D" />
          <rect x="13" y="10" width="8" height="4" rx="2" fill="#ECB22E" />
          <rect x="10" y="13" width="4" height="8" rx="2" fill="#E01E5A" />
        </svg>
      );
    case "jira":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 2 L22 12 L17 12 A5 5 0 0 1 12 7 Z" fill="#2684FF" />
          <path d="M12 22 L2 12 L7 12 A5 5 0 0 1 12 17 Z" fill="#2684FF" opacity="0.7" />
        </svg>
      );
    case "drive":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M8 3 L16 3 L22 14 L18 21 L6 21 L2 14 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 3 L2 14 L6 21" fill="#0F9D58" opacity="0.9" />
          <path d="M16 3 L22 14 L18 21" fill="#FBBC05" opacity="0.9" />
          <path d="M6 21 L18 21 L22 14 L2 14 Z" fill="#4285F4" opacity="0.9" />
        </svg>
      );
    case "notion":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 7 L8 17 M8 7 L16 17 M16 7 L16 17" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
  }
}

const statusStyles: Record<string, string> = {
  healthy: "text-success",
  syncing: "text-teal",
  degraded: "text-warn",
};

export function ConnectorCards() {
  return (
    <section className="border-b border-border bg-surface-1" aria-labelledby="connectors-title">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Ingestion surface</p>
            <h2 id="connectors-title" className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Four systems, one canonical schema
            </h2>
          </div>
          <p className="hidden max-w-sm text-sm text-muted-foreground md:block">
            Every record — a Slack thread, Jira comment, Drive doc, Notion block — normalizes
            into the same 15-field envelope with permission tags preserved.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-6">
          {connectors.map((c, i) => (
            <article
              key={c.id}
              className={`rounded-md border border-border bg-card p-5 ${
                i === 0 ? "md:col-span-3" : i === 1 ? "md:col-span-3" : "md:col-span-2"
              }`}
            >
              <header className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <SourceIcon id={c.id} />
                  <h3 className="truncate font-medium">{c.name}</h3>
                </div>
                <span className={`font-mono text-xs ${statusStyles[c.status]}`}>
                  ● {c.status}
                </span>
              </header>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="eyebrow">docs</dt>
                  <dd className="mt-1 font-mono">{c.docs.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="eyebrow">last sync</dt>
                  <dd className="mt-1 font-mono">{c.lastSync}</dd>
                </div>
                <div>
                  <dt className="eyebrow">throughput</dt>
                  <dd className="mt-1 font-mono">{c.throughput}</dd>
                </div>
                <div>
                  <dt className="eyebrow">scope</dt>
                  <dd className="mt-1 text-muted-foreground">{c.scope}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
