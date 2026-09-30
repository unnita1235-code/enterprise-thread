import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/platform/AppPage";
export const Route = createFileRoute("/app/traces")({
  head: () => ({
    meta: [
      { title: "Traces | Context Synthesizer" },
      { name: "description", content: "Inspectable retrieval and answer production traces." },
      { property: "og:title", content: "Traces | Context Synthesizer" },
      {
        property: "og:description",
        content: "Inspectable retrieval and answer production traces.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TracesPage,
});
function TracesPage() {
  return (
    <AppPage
      eyebrow="Workspace application"
      title="Traces"
      area="Traces"
      description="This workspace surface is reserved for connected, permission-aware data. The current build keeps it intentionally empty rather than showing invented production values."
    />
  );
}
