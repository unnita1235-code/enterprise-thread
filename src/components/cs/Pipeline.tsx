const steps = [
  { k: "01", t: "Ingest", d: "Connector workers pull deltas from Slack, Jira, Drive, Notion." },
  { k: "02", t: "Normalize", d: "Map to canonical envelope; preserve ACLs, authors, timestamps." },
  { k: "03", t: "Chunk", d: "Heading-aware split with parent-child linkage." },
  { k: "04", t: "Embed", d: "bge-large for dense; BM25 index for lexical." },
  { k: "05", t: "Retrieve", d: "RRF fusion, top-40 → cross-encoder rerank → top-8." },
  { k: "06", t: "Graph", d: "Entity extraction stitches cross-system context." },
  { k: "07", t: "Synthesize", d: "Grounded answer with numbered source citations." },
  { k: "08", t: "Evaluate", d: "Ragas scores every trace; Phoenix stores the run." },
];

export function Pipeline() {
  return (
    <section className="border-b border-border bg-surface-1" aria-labelledby="pipeline-title">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <p className="eyebrow">How it works</p>
        <h2 id="pipeline-title" className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          The pipeline, end to end
        </h2>
        <ol className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li
              key={s.k}
              className="relative rounded-md border border-border bg-card p-5"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs text-teal">{s.k}</span>
                <span className="h-px w-8 bg-border" />
              </div>
              <p className="mt-3 text-base font-medium text-foreground">{s.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
