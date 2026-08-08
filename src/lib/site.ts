/**
 * Canonical public origin for the deployed site.
 *
 * Set `VITE_SITE_URL` in your hosting provider (Vercel → Settings → Environment
 * Variables) to the production origin, e.g. `https://context-synthesizer.vercel.app`.
 * If unset, the value below is used as the default so builds never fail.
 *
 * Note: `VITE_*` variables are inlined at build time and are public — never put
 * secrets in them.
 */
const DEFAULT_SITE_URL = "https://enterprise-thread.lovable.app";

function normalize(url: string): string {
  return url.replace(/\/+$/, "");
}

export const SITE_URL = normalize(
  (import.meta.env['VITE_SITE_URL'] as string | undefined)?.trim() || DEFAULT_SITE_URL,
);

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
