import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/platform/AppPage";
export const Route = createFileRoute("/app/sources")({
  head: () => ({
    meta: [
      { title: "Sources | Context Synthesizer" },
      { name: "description", content: "Enterprise source connection and synchronization status." },
      { property: "og:title", content: "Sources | Context Synthesizer" },
      {
        property: "og:description",
        content: "Enterprise source connection and synchronization status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SourcesPage,
});
function SourcesPage() {
  return (
    <AppPage
      eyebrow="Workspace application"
      title="Sources"
      area="Sources"
      description="This workspace surface is reserved for connected, permission-aware data. The current build keeps it intentionally empty rather than showing invented production values."
    />
  );
}
