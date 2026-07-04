export type SourceType = "slack" | "jira" | "drive" | "notion";

export const connectors: {
  id: SourceType;
  name: string;
  status: "healthy" | "degraded" | "syncing";
  docs: number;
  lastSync: string;
  throughput: string;
  scope: string;
}[] = [
  {
    id: "slack",
    name: "Slack",
    status: "healthy",
    docs: 148213,
    lastSync: "42s ago",
    throughput: "1.2k msg/min",
    scope: "23 channels · 4 workspaces",
  },
  {
    id: "jira",
    name: "Jira",
    status: "healthy",
    docs: 24817,
    lastSync: "1m ago",
    throughput: "180 issues/min",
    scope: "9 projects · 6 boards",
  },
  {
    id: "drive",
    name: "Google Drive",
    status: "syncing",
    docs: 62194,
    lastSync: "3m ago",
    throughput: "420 files/min",
    scope: "17 shared drives",
  },
  {
    id: "notion",
    name: "Notion",
    status: "degraded",
    docs: 9382,
    lastSync: "12m ago",
    throughput: "60 pages/min",
    scope: "5 teamspaces",
  },
];

export const kpis = [
  {
    label: "Retrieval precision",
    value: "0.912",
    delta: "+1.4%",
    trend: [0.86, 0.87, 0.88, 0.87, 0.89, 0.9, 0.9, 0.91, 0.9, 0.91, 0.912],
    positive: true,
  },
  {
    label: "Faithfulness",
    value: "0.947",
    delta: "+0.6%",
    trend: [0.92, 0.93, 0.93, 0.94, 0.93, 0.94, 0.94, 0.95, 0.94, 0.95, 0.947],
    positive: true,
  },
  {
    label: "Context recall",
    value: "0.881",
    delta: "-0.3%",
    trend: [0.9, 0.89, 0.89, 0.88, 0.89, 0.88, 0.88, 0.87, 0.88, 0.88, 0.881],
    positive: false,
  },
  {
    label: "Answer groundedness",
    value: "0.934",
    delta: "+0.9%",
    trend: [0.9, 0.9, 0.91, 0.91, 0.92, 0.92, 0.92, 0.93, 0.93, 0.93, 0.934],
    positive: true,
  },
  {
    label: "Ingestion freshness",
    value: "94s",
    delta: "-12s",
    trend: [140, 132, 128, 120, 118, 112, 108, 104, 100, 98, 94],
    positive: true,
  },
];

export const evalTrends = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  precision: +(0.86 + Math.sin(i / 2) * 0.02 + i * 0.003).toFixed(3),
  faithfulness: +(0.92 + Math.cos(i / 3) * 0.01 + i * 0.002).toFixed(3),
  recall: +(0.87 + Math.sin(i / 4) * 0.015 + i * 0.001).toFixed(3),
}));

export const sourceContribution = [
  { name: "D-6", slack: 32, jira: 22, drive: 28, notion: 18 },
  { name: "D-5", slack: 30, jira: 25, drive: 27, notion: 18 },
  { name: "D-4", slack: 34, jira: 21, drive: 26, notion: 19 },
  { name: "D-3", slack: 33, jira: 24, drive: 25, notion: 18 },
  { name: "D-2", slack: 35, jira: 23, drive: 24, notion: 18 },
  { name: "D-1", slack: 36, jira: 22, drive: 25, notion: 17 },
  { name: "Today", slack: 38, jira: 24, drive: 22, notion: 16 },
];

export const ingestionRows = [
  {
    source: "slack",
    docs: 148213,
    freshness: 0.98,
    errorRate: 0.002,
    lastSync: "42s",
    status: "healthy",
  },
  {
    source: "jira",
    docs: 24817,
    freshness: 0.96,
    errorRate: 0.004,
    lastSync: "1m",
    status: "healthy",
  },
  {
    source: "drive",
    docs: 62194,
    freshness: 0.91,
    errorRate: 0.011,
    lastSync: "3m",
    status: "syncing",
  },
  {
    source: "notion",
    docs: 9382,
    freshness: 0.78,
    errorRate: 0.032,
    lastSync: "12m",
    status: "degraded",
  },
] as const;

