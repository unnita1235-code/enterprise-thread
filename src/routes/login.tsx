import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Logo } from "@/components/cs/Logo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { absoluteUrl } from "@/lib/site";

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: loginSearchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — Context Synthesizer" },
      { name: "description", content: "Sign in to your Context Synthesizer workspace." },
      { property: "og:title", content: "Sign in — Context Synthesizer" },
      { property: "og:description", content: "Sign in to your Context Synthesizer workspace." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/login") },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function safeRedirect(target: string | undefined): string {
  if (target && target.startsWith("/") && !target.startsWith("//")) return target;
  return "/app/overview";
}

function LoginPage() {
  const { redirect: redirectTarget } = Route.useSearch();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && user) {
    void navigate({ to: safeRedirect(redirectTarget) });
    return null;
  }

  async function handleEmailSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        void navigate({ to: safeRedirect(redirectTarget) });
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}${safeRedirect(redirectTarget)}`,
          },
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          void navigate({ to: safeRedirect(redirectTarget) });
        } else {
          setNotice("Check your inbox to confirm your email, then sign in.");
          setMode("signin");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(result.error.message ?? "Google sign-in failed");
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Logo />
        </div>
        <div className="border border-border bg-card p-6 md:p-8">
          <p className="eyebrow">Workspace access</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            {mode === "signin" ? "Sign in" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Access your Context Synthesizer workspace."
              : "Start a workspace for your team's context layer."}
          </p>

          <button
            type="button"
            onClick={() => void handleGoogle()}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm border border-border bg-surface-1 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-2"
          >
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={(event) => void handleEmailSubmit(event)} className="space-y-4">
            {mode === "signup" ? (
              <div>
                <label htmlFor="full-name" className="mb-1.5 block text-xs font-medium">
                  Full name
                </label>
                <input
                  id="full-name"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-teal"
                />
              </div>
            ) : null}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-teal"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-teal"
              />
            </div>

            {error ? (
              <p role="alert" className="rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            ) : null}
            {notice ? (
              <p role="status" className="rounded-sm border border-teal/40 bg-teal/10 px-3 py-2 text-xs text-teal">
                {notice}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-sm bg-teal px-4 py-2.5 text-sm font-semibold text-teal-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            {mode === "signin" ? "No account yet?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setNotice(null);
              }}
              className="font-medium text-teal hover:underline"
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            ← Back to overview
          </Link>
        </p>
      </div>
    </div>
  );
}
