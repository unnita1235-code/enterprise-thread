import { createFileRoute } from "@tanstack/react-router";
import { DemoExperience } from "@/components/cs/DemoExperience";
import { absoluteUrl } from "@/lib/site";
export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Interactive demo | Context Synthesizer" },
      {
        name: "description",
        content:
          "Inspect the Context Synthesizer frontend architecture demonstration and its clearly labeled static dataset.",
      },
      { property: "og:title", content: "Interactive demo | Context Synthesizer" },
      {
        property: "og:description",
        content:
          "Inspect the Context Synthesizer frontend architecture demonstration and its clearly labeled static dataset.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/demo") }],
  }),
  component: DemoExperience,
});
