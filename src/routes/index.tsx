import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/cs/Sidebar";
import { TopBar } from "@/components/cs/TopBar";
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
    <div className="flex min-h-dvh w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="min-w-0 flex-1">
          <Hero />
          <section id="connectors"><ConnectorCards /></section>
          <WhyRag />
          <section id="pipeline"><Pipeline /></section>
          <Dashboard />
          <QueryDemo />
          <Architecture />
          <ResumeValue />
          <Footer />
        </main>
      </div>
    </div>
  );
}
