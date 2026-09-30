import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/platform/AppPage";
export const Route = createFileRoute("/app/entities")({
  head: () => ({
    meta: [
      { title: "Entities | Context Synthesizer" },
      { name: "description", content: "Entity explorer for connected enterprise context." },
      { property: "og:title", content: "Entities | Context Synthesizer" },
      { property: "og:description", content: "Entity explorer for connected enterprise context." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EntitiesPage,
});
function EntitiesPage() {
  return (
    <AppPage
      eyebrow="Workspace application"
      title="Entities"
      area="Entities"
      description="This workspace surface is reserved for connected, permission-aware data. The current build keeps it intentionally empty rather than showing invented production values."
    />
  );
}
