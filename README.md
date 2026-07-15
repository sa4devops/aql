# عقل / AQL — Trial UI

> **Status**: Frontend Trial — Mock Data Only — No Production Backend

This is a frontend-only trial UI for the **عقل (AQL)** enterprise knowledge management platform. It is built with Next.js 15, TypeScript, and Tailwind CSS. All data is local Mock Data. There is no backend, no database, and no external SaaS services.

## Purpose

This repository contains the trial UI for stakeholder review and UX validation. It is **not** a production deployment.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.x |
| Icons | Lucide React |
| Canvas | React Flow (reactflow) |
| Tables | TanStack Table + Virtual |
| State | Zustand |
| Validation | Zod |
| Charts | Recharts |
| Data | Local Mock Data only |

## Screens

| Route | Screen |
|-------|--------|
| `/` | Dashboard / Home |
| `/enterprise-data-table-record-list` | Record List |
| `/record-type-builder` | Record Type Builder |
| `/workflow-canvas-builder` | Workflow Builder |
| `/action-registry` | Action Registry |
| `/action-registry/[id]` | Action Detail |
| `/ui-showcase-design-playground` | UI Showcase |

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:4028](http://localhost:4028)

## Environment

Copy `.env.example` to `.env` and set `NEXT_PUBLIC_SITE_URL` if needed. No other variables are required.

## Constraints

- **No backend**: All data is Mock Data in `src/mocks/`
- **No external runtime requests**: All fonts, icons, and assets are local
- **No Supabase / OpenAI / Stripe / Analytics**: These are not used
- **Trial only**: Do not merge to main without Product Owner sign-off

## Branch Policy

All changes go to `rocket-update` branch only. Do not push to `main`, do not create Releases or Tags without explicit approval.