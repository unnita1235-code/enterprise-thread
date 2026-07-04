import { ArrowRight, ArrowUpRight } from "lucide-react";

export function Hero() {
  return (
    <section
      id="overview"
      className="relative border-b border-border"
      aria-labelledby="hero-title"
    >
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 md:px-8 md:pt-24">
        <p className="eyebrow">v0.4 · demo dataset</p>
        <h1
          id="hero-title"
          className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl"
        >
          An enterprise context pipeline that makes LLM answers{" "}
          <span className="text-teal">defensible.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
          Context Synthesizer unifies Slack, Jira, Google Drive, and Notion into a single
          semantic layer — with hybrid retrieval, parent-child chunking, entity graphs, and
          continuous evaluation of faithfulness, recall, and groundedness.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#dashboard"
            className="inline-flex items-center gap-2 rounded-md bg-teal px-4 py-2.5 text-sm font-medium text-teal-foreground transition-opacity hover:opacity-90"
          >
            Open live dashboard <ArrowRight size={16} />
          </a>
          <a
            href="#architecture"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-1"
          >
            System architecture <ArrowUpRight size={16} />
          </a>
        </div>

        <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-4">
          {[
            ["244,606", "documents indexed"],
            ["6 systems", "unified schema"],
            ["94 s", "median freshness"],
            ["0.912", "retrieval P@8"],
          ].map(([v, l]) => (
            <div key={l} className="border-l border-border pl-4">
              <dt className="eyebrow">{l}</dt>
              <dd className="mt-1 font-mono text-2xl text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
