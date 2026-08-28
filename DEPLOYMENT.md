# Deploying to Vercel

## Environment variables

This project is a **frontend-only** application (all data is demo data bundled in
`src/data/demo.ts`). There are **no required secrets** and the production build
succeeds with zero environment variables configured.

| Variable | Scope | Required | Default | Purpose |
| --- | --- | --- | --- | --- |
| `VITE_SITE_URL` | Public runtime | No | `https://enterprise-thread.lovable.app` | Canonical public origin used for `<link rel="canonical">`, `og:url`, JSON-LD `@id`/`url`, and `/sitemap.xml`. No trailing slash. |
| `VITE_SENTRY_DSN` | Public runtime | No | Disabled | Enables frontend crash, unhandled rejection, and `console.error` tracking. Use the DSN from Sentry. |
| `VITE_SENTRY_ENVIRONMENT` | Public runtime | No | Vercel environment / `development` | Sentry environment label. |
| `SENTRY_AUTH_TOKEN` | Build-only secret | No | Disabled | Allows the Vercel build to upload source maps to Sentry. Never expose this as `VITE_*`. |
| `SENTRY_ORG` | Build-only | No | Disabled | Sentry organization slug for source map upload. |
| `SENTRY_PROJECT` | Build-only | No | Disabled | Sentry project slug for source map upload. |

> Only `VITE_`-prefixed variables reach the browser bundle. They are inlined at
> build time and are public — never put secrets in them.

### Sentry setup

1. Create a Sentry project using the React platform and copy its DSN into
   `VITE_SENTRY_DSN`.
2. In Vercel → **Settings** → **Environment Variables**, add `SENTRY_AUTH_TOKEN`,
   `SENTRY_ORG`, and `SENTRY_PROJECT` for Production and Preview. These values are
   used only during the build to upload source maps; `.map` files are removed before
   deployment.
3. Redeploy. The release is tagged with the Vercel commit SHA, which lets Sentry map
   minified production stack traces to the matching commit.

All Sentry variables are optional. Without a DSN, monitoring makes no requests. If
only part of the build upload configuration is present, the build prints a warning and
continues without uploading maps.

### Environment checks

`bun run build` validates every variable before Vite starts. Missing optional values
produce warnings and use documented defaults; malformed values fail the build with an
actionable message. The browser repeats the public-variable check once at startup and
prints a concise warning in production (a detailed block in development).

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
preset or output directory needs to be selected in the Vercel UI. It also enables
production source maps for Sentry upload and the Vercel header rules in `vercel.json`.

## Caching and headers

- Hashed JavaScript, CSS, fonts, and assets are immutable for one year.
- HTML is `no-cache` and receives a weak `ETag`; unchanged requests can return `304`
  without serving stale deployments.
- Sitemap, robots, and LLM metadata use a one-hour shared cache with stale-while-
  revalidate.
- Static responses include `nosniff`, strict-origin referrer policy, and same-origin
  framing protection.

Node/Bun versions are resolved by Vercel automatically; no `NODE_VERSION` or
`ENABLE_EXPERIMENTAL_COREPACK` variable is needed.

## After deploying

- Update `public/robots.txt` if you change domains — its `Sitemap:` line is a
  static file and is not templated by `VITE_SITE_URL`.
- Verify `/sitemap.xml` returns your configured origin.
