# Deploy Context Synthesizer frontend to Vercel

## Current state

The project is a TanStack Start SSR app (Vite + React 19 + Nitro). It is **frontend-only** — no `.env`, no Supabase/Cloud backend, no `createServerFn` calls. The only server-side code is the SSR error wrapper (`src/server.ts`), the sitemap route, and head metadata. All data is mock data in `src/data/demo.ts`.

Nitro is currently configured (via `@lovable.dev/vite-tanstack-config`) to default to the `cloudflare-module` preset. The config exposes a `nitro` option that lets us pin a different preset — but this override only applies **outside** a Lovable build, so the Lovable preview/publish pipeline is unaffected.

There is one hydration-mismatch runtime error: `TopBar.tsx` renders a live clock from `new Date()` at init, so SSR time ≠ client time. This should be fixed before production deploy.

## Plan

### 1. Pin the Nitro preset to Vercel — `vite.config.ts`

Add `nitro: { preset: "vercel" }` to the `defineConfig` call. When built on Vercel (or in any non-Lovable CI), Nitro generates `.vercel/output/` in Vercel's Build Output API format, which Vercel auto-detects and deploys as SSR functions + static assets. Lovable builds remain on Cloudflare (the override is ignored inside Lovable).

### 2. Add `vercel.json` — build settings

```json
{
  "buildCommand": "bun run build",
  "installCommand": "bun install",
  "framework": null
}
```

`framework: null` prevents Vercel from auto-detecting "Vite" and applying Vite defaults (which would look for `dist/` instead of the Nitro output).

### 3. Add `.nvmrc` — pin Node 22

```
22
```

### 4. Fix the hydration mismatch — `src/components/cs/TopBar.tsx`

Change `useClock` so it renders an empty placeholder on first paint (SSR) and only starts ticking after mount:

- Initialize state to `null` instead of `new Date()`
- Set the time in `useEffect` (runs only on the client)
- Render a placeholder string while `null`

### 5. Add `.vercel` to `.gitignore`

Prevent committing Vercel's build-output directory.

### 6. Update canonical/og URLs (optional, if you have a Vercel domain)

`__root.tsx`, `sitemap[.]xml.ts`, and `public/robots.txt` all hardcode `https://enterprise-thread.lovable.app/`. If you plan to use a custom Vercel domain, these should be updated to that domain. **Leave as-is if you want the Lovable URL and Vercel URL to both work, or tell me the target domain.**

## What you do after the code changes

1. Push the project to a GitHub repo (use Git sync from the Lovable editor, or push manually).
2. In Vercel: **New Project → Import from GitHub** → select the repo.
3. Vercel reads `vercel.json` automatically — no manual config needed.
4. Deploy. Vercel serves the SSR app at a `*.vercel.app` URL.
