# Production hardening: env checks, Sentry, source maps, Vercel caching

Four independent additions to make the deployed frontend observable and fast.

## 1. Environment variable validation (build + runtime)

A single schema module lists every variable the app reads, whether it is required, its
default, and a validation rule (e.g. `VITE_SITE_URL` must be an absolute `http(s)` URL
with no trailing slash; `VITE_SENTRY_DSN` must look like a Sentry DSN when present).

- **Build time**: a small script runs before `vite build` and prints a clear, grouped
  report — `OK`, `WARN` (missing optional / using default), `ERROR` (missing required or
  malformed). Errors fail the build with an actionable message; warnings never fail it.
  Today nothing is strictly required, so a clean build with zero env vars still succeeds.
- **Runtime**: the same schema is checked once on app boot. In dev and preview it logs a
  formatted console warning block; in production it logs a single compact warning and
  reports a Sentry "misconfiguration" breadcrumb instead of spamming users' consoles.

## 2. Sentry error monitoring

- Client init in the app entry with `tracesSampleRate` low, `replaysOnErrorSampleRate`
  modest, `environment` derived from Vercel env, and `release` set to the Vercel commit
  SHA so stack traces map to the right source maps.
- Wire the existing root `errorComponent` boundary and `lib/lovable-error-reporting.ts`
  path to also forward to Sentry, so nothing that already reports to Lovable is lost.
- Capture unhandled errors/rejections and `console.error` calls (via a console
  integration) so non-crashing errors are still tracked.
- Server-side: report SSR failures caught in `src/server.ts` / the `start.ts` error
  middleware to Sentry as well, so 500s carry stack traces.
- Sentry is fully optional: with no DSN configured the app runs untouched (no network
  calls, no init), which keeps the Lovable preview and local dev clean.
- Noise control: ignore known-benign hydration warnings and browser-extension errors,
  and scrub request URLs of query strings.

## 3. Source map upload from Vercel

- Vite is configured to emit source maps for the production build.
- The Sentry Vite plugin uploads client and SSR maps during the Vercel build, tagged with
  the same release, then deletes the `.map` files from the deployed output so they are
  not publicly downloadable.
- Upload is skipped automatically when the auth token or org/project vars are absent, so
  builds keep working without Sentry credentials.

## 4. Vercel caching and header rules

Added to `vercel.json`:

- `/_build/assets/*` and other hashed/immutable static output:
  `Cache-Control: public, max-age=31536000, immutable`.
- HTML / SSR document responses: `Cache-Control: no-cache` (revalidate every time) so
  deploys are picked up immediately while still allowing 304s via ETag.
- `sitemap.xml`, `robots.txt`, `llms.txt`: short shared cache with
  `stale-while-revalidate`.
- Favicon/images: long `max-age` with revalidation.
- Security/perf headers alongside them: `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`.
- ETags are emitted by Vercel for static assets by default; the SSR document response
  gets an explicit weak ETag so unchanged pages return 304.

## Documentation

`DEPLOYMENT.md`, `.env.example`, and the README get a table of all variables split into
**build-only** (`SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` — secret, never
exposed to the browser) and **public runtime** (`VITE_SITE_URL`, `VITE_SENTRY_DSN`),
with exact Vercel dashboard steps and what happens when each is missing.

## Technical notes

- New files: `src/lib/env.ts` (schema + validators, isomorphic), `scripts/check-env.mjs`
  (build-time reporter), `src/lib/monitoring.ts` (Sentry init + guards).
- `package.json`: `build` becomes `node scripts/check-env.mjs && vite build`; adds
  `@sentry/react` and `@sentry/vite-plugin`.
- `vite.config.ts`: `build.sourcemap: true` plus the Sentry plugin passed through
  `defineConfig({ vite: { plugins: [...] } })` — the Lovable preset's own plugins stay
  untouched.
- `SENTRY_AUTH_TOKEN` must be added as a Vercel environment variable (Production +
  Preview); I cannot set that for you, and the build degrades gracefully without it.
- Verification: run the env checker with good/bad/missing values, run a Vercel-preset
  production build to confirm maps are emitted and stripped, and confirm the app boots
  with no DSN set.
