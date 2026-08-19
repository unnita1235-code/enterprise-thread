// Server-side error reporting. Uses Sentry's HTTP envelope endpoint directly so
// no Node-only SDK internals are pulled into the Worker/serverless runtime.

function readEnv(name: string): string | undefined {
  const value = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env?.[name];
  return value && value.trim() !== "" ? value.trim() : undefined;
}

function parseDsn(dsn: string) {
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.replace(/^\//, "");
    if (!url.username || !projectId) return undefined;
    return {
      key: url.username,
      endpoint: `${url.protocol}//${url.host}/api/${projectId}/envelope/`,
    };
  } catch {
    return undefined;
  }
}

/** Fire-and-forget SSR error report. Silently no-ops without a DSN. */
export async function captureServerError(
  error: unknown,
  context: Record<string, unknown> = {},
): Promise<void> {
  const dsn = readEnv("SENTRY_DSN") ?? readEnv("VITE_SENTRY_DSN");
  if (!dsn) return;
  const parsed = parseDsn(dsn);
  if (!parsed) return;

  const err = error instanceof Error ? error : new Error(String(error));
  const eventId = crypto.randomUUID().replace(/-/g, "");
  const sentAt = new Date().toISOString();

  const event = {
    event_id: eventId,
    timestamp: sentAt,
    platform: "javascript",
    level: "error",
    environment:
      readEnv("VITE_SENTRY_ENVIRONMENT") ?? readEnv("VERCEL_ENV") ?? "production",
    release: readEnv("VERCEL_GIT_COMMIT_SHA") ?? readEnv("SENTRY_RELEASE"),
    server_name: undefined,
    tags: { runtime: "ssr" },
    extra: context,
    exception: {
      values: [
        {
          type: err.name,
          value: err.message,
          stacktrace: err.stack ? { frames: parseStack(err.stack) } : undefined,
        },
      ],
    },
  };

  const envelope =
    `${JSON.stringify({ event_id: eventId, sent_at: sentAt })}\n` +
    `${JSON.stringify({ type: "event" })}\n` +
    `${JSON.stringify(event)}\n`;

  try {
    await fetch(parsed.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/x-sentry-envelope",
        "x-sentry-auth": `Sentry sentry_version=7, sentry_client=context-synthesizer/1.0, sentry_key=${parsed.key}`,
      },
      body: envelope,
    });
  } catch {
    /* never let reporting break the response */
  }
}

function parseStack(stack: string) {
  return stack
    .split("\n")
    .slice(1)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("at "))
    .map((line) => {
      const match = /^at\s+(.*?)\s+\((.*?):(\d+):(\d+)\)$/.exec(line) ?? [];
      return {
        function: match[1] ?? line.replace(/^at\s+/, ""),
        filename: match[2],
        lineno: match[3] ? Number(match[3]) : undefined,
        colno: match[4] ? Number(match[4]) : undefined,
      };
    })
    .reverse();
}
