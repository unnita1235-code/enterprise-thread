import { createFileRoute } from "@tanstack/react-router";
import { CircleOff } from "lucide-react";
import { PublicPage, SectionHeading } from "@/components/platform/PublicPage";
import { absoluteUrl } from "@/lib/site";
export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations | Context Synthesizer" },
      {
        name: "description",
        content:
          "See the provider-neutral source connection model for Slack, Jira, Google Drive, and Notion.",
      },
      { property: "og:title", content: "Integrations | Context Synthesizer" },
      {
        property: "og:description",
        content:
          "See the provider-neutral source connection model for Slack, Jira, Google Drive, and Notion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/integrations") }],
  }),
  component: IntegrationsPage,
});
function IntegrationsPage() {
  return (
    <PublicPage
      eyebrow="Source connections"
      title="Meet enterprise knowledge where it already lives."
      description="The source layer is provider-neutral by design. Connections are represented honestly until credentials, permissions, and sync workers are configured."
    >
      <SectionHeading eyebrow="Connection status" title="No providers are connected">
        <span className="inline-flex items-center gap-2 font-mono text-xs text-warn">
          <CircleOff size={14} /> setup required
        </span>
      </SectionHeading>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {["Slack", "Jira", "Google Drive", "Notion"].map((provider) => (
          <article key={provider} className="border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{provider}</h3>
              <span className="font-mono text-xs text-muted-foreground">not connected</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              OAuth, scope review, permission mapping, and sync history will appear here once the
              workspace foundation is enabled.
            </p>
          </article>
        ))}
      </div>
    </PublicPage>
  );
}
