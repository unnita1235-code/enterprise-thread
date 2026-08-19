#!/usr/bin/env node
// Build-time environment validation. Runs before `vite build`.
// Warnings never fail the build; misconfigured or missing REQUIRED values do.

import { ENV_SCHEMA, checkEnv } from "../src/lib/env-schema.mjs";

const color = process.stdout.isTTY && !process.env["NO_COLOR"];
const c = (code, s) => (color ? `\u001b[${code}m${s}\u001b[0m` : s);
const badge = {
  ok: c("32", "  OK  "),
  info: c("90", " INFO "),
  warn: c("33", " WARN "),
  error: c("31", " FAIL "),
};

const result = checkEnv(process.env);
const byName = new Map(ENV_SCHEMA.map((e) => [e.name, e]));

console.log("");
console.log(c("1", "Environment check"));
console.log(c("90", "─".repeat(60)));

for (const scope of ["public", "build"]) {
  const rows = result.findings.filter((f) => byName.get(f.name)?.scope === scope);
  if (rows.length === 0) continue;
  console.log(
    c("90", scope === "public" ? "public (VITE_*, inlined into the client bundle)" : "build-only (never exposed to the browser)"),
  );
  for (const row of rows) {
    console.log(`${badge[row.level]} ${row.name.padEnd(24)} ${row.message}`);
  }
  console.log("");
}

if (result.errors.length > 0) {
  console.error(c("31", `Build aborted: ${result.errors.length} environment variable(s) are missing or misconfigured.`));
  console.error(
    c("90", "Set them in your hosting provider (Vercel → Settings → Environment Variables) and redeploy."),
  );
  console.error(c("90", "See DEPLOYMENT.md for the full reference."));
  process.exit(1);
}

if (result.warnings.length > 0) {
  console.log(
    c("33", `${result.warnings.length} warning(s) — build continues with defaults. See DEPLOYMENT.md.`),
  );
} else {
  console.log(c("32", "All environment variables look good."));
}
console.log("");
