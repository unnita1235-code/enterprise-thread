import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type WorkspaceSummary = {
  id: string;
  name: string;
  slug: string;
  role: "owner" | "admin" | "analyst" | "viewer";
};

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "workspace";
}

export const listMyWorkspaces = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<WorkspaceSummary[]> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("workspace_members")
      .select("role, workspaces(id, name, slug)")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return (data ?? []).flatMap((row) => {
      const workspace = row.workspaces as { id: string; name: string; slug: string } | null;
      if (!workspace) return [];
      return [{ id: workspace.id, name: workspace.name, slug: workspace.slug, role: row.role }];
    });
  });

export const createWorkspace = createServerFn({ method: "POST" })
  .inputValidator(z.object({ name: z.string().trim().min(2).max(80) }))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }): Promise<WorkspaceSummary> => {
    const { supabase, userId } = context;
    const name = data.name;
    const slug = `${slugify(name)}-${Math.random().toString(36).slice(2, 8)}`;

    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .insert({ name, slug, created_by: userId })
      .select("id, name, slug")
      .single();
    if (workspaceError || !workspace) {
      throw new Error(workspaceError?.message ?? "Failed to create workspace");
    }

    const { error: memberError } = await supabase.from("workspace_members").insert({
      workspace_id: workspace.id,
      user_id: userId,
      role: "owner",
    });
    if (memberError) throw new Error(memberError.message);

    await supabase.from("audit_events").insert({
      workspace_id: workspace.id,
      actor_id: userId,
      action: "workspace.created",
      target_type: "workspace",
      target_id: workspace.id,
      metadata: { name },
    });

    return { id: workspace.id, name: workspace.name, slug: workspace.slug, role: "owner" };
  });
