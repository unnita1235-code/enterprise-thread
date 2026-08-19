/**
 * Canonical public origin for the deployed site.
 *
 * Set `VITE_SITE_URL` in your hosting provider (Vercel → Settings → Environment
 * Variables) to the production origin, e.g. `https://context-synthesizer.vercel.app`.
 * If unset, the default in `src/lib/env-schema.mjs` is used so builds never fail.
 *
 * Note: `VITE_*` variables are inlined at build time and are public — never put
 * secrets in them.
 */
export { SITE_URL } from "./env";

import { SITE_URL } from "./env";

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
