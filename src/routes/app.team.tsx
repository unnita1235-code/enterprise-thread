import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/platform/AppPage";
export const Route = createFileRoute("/app/team")({ component: TeamPage });
function TeamPage() { return <AppPage eyebrow="Workspace application" title="Team" area="Team" description="This workspace surface is reserved for connected, permission-aware data. The current build keeps it intentionally empty rather than showing invented production values." />; }
