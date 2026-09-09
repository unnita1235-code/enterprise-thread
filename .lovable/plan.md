# Context Synthesizer Production Evolution Plan

## Outcome

Evolve the current frontend architecture demonstration into a production-oriented Enterprise Context Intelligence Platform without claiming that static demo data or visualized architecture is live functionality.

The rollout preserves the existing industrial console identity, Space Grotesk / DM Sans / JetBrains Mono typography, grid language, deployment hardening, and reusable visualization components.

## Milestones

### 1. Production application foundation — first milestone
- Add the public information routes: `/product`, `/architecture`, `/integrations`, `/security`, `/evaluation`, and `/demo`.
- Add the authenticated-application route family under `/app` with screens for overview, ask, sources, documents, search, entities, evaluations, traces, team, and settings.
- Build one reusable application shell with desktop sidebar, mobile navigation, breadcrumbs, workspace switcher placeholder, notifications affordance, command palette entry point, keyboard focus states, and route-aware active navigation.
- Keep the existing landing experience reusable as the public `/demo` experience rather than duplicating dashboard sections.
- Add explicit “Demo mode” and “Not connected” states wherever current data is static or a provider is not implemented. Label dashboard metrics as demonstration data and include source/mode context in the UI.
- Add loading, empty, error, and unauthorized placeholders so future server data can replace them without another navigation rewrite.
- Give every new content route its own title, description, Open Graph metadata, and canonical URL.

**Acceptance:** all requested public and application URLs render through TanStack Router, navigation works on desktop and mobile, no page presents demo values as live production measurements, and the build/typecheck remain clean.

### 2. Identity, workspace, and tenancy
- Enable Lovable Cloud when this milestone begins.
- Implement sign-in/session handling and a first-run workspace flow.
- Model organizations, workspaces, memberships, and permissions with tenant ownership on every tenant record.
- Store Owner, Admin, Analyst, and Viewer in a separate role/membership structure; never store roles on profiles or user records.
- Enforce authorization server-side and add database grants plus RLS policies for every public table.
- Add audit events for sign-in, membership changes, permission changes, and sensitive actions.

**Acceptance:** unauthenticated users cannot access `/app`, users cannot cross workspace boundaries, and authorization tests cover each role.

### 3. Source connections and synchronization foundation
- Create provider-neutral connector interfaces for Google Drive, Slack, Notion, and Jira.
- Add server-side connection state, encrypted provider credential storage, source configuration, permissions, health, and sync history.
- Implement the sync job abstraction with queued, running, completed, failed, retrying, and cancelled states, retry counts, timestamps, item counters, error details, exponential backoff, and dead-letter handling.
- Keep unavailable providers clearly marked; do not add fake OAuth or pretend a sync occurred.
- Add `/app/sources/:sourceId` tabs for overview, documents, sync jobs, permissions, errors, and configuration.

**Acceptance:** a source can be represented and inspected safely, unavailable integrations show a useful setup state, and long-running work is modeled outside normal page requests.

### 4. Document, indexing, and retrieval substrate
- Enable PostgreSQL full-text search and pgvector through Lovable Cloud.
- Implement provider-neutral DocumentStore, ChunkStore, EmbeddingStore, EntityStore, PermissionStore, SearchProvider, LexicalSearch, and VectorSearch interfaces.
- Normalize source records, preserve ACL metadata, chunk documents, generate embeddings only through server-side Lovable AI or a configured provider, and persist indexing status.
- Build hybrid retrieval with lexical search, vector search, reciprocal-rank fusion, tenant/ACL filtering, and deterministic reranking boundaries.
- Add pagination and safe query validation for documents and search playground views.

**Acceptance:** indexed records and retrieval results are persisted, tenant and ACL filters are enforced before answer generation, and ranking/citation mapping tests pass.

### 5. Grounded ask workflow
- Implement `/app/ask` with query input, recent/suggested questions, source/date/workspace filters, streaming answer state, citations, confidence, source preview, and feedback controls.
- Add server-side LLMProvider and Reranker abstractions.
- Keep system instructions, user input, retrieved data, and application context separate; flag instruction-like retrieved content as untrusted data.
- Implement inspectable traces covering normalization, embedding, BM25, vector search, RRF, ACL filtering, reranking, entity expansion, context assembly, generation, citation verification, and evaluation.
- Expose the trace through an expandable “How this answer was produced” panel and `/app/traces`.

**Acceptance:** every generated answer is tied to stored source/chunk metadata, streaming and error states are visible, and prompt-injection, citation, permission, and feedback tests pass.

### 6. Evaluation, analytics, and operational controls
- Add evaluation datasets/runs and the six requested quality dimensions.
- Add failed-evaluation inspection and regression-test-ready run records.
- Add connector/indexing/retrieval/LLM/evaluation telemetry without raw sensitive content or secrets.
- Build `/app/overview`, `/app/analytics`, `/app/evaluations`, `/app/traces`, and notifications from persisted data, not invented live metrics.
- Add team/settings controls, rate limiting boundaries, secure error handling, and audit-log browsing.

**Acceptance:** quality degradation, connector failures, indexing failures, expired auth, and permission errors produce actionable notifications and traceable audit events.

### 7. Production verification
- Add unit and integration coverage for authentication, authorization, tenant isolation, ranking, ACL filtering, citation mapping, prompt injection handling, connector state transitions, evaluation calculations, and API validation.
- Exercise the primary flow end to end: connect source → sync → index → query → retrieve → generate → cite → evaluate.
- Verify loading, empty, error, unauthorized, mobile, accessibility, TypeScript, lint, build, caching, source-map, and monitoring behavior.
- Update README sections for Currently implemented, Partially implemented, Demo only, and Planned, matching actual code.

## Technical approach

```text
Public routes + /demo
          |
Authenticated shell + server-side authorization
          |
Workspace / source / document / job records
          |
Normalization -> chunks -> embeddings + FTS
          |
ACL filter -> lexical + vector -> RRF -> rerank
          |
Grounded stream -> citations -> trace -> evaluation
```

- Use TanStack Router file routes and TanStack Start server functions for app-internal operations.
- Use server routes only for external webhooks or fixed public HTTP contracts.
- Keep provider secrets, connector keys, embedding calls, retrieval policy, authorization, and prompts server-side.
- Reuse current components/data as adapters during migration; replace demo adapters with persisted implementations milestone by milestone.
- Do not add a connector, metric, OAuth flow, retrieval result, or AI answer unless its implementation and state are explicit.

## First implementation scope

Implement Milestone 1 only: route map, reusable application shell, responsive navigation, demo-mode truth labels, route metadata, and safe loading/empty/error/unauthorized states. No fake authentication, OAuth, database, sync, embeddings, retrieval, or LLM behavior will be introduced in this milestone.
