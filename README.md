# FairwayIQ

Mobile-first golf round tracker, stat logger, and AI caddy. Built for personal use, with a clean REST API layer for downstream consumption by the future Flash Score app.

**Owner:** Steven McIntosh
**Status:** Planning (Phase 1 — Foundation not yet started)

---

## What it is

- **Round logging** — one-handed, sunlight-readable, no scrolling on the hole screen
- **Stats dashboard** — KPI row, handicap trajectory, 18-hole scorecard strip, best/worst hole, game radar, trend sparklines
- **AI caddy** — pre-hole advice grounded in your actual history (OpenAI)
- **GPS + maps** — live distance to pin via Google Maps
- **Flash Score API** — exposes `summary` and `fuel` endpoints for the downstream Flash Score app

See `BLUEPRINT.md` for the full product spec.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **UI:** MUI v6 + MUI X
- **Database / Auth:** Supabase (Postgres + Google OAuth)
- **AI:** OpenAI via Vercel AI SDK (default `gpt-4o`, configurable via `OPENAI_MODEL`)
- **Maps:** Google Maps JavaScript API
- **Hosting:** Vercel

---

## Project Documents

| File | Purpose |
|------|---------|
| `BLUEPRINT.md` | Immutable product spec — read first |
| `PROJECT.md` | Current project state, scope, phases |
| `ARCHITECTURE.md` | System design |
| `GOVERNANCE.md` | Rules and standards |
| `DEPLOYMENT.md` | Branching, release process, rollback |
| `DATA_MODEL.md` | Schema reference (full SQL in BLUEPRINT §3) |
| `INTEGRATIONS.md` | External systems and API contracts |
| `CHANGELOG.md` | Version history |
| `SETUP-CHECKLIST.md` | Setup progress tracker |
| `CLAUDE.md` | How Claude Code operates in this repo |

---

## Quick Start

```bash
git clone https://github.com/stevenmcintosh/FairwayIQ.git
cd FairwayIQ
cp .env.example .env.local
# fill in real values — see INTEGRATIONS.md for each key's purpose
npm install
npm run dev
```

Open <http://localhost:3000>.

---

## Environment Variables

All required variables are listed in `.env.example`. Summary:

- **Supabase:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Google:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- **AI:** `OPENAI_API_KEY` (optional `OPENAI_MODEL`, default `gpt-4o`)
- **Flash Score (outbound API shared secret):** `FLASH_SCORE_API_KEY`

Never commit `.env.local`. Same values also go into Vercel env vars per environment.

---

## Branching

```
dev → staging → main
```

- No direct push to `main`
- PRs required for `staging` and `main`
- See `DEPLOYMENT.md` for full release process

---

## Scripts

```bash
npm run dev           # local dev
npm run build         # production build
npm test              # unit + integration tests (Jest + RTL)
npx ts-node scripts/seed.ts         # insert seed data (data_source='seed')
npx ts-node scripts/reset-seed.ts   # delete seed data only (guards real data)
```

---

## Build Phases

1. **Foundation** — schema, auth, round logging, skip/pick-up, history, tests
2. **Stats** — dashboard, MUI X charts, per-hole drill-down, practice logging
3. **AI** — pre-hole, end-of-round, best/worst hole, drill, handicap projection
4. **GPS / Maps** — Google Maps integration, live distance to pin
5. **Flash Score API** — summary and fuel endpoints

Each phase has a validation gate — see `BLUEPRINT.md` §16.

---

## Principle

**Start with clarity, build with consistency.**
