const layers = [
  {
    k: "L1",
    t: "Ingestion connectors",
    d: "Per-source workers with delta pagination, backoff, and dead-letter queues. Slack, Jira, Drive, Notion.",
    tags: ["Slack API", "Jira API", "Drive API", "Notion API"],
  },
  {
    k: "L2",
    t: "Normalization & metadata",
    d: "Every record maps to a 15-field canonical envelope: source_type, ids, authors, teams, permission_tags, timestamps, trust_score.",
    tags: ["Pydantic", "OpenTelemetry"],
  },
  {
    k: "L3",
    t: "Parent-child chunking",
    d: "Heading-aware splits keep chunks tight; parent doc summary is co-indexed so retrieved slices arrive with their context.",
    tags: ["semchunk", "tiktoken"],
  },
  {
    k: "L4",
    t: "Hybrid retrieval",
    d: "BM25 (Postgres FTS) and dense vectors (bge-large in pgvector + Qdrant) fused with reciprocal rank fusion.",
    tags: ["Postgres · pgvector", "Qdrant", "RRF"],
  },
  {
    k: "L5",
    t: "Cross-encoder reranking",
    d: "Top-40 candidates reranked by ms-marco cross-encoder to top-8 with score-gated fallback to no-answer.",
    tags: ["cross-encoder", "score gating"],
  },
  {
    k: "L6",
    t: "Semantic entity graph",
    d: "Entities extracted at ingest and linked across systems. Retrieval walks the graph to reconstruct cross-tool context.",
    tags: ["spaCy", "Neo4j-compatible"],
  },
  {
    k: "L7",
    t: "Evaluation & telemetry",
    d: "Ragas scores faithfulness, recall, and precision on every trace. Phoenix stores runs for drift analysis.",
    tags: ["Ragas", "Arize Phoenix"],
  },
  {
    k: "L8",
    t: "Secure source attribution",
    d: "Permission tags travel with every chunk. Answers cite specific documents; ACL-filtered candidates are logged.",
    tags: ["ACL propagation", "audit log"],
  },
];

export function Architecture() {
  return (
    <section id="architecture" className="border-b border-border" aria-labelledby="arch-title">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <p className="eyebrow">System architecture</p>
        <h2 id="arch-title" className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Eight layers, one contract
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Each layer has a narrow contract with the next. Traces flow forward; evaluation flows
          backward.
        </p>

        <ol className="mt-10 space-y-3">
          {layers.map((l, i) => (
            <li
              key={l.k}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 rounded-md border border-border bg-card p-5 md:grid-cols-[80px_minmax(0,1fr)_260px]"
            >
              <div>
                <p className="font-mono text-xs text-teal">{l.k}</p>
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}/{layers.length}
                </p>
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-medium text-foreground">{l.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{l.d}</p>
              </div>
              <div className="col-span-2 flex flex-wrap gap-1.5 md:col-span-1 md:justify-end">
                {l.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-sm border border-border bg-surface-1 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
