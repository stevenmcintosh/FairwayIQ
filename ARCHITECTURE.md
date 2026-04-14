# ARCHITECTURE.md — FairwayIQ

## 1. System Overview
FairwayIQ is a Next.js App Router application deployed on Vercel, backed by Supabase (Postgres + Auth + RLS). It serves a mobile-first PWA-style UI for on-course logging, a stats dashboard, and an AI caddy powered by OpenAI (via the Vercel AI SDK, provider-swappable). It also exposes an authenticated REST API (`/api/flash-score/*`) consumed by a separate downstream app called Flash Score.

---

## 2. Tech Stack
- Next.js (App Router)
- Vercel (hosting, preview/staging/production environments)
- Supabase (Postgres, Auth, RLS)
- MUI v6 + MUI X (charts)
- OpenAI via Vercel AI SDK (default `gpt-4o`, configurable via `OPENAI_MODEL`)
- Google Maps JavaScript API
- Google OAuth via Supabase Auth

---

## 3. Folder Structure

```
/app
  /api           Route handlers (rounds, holes, courses, stats, advice, flash-score)
  /auth          OAuth callback
  /round         Active round view
  /rounds        History
  /stats         Stats dashboard
  /courses       Operator-only course management
  /setup         New round setup
  /login         Google sign in
/components      UI components (round, stats, map, ui)
/lib             supabase, ai, gps, stats, handicap, auth, theme
/hooks           useGPS, useActiveRound
/types           TypeScript interfaces
/scripts         seed.ts, reset-seed.ts
/tests           unit, integration, e2e
```

See BLUEPRINT.md §2 for the full layout.

---

## 4. Data Flow

```
User (mobile) → Next.js App Router (RSC + client components)
             → /api route handlers
             → Supabase (Postgres + Auth + RLS) — source of truth
             ↘ OpenAI (via AI SDK) — AI advice (server side only)
             ↘ Google Maps JS (client side only)

Flash Score app → /api/flash-score/* (x-api-key auth) → Supabase (real data only)
```

- Round data is cached in `useActiveRound` at round start — no live API dependency during play
- Auto-save on every hole via Save & Next

---

## 5. Key Components

- Frontend: Mobile-first MUI screens; on-course logging UI with 48px tap targets; stats dashboard with MUI X charts
- Backend: Next.js route handlers, all DB access via `/lib/supabase.ts`
- Data layer: Supabase Postgres with RLS; `course_versions` for historical integrity
- Integrations: OpenAI (server only), Google Maps (client only), Google OAuth (via Supabase)

---

## 6. Data Layer Rules

- All DB access via `/lib/supabase.ts` (server and browser clients)
- No direct DB calls from UI components
- All secrets server-side only; `SUPABASE_SERVICE_ROLE_KEY` never leaves the server
- Row Level Security enforced on every table; users read/write only their own data
- Operator routes check `is_operator` server-side and 403 otherwise

---

## 7. Design Decisions

| Decision | Reason |
|----------|--------|
| Course versioning model | Protects historical round stats when a course is re-measured or redesigned |
| `data_source` on rounds | Lets seed data coexist with real data safely; reset script scoped to `'seed'` only |
| Round data cached in hook | Golf courses often have poor signal; app must work offline during play |
| MUI-only, no Tailwind | Governance standard + theme consistency |
| Single operator role | Personal app initially; course management restricted to Flash |
| OpenAI via Vercel AI SDK | Provider-agnostic surface — swap OpenAI ↔ Anthropic ↔ others with a one-line change; default `gpt-4o` |
| Google OAuth only | No password UX; secure from day one |

---

## 8. Scalability Considerations

- Expected growth: 1 user (Flash) → small number of invited users
- Multi-user from day one: user_id scoping and RLS already in place
- Multi-course from day one: course and course_version tables scale naturally
- Bottlenecks: OpenAI latency during pre-hole advice — mitigated by fallback on <3 rounds
- Vercel serverless cold starts on `/api/advice/*` — acceptable for current scale

---

## 9. Known Limitations

- GPS accuracy depends on device hardware — acceptable for yardage-to-pin approximations
- Rowany GPS coordinates are placeholders until captured manually
- Handicap index is a manual entry (no WHS integration)
- No wind/weather data beyond user-entered categorical value
