import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/platform/AppPage";
export const Route = createFileRoute("/app/overview")({
  head: () => ({
    meta: [
      { title: "Overview | Context Synthesizer" },
      { name: "description", content: "Workspace overview status and operating context." },
      { property: "og:title", content: "Overview | Context Synthesizer" },
      { property: "og:description", content: "Workspace overview status and operating context." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OverviewPage,
});
function OverviewPage() {
  return (
    <AppPage
      eyebrow="Workspace application"
      title="Overview"
      area="Overview"
      description="This workspace surface is reserved for connected, permission-aware data. The current build keeps it intentionally empty rather than showing invented production values."
    />
  );
}
