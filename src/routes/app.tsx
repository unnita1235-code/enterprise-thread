import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/platform/AppShell";
export const Route = createFileRoute("/app")({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
