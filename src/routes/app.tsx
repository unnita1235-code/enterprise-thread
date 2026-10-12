import { useState } from "react";
import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/platform/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { createWorkspace, listMyWorkspaces } from "@/lib/workspaces.functions";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const queryClient = useQueryClient();

  const workspacesQuery = useQuery({
    queryKey: ["my-workspaces", user?.id],
    queryFn: () => listMyWorkspaces(),
    enabled: Boolean(user),
  });

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Restoring session…
        </p>
      </div>
    );
  }

  if (!user) {
    void navigate({ to: "/login", search: { redirect: pathname } });
    return null;
  }

  if (workspacesQuery.isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Loading workspaces…
        </p>
      </div>
    );
  }

  if (workspacesQuery.isError) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background px-4">
        <div className="max-w-md border border-border bg-card p-6 text-center">
          <h1 className="text-lg font-semibold">Couldn't load your workspaces</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {workspacesQuery.error instanceof Error
              ? workspacesQuery.error.message
              : "Unknown error"}
          </p>
          <button
            type="button"
            onClick={() => void workspacesQuery.refetch()}
            className="mt-5 rounded-sm bg-teal px-4 py-2 text-sm font-medium text-teal-foreground hover:opacity-90"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const workspaces = workspacesQuery.data ?? [];

  if (workspaces.length === 0) {
    return (
      <WorkspaceOnboarding
        onCreated={() => void queryClient.invalidateQueries({ queryKey: ["my-workspaces"] })}
      />
    );
  }

  return (
    <AppShell workspace={workspaces[0]} workspaceCount={workspaces.length}>
      <Outlet />
    </AppShell>
  );
}

function WorkspaceOnboarding({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await createWorkspace({ data: { name } });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create workspace");
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-background px-4">
      <div className="w-full max-w-md border border-border bg-card p-6 md:p-8">
        <p className="eyebrow">First-run setup</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Create your workspace</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A workspace is the tenancy boundary for sources, documents, retrieval, and audit events.
          You'll be its owner.
        </p>
        <form onSubmit={(event) => void handleSubmit(event)} className="mt-6 space-y-4">
          <div>
            <label htmlFor="workspace-name" className="mb-1.5 block text-xs font-medium">
              Workspace name
            </label>
            <input
              id="workspace-name"
              type="text"
              required
              minLength={2}
              maxLength={80}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Acme Knowledge"
              className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </div>
          {error ? (
            <p
              role="alert"
              className="rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
            >
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-sm bg-teal px-4 py-2.5 text-sm font-semibold text-teal-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Creating…" : "Create workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}
