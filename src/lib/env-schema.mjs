// Single source of truth for every environment variable this app reads.
// Plain ESM so both the Vite client bundle (src/lib/env.ts) and the build-time
// Node script (scripts/check-env.mjs) consume the exact same rules.
//
// Types live in ./env-schema.d.mts.

/** @type {(value: string) => string | undefined} */
function validateSiteUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return `must be an absolute URL (e.g. https://example.com), got "${value}"`;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return `must use http(s), got "${url.protocol}"`;
  }
  if (value.endsWith("/")) {
    return "must not have a trailing slash";
  }
  if (url.pathname !== "/" && url.pathname !== "") {
    return `must be an origin only, without a path (got "${url.pathname}")`;
  }
  return undefined;
}

/** @type {(value: string) => string | undefined} */
function validateSentryDsn(value) {
  if (!/^https:\/\/[^@/]+@[^/]+\/\d+$/.test(value)) {
    return "does not look like a Sentry DSN (expected https://<key>@<host>/<project-id>)";
  }
  return undefined;
}

/** @type {(value: string) => string | undefined} */
function validateNonEmpty(value) {
  return value.trim() === "" ? "must not be empty" : undefined;
}

export const DEFAULT_SITE_URL = "https://enterprise-thread.lovable.app";

export const ENV_SCHEMA = [
  {
    name: "VITE_SITE_URL",
    scope: "public",
    required: false,
    default: DEFAULT_SITE_URL,
    description:
      "Canonical public origin used for <link rel=canonical>, og:url, JSON-LD and /sitemap.xml.",
    validate: validateSiteUrl,
  },
  {
    name: "VITE_SENTRY_DSN",
    scope: "public",
    required: false,
    description:
      "Sentry DSN for frontend error monitoring. When unset, monitoring is disabled and no network calls are made.",
    validate: validateSentryDsn,
  },
  {
    name: "VITE_SENTRY_ENVIRONMENT",
    scope: "public",
    required: false,
    description:
      'Environment label reported to Sentry. Defaults to the Vercel environment ("production" / "preview") or "development".',
    validate: validateNonEmpty,
  },
  {
    name: "SENTRY_AUTH_TOKEN",
    scope: "build",
    secret: true,
    required: false,
    requiredWith: "VITE_SENTRY_DSN",
    description:
      "Sentry auth token used ONLY at build time to upload source maps. Never exposed to the browser.",
    validate: validateNonEmpty,
  },
  {
    name: "SENTRY_ORG",
    scope: "build",
    required: false,
    requiredWith: "SENTRY_AUTH_TOKEN",
    description: "Sentry organization slug for source map upload.",
    validate: validateNonEmpty,
  },
  {
    name: "SENTRY_PROJECT",
    scope: "build",
    required: false,
    requiredWith: "SENTRY_AUTH_TOKEN",
    description: "Sentry project slug for source map upload.",
    validate: validateNonEmpty,
  },
];

/**
 * Validate a bag of env values against the schema.
 * Never throws. Returns structured findings so callers can format them.
 */
export function checkEnv(source, options = {}) {
  const includeBuildScope = options.includeBuildScope ?? true;
  const findings = [];

  const read = (name) => {
    const raw = source?.[name];
    return typeof raw === "string" && raw.trim() !== "" ? raw.trim() : undefined;
  };

  for (const entry of ENV_SCHEMA) {
    if (!includeBuildScope && entry.scope === "build") continue;

    const value = read(entry.name);

    if (value === undefined) {
      if (entry.required) {
        findings.push({
          name: entry.name,
          level: "error",
          message: `missing required variable — ${entry.description}`,
        });
      } else if (entry.requiredWith && read(entry.requiredWith) !== undefined) {
        findings.push({
          name: entry.name,
          level: "warn",
          message: `not set, but ${entry.requiredWith} is — this feature will be skipped. ${entry.description}`,
        });
      } else if (entry.default !== undefined) {
        findings.push({
          name: entry.name,
          level: "warn",
          message: `not set, using default "${entry.default}"`,
        });
      } else {
        findings.push({
          name: entry.name,
          level: "info",
          message: `not set (optional) — ${entry.description}`,
        });
      }
      continue;
    }

    const problem = entry.validate?.(value);
    if (problem) {
      findings.push({
        name: entry.name,
        level: "error",
        message: `misconfigured: ${problem}`,
      });
      continue;
    }

    findings.push({
      name: entry.name,
      level: "ok",
      message: entry.secret ? "set (value hidden)" : `set to "${value}"`,
    });
  }

  return {
    findings,
    errors: findings.filter((f) => f.level === "error"),
    warnings: findings.filter((f) => f.level === "warn"),
    ok: findings.every((f) => f.level !== "error"),
  };
}

/** Compact, single-line summary suitable for production logs. */
export function summarizeEnv(result) {
  const parts = [
    `${result.findings.filter((f) => f.level === "ok").length} ok`,
    `${result.warnings.length} warning(s)`,
    `${result.errors.length} error(s)`,
  ];
  return `[env] ${parts.join(", ")}`;
}
