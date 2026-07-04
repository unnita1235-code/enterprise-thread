import { useState } from "react";
import { demoQueries } from "@/data/demo";
import { SourceIcon } from "./Connectors";
import { Search } from "lucide-react";

export function QueryDemo() {
  const [active, setActive] = useState(demoQueries[0].id);
  const q = demoQueries.find((x) => x.id === active)!;

  return (
    <section id="query" className="border-b border-border bg-surface-1" aria-labelledby="query-title">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <p className="eyebrow">Interactive demo</p>
        <h2 id="query-title" className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Ask across every system
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Pick a real enterprise question. See what was retrieved, from where, and how the
          synthesized answer scored.
        </p>

        <div className="mt-8 rounded-md border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Search size={16} className="text-muted-foreground" />
            <label className="sr-only" htmlFor="cs-query">Query</label>
            <input
              id="cs-query"
              value={q.question}
              readOnly
              className="w-full bg-transparent text-sm text-foreground outline-none"
            />
            <span className="font-mono text-[11px] text-muted-foreground">↵ run</span>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-border px-4 py-3">
            {demoQueries.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setActive(d.id)}
                className={`rounded-md border px-3 py-1.5 text-left text-xs transition-colors ${
                  active === d.id
                    ? "border-teal bg-teal/10 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {d.question}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="border-b border-border p-5 lg:border-b-0 lg:border-r">
              <p className="eyebrow">Retrieved context · {q.citations.length} chunks</p>
              <ul className="mt-3 space-y-3">
                {q.citations.map((c) => (
                  <li key={c.n} className="rounded-md border border-border bg-background p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <SourceIcon id={c.source} size={14} />
                        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          {c.source}
                        </span>
                        <span className="truncate text-sm font-medium text-foreground">
                          [{c.n}] {c.title}
                        </span>
                      </div>
                      <span className="shrink-0 font-mono text-[11px] text-teal">
                        rerank {c.rerank.toFixed(2)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{c.snippet}</p>
                    <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground">
                      <div><dt className="inline">retrieval </dt><dd className="inline text-foreground">{c.retrieval.toFixed(2)}</dd></div>
                      <div><dt className="inline">trust </dt><dd className="inline text-foreground">{c.trust.toFixed(2)}</dd></div>
                      <div><dt className="inline">freshness </dt><dd className="inline text-foreground">{c.freshness.toFixed(2)}</dd></div>
                      <div>· {c.meta}</div>
                    </dl>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-md border border-teal/40 bg-teal/5 p-5">
                <p className="eyebrow text-teal">Synthesized answer</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{q.answer}</p>
              </div>
            </div>

            <aside className="p-5">
              <p className="eyebrow">Evaluation</p>
              <ul className="mt-3 space-y-3">
                {q.scores.map((s) => (
                  <li key={s.label}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-foreground">{s.label}</span>
                      <span className="font-mono text-sm text-foreground">{s.value.toFixed(2)}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full bg-teal"
                        style={{ width: `${s.value * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-border pt-4">
                <p className="eyebrow">Trace</p>
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                  bm25 → vector → rrf(k=60) → rerank(ce-msmarco) → graph-expand → synthesize
                </p>
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                  latency 842ms · tokens 2,411 · model gpt-4o-mini
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
