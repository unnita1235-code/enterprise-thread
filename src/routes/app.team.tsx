import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/platform/AppPage";
export const Route = createFileRoute("/app/team")({
  head: () => ({
    meta: [
      { title: "Team | Context Synthesizer" },
      { name: "description", content: "Workspace membership and access controls." },
      { property: "og:title", content: "Team | Context Synthesizer" },
      { property: "og:description", content: "Workspace membership and access controls." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TeamPage,
});
function TeamPage() {
  return (
    <AppPage
      eyebrow="Workspace application"
      title="Team"
      area="Team"
      description="This workspace surface is reserved for connected, permission-aware data. The current build keeps it intentionally empty rather than showing invented production values."
    />
  );
}
