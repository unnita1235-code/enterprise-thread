const failures = [
  ["Chunks lose their document", "Retrieved slices arrive with no parent, no author, no permissions — the model hallucinates ownership."],
  ["Single-source retrieval", "Vector-only search misses exact identifiers (`ATLAS-874`, `/v2/search`) that BM25 nails."],
  ["No entity model", "Systems don't know that #mobile-auth in Slack, ATLAS-874 in Jira, and RFC-024 in Notion describe the same thing."],
  ["No eval loop", "Nobody knows the retrieval regressed — until a support ticket."],
];

const wins = [
  ["Parent-child linkage", "Every chunk carries its parent summary and metadata; citations resolve back to the exact section."],
  ["Hybrid + rerank", "BM25 + dense retrieval fused with RRF, then a cross-encoder rerank on the top-40."],
  ["Semantic graph", "Entities are extracted once and reused; cross-system context reconstructs on retrieval."],
  ["Continuous evaluation", "Ragas + Phoenix score every trace: faithfulness, recall, groundedness, precision."],
];

export function WhyRag() {
  return (
    <section className="border-b border-border" aria-labelledby="why-title">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <p className="eyebrow">Positioning</p>
        <h2 id="why-title" className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight md:text-3xl">
          Why naive RAG fails inside a real company
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Enterprise questions cross tools, span time, and depend on who is asking. Retrieval
          that treats every chunk as an island cannot answer them.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-md border border-border bg-card">
            <div className="border-b border-border px-5 py-3">
              <p className="eyebrow">Naive RAG</p>
              <h3 className="mt-1 text-lg font-medium">What breaks</h3>
            </div>
            <ul className="divide-y divide-border">
              {failures.map(([t, d]) => (
                <li key={t} className="px-5 py-4">
                  <p className="font-medium text-foreground">{t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-teal/40 bg-card">
            <div className="border-b border-border bg-teal/5 px-5 py-3">
              <p className="eyebrow text-teal">Context Synthesizer</p>
              <h3 className="mt-1 text-lg font-medium">How this system answers</h3>
            </div>
            <ul className="divide-y divide-border">
              {wins.map(([t, d]) => (
                <li key={t} className="px-5 py-4">
                  <p className="font-medium text-foreground">{t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
