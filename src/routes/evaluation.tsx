import { createFileRoute } from "@tanstack/react-router";
import { PublicPage, SectionHeading, InfoGrid } from "@/components/platform/PublicPage";
import { absoluteUrl } from "@/lib/site";
export const Route = createFileRoute("/evaluation")({
  head: () => ({
    meta: [
      { title: "Evaluation | Context Synthesizer" },
      {
        name: "description",
        content:
          "See how retrieval quality, groundedness, citations, latency, and cost fit into the context intelligence quality loop.",
      },
      { property: "og:title", content: "Evaluation | Context Synthesizer" },
      {
        property: "og:description",
        content:
          "See how retrieval quality, groundedness, citations, latency, and cost fit into the context intelligence quality loop.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/evaluation") }],
  }),
  component: EvaluationPage,
});
function EvaluationPage() {
  return (
    <PublicPage
      eyebrow="Quality engineering"
      title="Measure groundedness before shipping confidence."
      description="Evaluation is treated as a release surface: retrieval quality, faithfulness, citation correctness, latency, cost, and failure modes belong beside the answer."
    >
      <SectionHeading eyebrow="Evaluation center" title="Quality signals belong beside the answer">
        <span className="font-mono text-xs text-warn">no live runs</span>
      </SectionHeading>
      <InfoGrid
        items={[
          {
            label: "Retrieval",
            value: "Recall · precision",
            detail: "Measure whether the right context enters the candidate set.",
          },
          {
            label: "Generation",
            value: "Faithfulness",
            detail: "Check claims against retrieved evidence before presenting confidence.",
          },
          {
            label: "Operations",
            value: "Latency · cost",
            detail: "Track the system trade-offs that make a production workflow sustainable.",
          },
        ]}
      />
    </PublicPage>
  );
}
