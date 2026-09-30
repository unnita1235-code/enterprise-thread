import { createFileRoute } from "@tanstack/react-router";
import { AppPage } from "@/components/platform/AppPage";
export const Route = createFileRoute("/app/entities")({ component: EntitiesPage });
function EntitiesPage() { return <AppPage eyebrow="Workspace application" title="Entities" area="Entities" description="This workspace surface is reserved for connected, permission-aware data. The current build keeps it intentionally empty rather than showing invented production values." />; }
