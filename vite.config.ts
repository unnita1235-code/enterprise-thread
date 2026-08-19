// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// Source maps are uploaded to Sentry at build time and then deleted from the deployed
// output, so minified production stack traces are readable without exposing sources.
// Upload is skipped automatically when the Sentry credentials are absent.
const sentryUploadEnabled = Boolean(
  process.env['SENTRY_AUTH_TOKEN'] && process.env['SENTRY_ORG'] && process.env['SENTRY_PROJECT'],
);

// nitro: { preset: "vercel" } overrides the default Cloudflare target for Vercel deployments.
// Inside the Lovable sandbox the preset is force-overridden to cloudflare-module, so this
// only takes effect when building outside the sandbox (e.g., on Vercel's build system).
export default defineConfig({
  nitro: { preset: "vercel" },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    build: { sourcemap: true },
    plugins: sentryUploadEnabled
      ? [
          sentryVitePlugin({
            authToken: process.env['SENTRY_AUTH_TOKEN'],
            org: process.env['SENTRY_ORG'],
            project: process.env['SENTRY_PROJECT'],
            release: {
              name: process.env['VERCEL_GIT_COMMIT_SHA'] || process.env['SENTRY_RELEASE'],
            },
            sourcemaps: {
              // Remove .map files from the deployed output after upload.
              filesToDeleteAfterUpload: ["**/*.map"],
            },
            telemetry: false,
          }),
        ]
      : [],
  },
});
