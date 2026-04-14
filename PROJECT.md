# PROJECT.md — FairwayIQ

## 0. Quick Summary
- Mobile-first golf round tracker, stat logger, and AI caddy with a clean API layer for downstream consumption.
- Built for personal use by Steven McIntosh (Flash). Scalable to multiple courses and users from day one.
- Current status: Planning — Phase 1 (Foundation) not yet started.

---

## 1. Overview
- Project Name: FairwayIQ
- Owner: Steven McIntosh (Flash)
- Status: Planning
- Last Updated: 2026-04-13

---

## 2. Business Purpose
- Problem this solves: No existing golf app combines fast, mobile-first on-course logging with a deep stats dashboard and an AI caddy tuned to the player's own history.
- Why it matters: Personal improvement tool for the owner, and feeds the future Flash Score app (rocket fuel mechanic) via a clean REST API.
- Expected outcome: Trustworthy single-figure handicap trajectory, evidence-based practice focus, and a reusable data source for Flash Score.

---

## 3. Users
- Primary users: Steven McIntosh (Flash) — single player, multi-course
- Secondary users: Future additional golfers (architecture is multi-user from day one)
- Operator role: Flash only — manages courses and course versions
- Key needs: One-handed on-course logging, sunlight-readable UI, meaningful stats after just a few rounds, AI advice grounded in personal history

---

## 4. Scope

### V1 (MVP — Phase 1 Foundation)
- Supabase schema + RLS
- Google OAuth sign in
- Round setup, hole-by-hole logging, skip/pick-up, end-of-round screen, round history
- Seed + reset scripts for Rowany
- Unit + integration tests for stats, round flow, skip, pick-up

### Out of Scope (V1)
- Social features, leaderboards, sharing
- Apple Watch / wearable companion
- Automatic shot tracking / sensors
- Flash Score app itself (built later; FairwayIQ exposes the API)

### Future Phases
- Phase 2 — Stats dashboard (KPIs, scorecard strip, radar, per-hole drill-down, practice logging)
- Phase 3 — AI advice system (pre-hole, end-of-round, best/worst hole, drill, handicap projection)
- Phase 4 — GPS + Google Maps live distances
- Phase 5 — Flash Score external API

---

## 5. Success Criteria
- KPIs:
  - A full 18-hole round can be logged one-handed on course with zero scrolls on the logging screen
  - Stats dashboard is meaningful after 3 real rounds
  - Handicap trajectory projection visible and accurate
- Operational outcomes: No lost round data; auto-save on every hole
- Definition of success: Flash uses the app exclusively for live rounds and trusts the numbers

---

## 6. Tech Stack
- Frontend: Next.js (App Router)
- Backend: Next.js API Routes on Vercel
- Database: Supabase (Postgres) with Row Level Security
- Hosting: Vercel
- UI Framework: MUI v6 + MUI X (charts, data grids)
- Integrations: Google OAuth (via Supabase), Google Maps JavaScript API, OpenAI via Vercel AI SDK (default `gpt-4o`)

---

## 7. Environments
- Dev: local + Vercel preview deployments from `dev` branch
- Staging: Vercel staging environment from `staging` branch
- Production: Vercel production from `main` branch

---

## 8. Deployment Rules
- Branch flow: `dev` → `staging` → `main`
- PR rules: No direct push to `main` or `staging`. All changes via PR.
- Release process: Develop on `dev` → PR to `staging` → validate → PR to `main` → auto-deploy

---

## 9. Data Summary
- Key entities: `courses`, `course_versions`, `holes`, `rounds`, `hole_scores`, `practice_sessions`, `user_profiles`
- Source of truth: Supabase Postgres. See `DATA_MODEL.md` for full schema.
- Critical rule: `rounds.data_source` (`'real'` | `'seed'`) is the single dividing line between real and test data. Reset scripts never touch `'real'` rows.

---

## 10. Core Flows
- Round setup → active round (pre-hole + hole logging, with skip / pick-up) → end-of-round → history
- Operator course/version management (Flash only, hidden from regular users)
- Stats dashboard with Last 20 / All Time filter
- AI advice: per-hole, end-of-round, best/worst hole, drill assignment, handicap projection
- Flash Score outbound API: summary + fuel endpoints

---

## 11. Risks & Constraints
- Known risks:
  - GPS reliability on remote courses (Rowany, Isle of Man)
  - OpenAI API errors during live round — must degrade gracefully
  - Historical data integrity if a course is re-measured → addressed via immutable `course_version_id` on every round
- Dependencies: Supabase, Vercel, Google Cloud (OAuth + Maps), OpenAI
- Constraints: Mobile-first zero-tolerance rules (see BLUEPRINT §13)

---

## 12. Ownership
| Area | Owner |
|------|-------|
| Frontend | Steven McIntosh |
| Backend | Steven McIntosh |
| Data | Steven McIntosh |
| DevOps | Steven McIntosh |

---

## 13. Open Decisions
- Rowany GPS coordinates — placeholders until Flash captures real values from satellite view
- Flash `is_operator = true` to be set manually in Supabase after first Google sign in
- `FLASH_SCORE_API_KEY` to be generated when Flash Score app build begins

---

## 14. Change Log Summary
- See `CHANGELOG.md`.
