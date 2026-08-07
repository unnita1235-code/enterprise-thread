# Context Synthesizer — Build Plan

A single-page (one route) recruiter-facing site presenting an enterprise RAG/context pipeline as a serious infra product. Neutral palette + one teal accent, dark/light toggle, left-aligned dashboard content, no AI clichés.

## Design system (src/styles.css)

- Palette: neutral stone/zinc backgrounds, near-black foreground, single teal accent (`oklch(0.68 0.12 190)` light, brighter in dark). Muted borders, subtle surface elevation via 1px borders + very soft shadows — no gradients on hero, no glows.
- Typography: Inter (body) + JetBrains Mono (metrics/labels/code) via `<link>` in `__root.tsx`. Tight tracking on headings, uppercase mono micro-labels for section eyebrows and KPI captions.
- Radius: small (6–8px) for enterprise feel. Sharp card hierarchy with 1px `--border`.
- Tokens added: `--accent-teal`, `--accent-teal-foreground`, `--surface-1`, `--surface-2`, `--grid-line`, `--success`, `--warn`, `--danger`, plus mono font family token.
- Dark mode via `.dark` class on `<html>`; toggle persists to `localStorage`.

## Route structure

Single page at `/` with in-page section navigation (spec says single-page static app). Anchors: `#overview`, `#architecture`, `#dashboard`, `#query`, `#resume`. Sticky top nav with logo + section links + theme toggle + "View dashboard" CTA. Set proper `head()` on the index route (title, description, og:title/description, twitter card) and update `__root.tsx` to remove generic "Lovable App" defaults.

Single `<h1>` lives in the hero; every other section uses `<h2>`.

## Components (src/components/cs/)

- `Logo.tsx` — custom inline SVG mark (interlocking angular brackets forming a "C" node graph, teal accent stroke).
- `Nav.tsx` — sticky header, section links, `ThemeToggle`, CTA.
- `ThemeToggle.tsx` — sun/moon, updates `documentElement.classList`.
- `Hero.tsx` — left-aligned title + short subtitle + two CTAs (Dashboard, Architecture). No background gradient; thin grid line motif only.
- `ConnectorCards.tsx` — Slack / Jira / Google Drive / Notion cards with inline brand SVGs, status, last-sync, doc counts. Asymmetric layout (not 3-col symmetric).
- `WhyRagFails.tsx` — two-column compare: "Naive RAG" vs "Context Synthesizer" with concrete failure modes.
- `Pipeline.tsx` — horizontal stepper (Ingest → Normalize → Chunk (parent/child) → Hybrid Retrieve → Rerank → Graph → Synthesize → Evaluate) with connecting arrows drawn in SVG.
- `Dashboard.tsx` — composes the widgets below.
- `KpiCard.tsx` — label (mono uppercase), big number, delta, sparkline.
- `IngestionTable.tsx` — per-source rows: docs, freshness, error rate, last sync, status badge.
- `RetrievalViz.tsx` — SVG showing query → BM25 + vector → fusion → rerank → top-k, with counts per stage.
- `TracesPanel.tsx` — list of recent traces (query, latency, stages, scores, status).
- `FailedQueries.tsx` — table of failed retrievals with root cause tag.
- `EvalTrends.tsx` — line chart (Recharts) for precision / faithfulness / context recall over 14 days.
- `SourceCoverage.tsx` — stacked bar or donut of citation source mix.
- `EntityGraph.tsx` — small SVG force-graph preview (static positions) of entities (Project Atlas, mobile-auth, rate-limits, teams).
- `StatusBadges.tsx` — system status pills.
- `QueryDemo.tsx` — input + chip list of the 3 example queries; on select, animates in retrieved context cards from mixed sources, then synthesized answer with numbered citations and eval scores sidebar. All local state, no network.
- `Architecture.tsx` — step-by-step diagram (cards + SVG arrows) covering the 8 layers listed in the spec.
- `ResumeValue.tsx` — left-aligned prose + skills-demonstrated bullet grid.
- `TechBadges.tsx` — small mono pill row for FastAPI, Postgres/pgvector, Qdrant, Ragas, Arize Phoenix, Slack/Jira/Drive/Notion APIs, Hybrid Search, Knowledge Graph.
- `Footer.tsx` — minimal, left-aligned.

## Demo data (src/data/)

Typed TS modules with realistic-looking (clearly demo) fixtures matching the spec's schema: `source_type`, `source_id`, `parent_document_id`, `chunk_id`, `title`, `content_summary`, `authors`, `teams`, `entities`, `projects`, `created_at`, `updated_at`, `permission_tags`, `freshness_score`, `trust_score`, `retrieval_score`, `rerank_score`. Files: `connectors.ts`, `kpis.ts`, `trends.ts`, `traces.ts`, `failedQueries.ts`, `entities.ts`, `queries.ts` (3 example Q&A with retrieved chunks + citations + eval scores).

## Charts

Use existing `recharts` (already in shadcn `chart.tsx`). Line charts for trends, tiny inline sparkline SVGs for KPI cards, stacked bar for source contribution. All themed via CSS variables.

## Motion

Only subtle: fade/translate on section enter via `IntersectionObserver` + CSS transitions. No parallax, no glow, no bouncing.

## Accessibility & responsiveness

- Semantic `<header> <nav> <main> <section> <article> <table> <footer>`.
- Focus rings via `--ring`, keyboard-operable tabs/toggles.
- Grid + `min-w-0` / `shrink-0` for header rows (per responsive rules).
- Mobile: nav collapses to a Sheet; dashboard tables become horizontally scrollable within a bordered container.

## Files to create / modify

- Modify: `src/routes/__root.tsx` (real head metadata, load fonts via `<link>`, add `<html class>` theme init script), `src/routes/index.tsx` (replace placeholder, compose sections, set head), `src/styles.css` (tokens, fonts registered in `@theme`).
- Create: `src/components/cs/*` (components above), `src/data/*` (fixtures), `src/lib/theme.ts` (theme toggle helper), `src/lib/format.ts` (number/percent/date formatters).

## Out of scope

No backend, no auth, no real API calls, no Lovable Cloud. Everything runs from static fixtures.
