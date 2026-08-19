import * as Sentry from "@sentry/react";

import { SENTRY_DSN, SENTRY_ENVIRONMENT, reportEnvStatus } from "./env";

const RELEASE =
  (import.meta.env['VITE_VERCEL_GIT_COMMIT_SHA'] as string | undefined) ||
  (import.meta.env['VITE_SENTRY_RELEASE'] as string | undefined) ||
  undefined;

/** Benign noise we never want to page on. */
const IGNORE_ERRORS = [
  /hydrated but some attributes/i,
  /Hydration failed because/i,
  /There was an error while hydrating/i,
  /Minified React error #(418|423|425)/,
  /ResizeObserver loop/i,
  /Non-Error promise rejection captured/i,
  // Browser extensions / injected scripts
  /chrome-extension:\/\//,
  /moz-extension:\/\//,
  /Failed to fetch dynamically imported module/i,
];

let initialized = false;

export function isMonitoringEnabled() {
  return Boolean(SENTRY_DSN);
}

/** Initializes Sentry once on the client. No-op without a DSN. */
export function initMonitoring() {
  if (initialized) return;
  initialized = true;

  if (!SENTRY_DSN) {
    reportEnvStatus();
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    release: RELEASE,
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.2,
    ignoreErrors: IGNORE_ERRORS,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: false, blockAllMedia: true }),
      // Track non-crashing errors surfaced through console.error.
      Sentry.captureConsoleIntegration({ levels: ["error"] }),
    ],
    beforeSend(event) {
      // Strip query strings from URLs so nothing sensitive is retained.
      if (event.request?.url) {
        try {
          const url = new URL(event.request.url);
          event.request.url = `${url.origin}${url.pathname}`;
        } catch {
          /* leave as-is */
        }
      }
      return event;
    },
  });

  reportEnvStatus((result) => {
    Sentry.captureMessage("Environment misconfiguration detected", {
      level: "warning",
      extra: { findings: result.errors.map((f) => `${f.name}: ${f.message}`) },
    });
  });
}

/** Reports a caught exception with context. Safe to call when disabled. */
export function captureError(error: unknown, context: Record<string, unknown> = {}) {
  if (!SENTRY_DSN) return;
  Sentry.captureException(error, { extra: context });
}
