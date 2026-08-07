# Context Synthesizer

> An enterprise Retrieval-Augmented Generation (RAG) portfolio project demonstrating how knowledge from Slack, Jira, Google Drive, and Notion can be organized into a unified semantic layer for grounded AI applications.

## Live Demo

**Application**
https://enterprise-thread.vercel.app/

**GitHub Repository**
https://github.com/unnita1235-code/enterprise-thread

---

## Overview

Context Synthesizer is a frontend portfolio project that demonstrates the architecture behind an enterprise Retrieval-Augmented Generation (RAG) system.

Instead of focusing on building another chatbot interface, this project explores how enterprise knowledge from multiple business systems can be ingested, normalized, retrieved, and evaluated before being used by a Large Language Model.

The application visualizes a complete enterprise retrieval workflow, including data ingestion, hybrid retrieval, semantic search, reranking, entity relationships, evaluation metrics, and observability dashboards.

This repository is intended to showcase system design, architecture, and frontend implementation rather than a production-ready AI platform.

---

## Features

* Enterprise RAG architecture visualization
* Connector dashboard for Slack, Jira, Google Drive, and Notion
* Interactive retrieval pipeline
* Enterprise monitoring dashboard
* Retrieval evaluation metrics
* Semantic entity graph visualization
* Query workflow demonstration
* Responsive modern UI built with React and TypeScript

---

## Tech Stack

### Frontend

* React 19
* TypeScript
* TanStack Start
* TanStack Router
* Vite
* Tailwind CSS v4
* Radix UI
* Recharts
* Lucide React

### Architecture Demonstrated

* Retrieval-Augmented Generation (RAG)
* Hybrid Search (BM25 + Vector Search)
* Parent-Child Chunking
* Cross-Encoder Reranking
* Semantic Entity Graphs
* Retrieval Evaluation
* Enterprise Observability

These architectural concepts are demonstrated through the interface and documentation. They are **not yet implemented as live backend services** in this repository.

---

## Project Structure

```text
src/
├── components/
│   ├── Hero
│   ├── Dashboard
│   ├── Architecture
│   ├── Connectors
│   ├── QueryDemo
│   └── Footer
│
├── data/
│   └── Demo dataset
│
├── routes/
│
├── hooks/
│
└── lib/
```

---

## Running Locally

Clone the repository

```bash
git clone https://github.com/unnita1235-code/enterprise-thread.git
```

Navigate into the project

```bash
cd enterprise-thread
```

Install dependencies

```bash
npm install
```

or

```bash
bun install
```

Start the development server

```bash
npm run dev
```

or

```bash
bun run dev
```

---

## Current Status

This project is currently a **frontend architecture demonstration**.

The interface, dashboards, retrieval pipeline, and enterprise metrics are powered by demonstration data to illustrate how a production enterprise RAG platform could operate.

The following are **not currently implemented**:

* Live Slack API integration
* Live Jira API integration
* Live Google Drive synchronization
* Live Notion synchronization
* Vector database
* Embedding generation
* Backend retrieval engine
* Authentication
* Permission-aware retrieval
* Production LLM inference
* Automated evaluation pipeline

---

## Planned Improvements

Future work includes:

* Live connector synchronization
* Incremental document indexing
* Hybrid retrieval implementation
* Vector database integration
* Streaming responses
* Citation generation
* Role-based access control
* Enterprise authentication
* Backend API services
* Evaluation automation
* Production telemetry

---

## Why This Project Exists

Many AI portfolio projects demonstrate prompt engineering or chatbot interfaces.

This project focuses instead on the infrastructure required to build enterprise AI systems that retrieve reliable information from multiple disconnected knowledge sources before generating responses.

The emphasis is on architecture, retrieval workflows, and system design rather than presenting a finished production application.

---

## Disclaimer

This repository is a portfolio project.

The dashboard metrics, document counts, connector health, and retrieval statistics shown in the application are demonstration data intended to illustrate enterprise RAG concepts.

They should not be interpreted as measurements from a live production environment.

---

## Links

**Live Application**

https://enterprise-thread.vercel.app/

**GitHub Repository**

https://github.com/unnita1235-code/enterprise-thread

---

## License

MIT License
