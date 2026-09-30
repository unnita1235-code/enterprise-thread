import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, CircleOff, ShieldCheck } from "lucide-react";
import { PublicPage, SectionHeading, InfoGrid } from "@/components/platform/PublicPage";
import { absoluteUrl } from "@/lib/site";

type PageKey = "product" | "architecture" | "integrations" | "security" | "evaluation";
const pages: Record<PageKey, { eyebrow: string; title: string; description: string }> = {
  product: { eyebrow: "Product surface", title: "A control plane for trustworthy enterprise context.", description: "Context Synthesizer is designed to make the path from disconnected systems to grounded answers inspectable, permission-aware, and measurable." },
  architecture: { eyebrow: "System architecture", title: "Retrieval is a system, not a prompt.", description: "The platform separates source normalization, indexing, hybrid retrieval, policy enforcement, generation, citations, and evaluation so every boundary can be tested." },
  integrations: { eyebrow: "Source connections", title: "Meet enterprise knowledge where it already lives.", description: "The source layer is provider-neutral by design. Connections are represented honestly until credentials, permissions, and sync workers are configured." },
  security: { eyebrow: "Security posture", title: "Permission-aware context from the first retrieval step.", description: "Tenant boundaries, source ACLs, server-side authorization, encrypted credentials, and prompt-injection defenses are product requirements—not afterthoughts." },
  evaluation: { eyebrow: "Quality engineering", title: "Measure groundedness before shipping confidence.", description: "Evaluation is treated as a release surface: retrieval quality, faithfulness, citation correctness, latency, cost, and failure modes belong beside the answer." },
};

export const Route = createFileRoute("/public-page")({
  validateSearch: (search: Record<string, unknown>) => ({ page: typeof search.page === "string" ? search.page as PageKey : "product" }),
  head: ({ search }) => { const page = pages[(search.page as PageKey) in pages ? search.page as PageKey : "product"]; return { meta: [{ title: `${page.title} | Context Synthesizer` }, { name: "description", content: page.description }, { property: "og:title", content: `${page.title} | Context Synthesizer` }, { property: "og:description", content: page.description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: absoluteUrl(`/${search.page ?? "product"}`) }] }; },
  component: PublicPageRoute,
});

function PublicPageRoute() {
  const navigate = useNavigate();
  const pageKey = (Route.useSearch().page as PageKey) in pages ? Route.useSearch().page as PageKey : "product";
  const page = pages[pageKey];
  const routeLinks: Record<PageKey, string> = { product: "/product", architecture: "/architecture", integrations: "/integrations", security: "/security", evaluation: "/evaluation" };
  const setPage = (next: PageKey) => void navigate({ to: "/public-page", search: { page: next } });

  return <PublicPage eyebrow={page.eyebrow} title={page.title} description={page.description}>
    <div className="flex flex-wrap gap-2 border-b border-border pb-6" role="tablist" aria-label="Platform pages">
      {(Object.keys(pages) as PageKey[]).map((key) => <button key={key} type="button" role="tab" aria-selected={key === pageKey} onClick={() => setPage(key)} className={`rounded-sm px-3 py-2 text-sm ${key === pageKey ? "bg-teal text-teal-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}>{pages[key].eyebrow.replace(" surface", "").replace(" architecture", "").replace(" posture", "").replace(" engineering", "")}</button>)}
    </div>
    <PageBody pageKey={pageKey} />
    <div className="mt-12 flex flex-wrap gap-4 border-t border-border pt-6 text-sm"><span className="text-muted-foreground">Direct page:</span><a href={routeLinks[pageKey]} className="text-teal hover:underline">{routeLinks[pageKey]}</a><span className="text-muted-foreground">·</span><a href="/app/overview" className="inline-flex items-center gap-2 text-foreground hover:text-teal">Open workspace shell <ArrowRight size={14} /></a></div>
  </PublicPage>;
}

function PageBody({ pageKey }: { pageKey: PageKey }) {
  if (pageKey === "product") return <><SectionHeading eyebrow="What is real today" title="A transparent product surface"><span className="font-mono text-xs text-warn">demonstration layer only</span></SectionHeading><InfoGrid items={[{ label: "Ask", value: "Workflow mapped", detail: "The answer experience is scoped, but no production model or retrieval service is connected." }, { label: "Sources", value: "Provider-neutral", detail: "Slack, Jira, Drive, and Notion are represented as source types without fake OAuth." }, { label: "Quality", value: "Evaluation-ready", detail: "Trace and evaluation surfaces are designed for measured outputs, not invented live scores." }]} /></>;
  if (pageKey === "architecture") return <><SectionHeading eyebrow="Boundaries" title="A layered context intelligence architecture"><span className="font-mono text-xs text-teal">designed for replacement</span></SectionHeading><div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-5">{["Connectors", "Normalize", "Index", "Retrieve", "Ground"].map((item, index) => <div key={item} className="bg-card p-5"><span className="font-mono text-xs text-teal">0{index + 1}</span><h3 className="mt-8 font-medium">{item}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{["Provider credentials and ACLs stay server-side.", "Canonical records preserve source identity.", "Chunks, vectors, and lexical indexes remain tenant-scoped.", "Hybrid ranking filters permissions before context assembly.", "Citations and traces make answers inspectable."][index]}</p></div>)}</div></>;
  if (pageKey === "integrations") return <><SectionHeading eyebrow="Connection status" title="No providers are connected"><span className="inline-flex items-center gap-2 font-mono text-xs text-warn"><CircleOff size={14} /> setup required</span></SectionHeading><div className="mt-8 grid gap-4 sm:grid-cols-2">{["Slack", "Jira", "Google Drive", "Notion"].map((provider) => <article key={provider} className="border border-border bg-card p-5"><div className="flex items-center justify-between"><h3 className="font-medium">{provider}</h3><span className="font-mono text-xs text-muted-foreground">not connected</span></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">OAuth, scope review, permission mapping, and sync history will appear here once the workspace foundation is enabled.</p></article>)}</div></>;
  if (pageKey === "security") return <><SectionHeading eyebrow="Trust boundaries" title="Security is part of retrieval"><ShieldCheck className="text-teal" size={22} /></SectionHeading><div className="mt-8 grid gap-4 md:grid-cols-2">{["Tenant isolation", "Permission-aware retrieval", "Prompt-injection defense", "Secret discipline"].map((item) => <div key={item} className="border border-border bg-card p-5"><Check className="text-teal" size={18} /><h3 className="mt-5 font-medium">{item}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">This control is a stated product boundary and is not represented as complete until its server-side implementation and tests ship.</p></div>)}</div></>;
  return <><SectionHeading eyebrow="Evaluation center" title="Quality signals belong beside the answer"><span className="font-mono text-xs text-warn">no live runs</span></SectionHeading><InfoGrid items={[{ label: "Retrieval", value: "Recall · precision", detail: "Measure whether the right context enters the candidate set." }, { label: "Generation", value: "Faithfulness", detail: "Check claims against retrieved evidence before presenting confidence." }, { label: "Operations", value: "Latency · cost", detail: "Track the system trade-offs that make a production workflow sustainable." }]} /></>;
}
