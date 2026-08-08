# Deploying to Vercel

## Environment variables

This project is a **frontend-only** application (all data is demo data bundled in
`src/data/demo.ts`). There are **no required secrets** and the production build
succeeds with zero environment variables configured.

| Variable         | Required | Default                                    | Purpose |
| ---------------- | -------- | ------------------------------------------ | ------- |
| `VITE_SITE_URL`  | No       | `https://enterprise-thread.lovable.app`    | Canonical public origin used for `<link rel="canonical">`, `og:url`, JSON-LD `@id`/`url`, and `/sitemap.xml`. No trailing slash. |

> Only `VITE_`-prefixed variables reach the browser bundle. They are inlined at
> build time and are public — never put secrets in them.

### Setting `VITE_SITE_URL` in Vercel

1. Vercel dashboard → your project → **Settings** → **Environment Variables**
2. **Key**: `VITE_SITE_URL`
   **Value**: your production origin, e.g. `https://context-synthesizer.vercel.app`
   (or your custom domain)
3. **Environments**: check **Production**, **Preview**, and **Development**
4. **Save**, then **Deployments** → latest → **Redeploy** (Vite inlines the value
   at build time, so an existing deployment will not pick it up).

Locally, copy `.env.example` to `.env` and adjust if you want a different origin.

## Build settings

`vercel.json` already declares everything Vercel needs:

```json
{
  "buildCommand": "bun run build",
  "installCommand": "bun install",
  "framework": null
}
```

`vite.config.ts` sets `nitro: { preset: "vercel" }`, which emits the Vercel
serverless SSR function plus static assets under `.vercel/output/`. No framework
preset or output directory needs to be selected in the Vercel UI.

Node/Bun versions are resolved by Vercel automatically; no `NODE_VERSION` or
`ENABLE_EXPERIMENTAL_COREPACK` variable is needed.

## After deploying

- Update `public/robots.txt` if you change domains — its `Sitemap:` line is a
  static file and is not templated by `VITE_SITE_URL`.
- Verify `/sitemap.xml` returns your configured origin.