export const traces = [
  {
    id: "trc_9f2a",
    query: "What changed in Project Atlas over the last 3 sprints?",
    latency: 842,
    stages: ["bm25", "vector", "rrf", "rerank", "graph", "synthesize"],
    faithfulness: 0.96,
    citations: 7,
    status: "ok",
  },
  {
    id: "trc_9f19",
    query: "Owner of the payments idempotency-key spec?",
    latency: 611,
    stages: ["bm25", "vector", "rrf", "rerank", "synthesize"],
    faithfulness: 0.98,
    citations: 3,
    status: "ok",
  },
  {
    id: "trc_9f0c",
    query: "Open blockers on mobile auth this week",
    latency: 1204,
    stages: ["bm25", "vector", "rrf", "rerank", "graph", "synthesize"],
    faithfulness: 0.93,
    citations: 9,
    status: "ok",
  },
  {
    id: "trc_9ef7",
    query: "Q3 SLA breach postmortem — root cause",
    latency: 1583,
    stages: ["bm25", "vector", "rrf", "rerank"],
    faithfulness: 0.71,
    citations: 2,
    status: "low_faithfulness",
  },
  {
    id: "trc_9ee1",
    query: "Latest rate limit values for /v2/search",
    latency: 498,
    stages: ["bm25", "vector", "rrf", "synthesize"],
    faithfulness: 0.99,
    citations: 4,
    status: "ok",
  },
];

export const failedQueries = [
  {
    id: "fq_412",
    query: "What did legal decide about the EU data residency clause?",
    reason: "permission_filtered",
    detail: "3 candidate chunks excluded by ACL (legal-internal)",
  },
  {
    id: "fq_411",
    query: "Design review notes for onboarding v4",
    reason: "stale_index",
    detail: "Notion partition last synced 42m ago (SLA: 5m)",
  },
  {
    id: "fq_408",
    query: "Which vendor was picked for the observability RFP?",
    reason: "no_high_confidence_source",
    detail: "Top rerank score 0.41 (threshold 0.55)",
  },
];

export const entities = [
  { id: "atlas", label: "Project Atlas", type: "project", weight: 42 },
  { id: "mobile-auth", label: "mobile-auth", type: "workstream", weight: 31 },
  { id: "rate-limits", label: "API rate limits", type: "topic", weight: 27 },
  { id: "payments", label: "Payments", type: "team", weight: 24 },
  { id: "sla-q3", label: "Q3 SLA breach", type: "incident", weight: 19 },
  { id: "eu-residency", label: "EU data residency", type: "policy", weight: 17 },
];

export const graphNodes = [
  { id: "atlas", x: 180, y: 90, label: "Project Atlas", kind: "project" },
  { id: "mobile", x: 80, y: 170, label: "mobile-auth", kind: "workstream" },
  { id: "payments", x: 300, y: 60, label: "Payments", kind: "team" },
  { id: "rate", x: 320, y: 180, label: "Rate limits", kind: "topic" },
  { id: "sla", x: 200, y: 220, label: "Q3 SLA", kind: "incident" },
  { id: "eu", x: 60, y: 60, label: "EU residency", kind: "policy" },
];
export const graphEdges = [
  ["atlas", "mobile"],
  ["atlas", "payments"],
  ["atlas", "rate"],
  ["mobile", "sla"],
  ["payments", "rate"],
  ["atlas", "eu"],
  ["rate", "sla"],
];

export type DemoQuery = {
  id: string;
  question: string;
  answer: string;
  citations: {
    n: number;
    source: SourceType;
    title: string;
    snippet: string;
    meta: string;
    retrieval: number;
    rerank: number;
    trust: number;
    freshness: number;
  }[];
  scores: { label: string; value: number }[];
};

