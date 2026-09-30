import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/platform/AppPage";
export const Route = createFileRoute("/app/evaluations")({
  head: () => ({
    meta: [
      { title: "Evaluations | Context Synthesizer" },
      {
        name: "description",
        content: "Evaluation runs for retrieval and grounded answer quality.",
      },
      { property: "og:title", content: "Evaluations | Context Synthesizer" },
      {
        property: "og:description",
        content: "Evaluation runs for retrieval and grounded answer quality.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EvaluationsPage,
});
function EvaluationsPage() {
  return (
    <AppPage
      eyebrow="Workspace application"
      title="Evaluations"
      area="Evaluations"
      description="This workspace surface is reserved for connected, permission-aware data. The current build keeps it intentionally empty rather than showing invented production values."
    />
  );
}
