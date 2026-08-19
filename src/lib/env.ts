import { checkEnv, summarizeEnv, DEFAULT_SITE_URL } from "./env-schema.mjs";

/**
 * Runtime environment validation.
 *
 * Only `VITE_*` variables reach the browser bundle, so the runtime check skips
 * build-scope variables (they are validated by scripts/check-env.mjs instead).
 */
const publicEnv = import.meta.env as unknown as Record<string, string | undefined>;

export const envCheck = checkEnv(publicEnv, { includeBuildScope: false });

export const SITE_URL = (publicEnv['VITE_SITE_URL']?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, "");
export const SENTRY_DSN = publicEnv['VITE_SENTRY_DSN']?.trim() || undefined;
export const SENTRY_ENVIRONMENT =
  publicEnv['VITE_SENTRY_ENVIRONMENT']?.trim() ||
  (import.meta.env.PROD ? "production" : "development");

let reported = false;

/** Logs the env report once. Verbose in dev, one compact line in production. */
export function reportEnvStatus(onMisconfiguration?: (result: typeof envCheck) => void) {
  if (reported) return envCheck;
  reported = true;

  const problems = [...envCheck.errors, ...envCheck.warnings];

  if (import.meta.env.PROD) {
    if (problems.length > 0) {
      console.warn(
        `${summarizeEnv(envCheck)} ${problems.map((p) => `${p.name}: ${p.message}`).join(" | ")}`,
      );
    }
  } else if (problems.length > 0) {
    console.warn(
      [
        "",
        "┌─ Environment configuration ─────────────────────────────",
        ...problems.map((p) => `│ ${p.level === "error" ? "ERROR" : "WARN "}  ${p.name}: ${p.message}`),
        "└─────────────────────────────────────────────────────────",
        "",
      ].join("\n"),
    );
  }

  if (envCheck.errors.length > 0) onMisconfiguration?.(envCheck);

  return envCheck;
}
