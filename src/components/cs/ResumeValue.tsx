import { techBadges } from "@/data/demo";

const skills = [
  ["Advanced RAG", "Hybrid retrieval, RRF fusion, cross-encoder reranking, parent-child chunking, score-gated no-answer."],
  ["Data engineering", "Multi-source ingestion, delta pagination, ACL preservation, canonical schemas, dead-letter handling."],
  ["Evaluation", "Ragas metrics wired into every trace: faithfulness, recall, precision, groundedness."],
  ["Observability", "Phoenix traces, per-stage latency, drift dashboards, failure taxonomy."],
  ["Semantic modeling", "Entity extraction, cross-system linkage, graph-augmented retrieval."],
  ["AI product engineering", "Recruiter-facing dashboards, source attribution, permission-aware answers."],
];

export function ResumeValue() {
  return (
    <section id="resume" className="border-b border-border bg-surface-1" aria-labelledby="resume-title">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <p className="eyebrow">Why this project</p>
        <h2 id="resume-title" className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight md:text-3xl">
          What this demonstrates to an AI engineering hiring manager
        </h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Context Synthesizer is deliberately shaped like real enterprise infrastructure: a
          messy multi-source ingestion problem, a retrieval stack that combines lexical and
          semantic signals, an evaluation loop that catches regressions, and a UI that treats
          citations and permissions as first-class.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2">
          {skills.map(([t, d]) => (
            <article key={t} className="rounded-md border border-border bg-card p-5">
              <h3 className="text-base font-medium text-foreground">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <p className="eyebrow">Stack</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {techBadges.map((b) => (
              <li
                key={b}
                className="rounded-sm border border-border bg-card px-2.5 py-1 font-mono text-[11px] text-foreground"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