export const demoQueries: DemoQuery[] = [
  {
    id: "atlas",
    question: "What changed in Project Atlas over the last 3 sprints?",
    answer:
      "Across sprints 41–43, Project Atlas shifted from a monolithic ingestion worker to a partitioned queue-per-source model [1], introduced parent-child chunking for long Drive documents [2], and adopted RRF fusion with a cross-encoder reranker [3]. The mobile-auth workstream was descoped to sprint 44 after the Q3 SLA postmortem [4]. Retrieval precision improved from 0.87 to 0.91 as a result.",
    citations: [
      {
        n: 1,
        source: "jira",
        title: "ATLAS-812 · Partition ingestion by source",
        snippet:
          "Split the monolithic worker into per-source queues. Backpressure isolated; Notion no longer starves Slack.",
        meta: "closed · sprint 41 · @m.ito",
        retrieval: 0.82,
        rerank: 0.91,
        trust: 0.94,
        freshness: 0.97,
      },
      {
        n: 2,
        source: "notion",
        title: "RFC-019 · Parent-child chunking",
        snippet:
          "Long Drive docs are chunked at heading boundaries; parent doc summary is co-retrieved for context reconstruction.",
        meta: "approved · sprint 42 · @s.chen",
        retrieval: 0.78,
        rerank: 0.88,
        trust: 0.92,
        freshness: 0.9,
      },
      {
        n: 3,
        source: "drive",
        title: "retrieval-eval-sprint43.pdf",
        snippet:
          "RRF(k=60) over BM25 + bge-large; cross-encoder rerank on top-40 → top-8. Precision@8 = 0.912.",
        meta: "shared · sprint 43 · platform-search",
        retrieval: 0.86,
        rerank: 0.93,
        trust: 0.9,
        freshness: 0.88,
      },
      {
        n: 4,
        source: "slack",
        title: "#atlas-standup · mobile-auth descope",
        snippet:
          "Given the Q3 SLA postmortem, moving mobile-auth to sprint 44. Payments team owns the auth-refresh spike.",
        meta: "thread · 6 replies · @j.kim",
        retrieval: 0.75,
        rerank: 0.85,
        trust: 0.88,
        freshness: 0.99,
      },
    ],
    scores: [
      { label: "Faithfulness", value: 0.96 },
      { label: "Groundedness", value: 0.94 },
      { label: "Context recall", value: 0.91 },
      { label: "Answer relevance", value: 0.95 },
    ],
  },
  {
    id: "rate-limits",
    question: "Which document contains the final API rate limit decision?",
    answer:
      "The final decision lives in RFC-024 in Notion [1], superseding the earlier Drive draft [2]. The values (600 rpm burst, 120 rpm sustained per key) are mirrored in the Jira acceptance criteria for ATLAS-901 [3].",
    citations: [
      {
        n: 1,
        source: "notion",
        title: "RFC-024 · /v2/search rate limits (final)",
        snippet:
          "Accepted values: 600 rpm burst, 120 rpm sustained per API key. Enforcement at edge; 429 with Retry-After.",
        meta: "status: accepted · @a.patel",
        retrieval: 0.91,
        rerank: 0.97,
        trust: 0.96,
        freshness: 0.94,
      },
      {
        n: 2,
        source: "drive",
        title: "rate-limits-draft-v2.gdoc",
        snippet:
          "Superseded — see RFC-024. Original draft proposed 300/60 which was rejected in review.",
        meta: "superseded · api-platform",
        retrieval: 0.72,
        rerank: 0.78,
        trust: 0.7,
        freshness: 0.82,
      },
      {
        n: 3,
        source: "jira",
        title: "ATLAS-901 · Enforce /v2/search rate limits",
        snippet: "AC: enforce 600 burst / 120 sustained per key at edge; expose headers.",
        meta: "in progress · sprint 43",
        retrieval: 0.83,
        rerank: 0.9,
        trust: 0.92,
        freshness: 0.96,
      },
    ],
    scores: [
      { label: "Faithfulness", value: 0.98 },
      { label: "Groundedness", value: 0.97 },
      { label: "Context recall", value: 0.94 },
      { label: "Answer relevance", value: 0.96 },
    ],
  },
  {
    id: "blockers",
    question: "Summarize open blockers mentioned in Slack and Jira for mobile auth.",
    answer:
      "Two blockers are open. Refresh-token rotation is stalled awaiting a security review of the new JWKS endpoint [1][2]. iOS biometric fallback fails on devices without Secure Enclave, tracked as ATLAS-877 with a repro from field testing [3]. Payments team owns the spike; ETA end of sprint 44.",
    citations: [
      {
        n: 1,
        source: "slack",
        title: "#mobile-auth · refresh rotation review",
        snippet:
          "Security review still pending. @security-oncall — can we get a slot this week? Blocking ATLAS-874.",
        meta: "yesterday · @r.singh",
        retrieval: 0.84,
        rerank: 0.91,
        trust: 0.9,
        freshness: 0.99,
      },
      {
        n: 2,
        source: "jira",
        title: "ATLAS-874 · JWKS endpoint security review",
        snippet:
          "Blocked — awaiting security sign-off. Draft threat model attached; no findings from platform review.",
        meta: "blocked · sprint 43",
        retrieval: 0.88,
        rerank: 0.93,
        trust: 0.94,
        freshness: 0.95,
      },
      {
        n: 3,
        source: "jira",
        title: "ATLAS-877 · Biometric fallback failure",
        snippet:
          "Repro on iPhone 8 (no Secure Enclave). Fallback path throws in KeychainService. Field logs attached.",
        meta: "open · sprint 43",
        retrieval: 0.81,
        rerank: 0.89,
        trust: 0.92,
        freshness: 0.97,
      },
    ],
    scores: [
      { label: "Faithfulness", value: 0.94 },
      { label: "Groundedness", value: 0.93 },
      { label: "Context recall", value: 0.9 },
      { label: "Answer relevance", value: 0.95 },
    ],
  },
];

export const techBadges = [
  "FastAPI",
  "Postgres · pgvector",
  "Qdrant",
  "Ragas",
  "Arize Phoenix",
  "Slack API",
  "Jira API",
  "Google Drive API",
  "Notion API",
  "Hybrid Search",
  "Knowledge Graph",
];
