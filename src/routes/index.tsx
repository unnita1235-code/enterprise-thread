import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/cs/Nav";
import { Hero } from "@/components/cs/Hero";
import { ConnectorCards } from "@/components/cs/Connectors";
import { WhyRag } from "@/components/cs/WhyRag";
import { Pipeline } from "@/components/cs/Pipeline";
import { Dashboard } from "@/components/cs/Dashboard";
import { QueryDemo } from "@/components/cs/QueryDemo";
import { Architecture } from "@/components/cs/Architecture";
import { ResumeValue } from "@/components/cs/ResumeValue";
import { Footer } from "@/components/cs/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <ConnectorCards />
        <WhyRag />
        <Pipeline />
        <Dashboard />
        <QueryDemo />
        <Architecture />
        <ResumeValue />
      </main>
      <Footer />
    </div>
  );
}
