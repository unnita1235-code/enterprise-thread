import { createFileRoute } from "@tanstack/react-router";
import { DemoExperience } from "@/components/cs/DemoExperience";
import { absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Context Synthesizer — Enterprise context intelligence" },
      {
        name: "description",
        content:
          "Explore a transparent demonstration of enterprise context intelligence, retrieval architecture, and grounded AI workflows.",
      },
      { property: "og:title", content: "Context Synthesizer — Enterprise context intelligence" },
      {
        property: "og:description",
        content:
          "Explore a transparent demonstration of enterprise context intelligence, retrieval architecture, and grounded AI workflows.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Context Synthesizer — Enterprise context intelligence" },
      {
        name: "twitter:description",
        content:
          "Explore a transparent demonstration of enterprise context intelligence, retrieval architecture, and grounded AI workflows.",
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
  }),
  component: DemoExperience,
});
