# INTEGRATIONS.md — FairwayIQ

## 1. Overview

FairwayIQ integrates with four external systems and exposes one outbound API consumed by a future downstream app (Flash Score).

---

## 2. Services

| Service | Purpose | Direction |
|---------|---------|-----------|
| Supabase | Postgres database, Auth, RLS | Inbound (FairwayIQ → Supabase) |
| Google OAuth (via Supabase Auth) | User sign in (only auth method) | Inbound |
| Google Maps JavaScript API | Hole map, GPS, distance to pin | Client → Google |
| OpenAI API | AI caddy advice (default `gpt-4o`, configurable via `OPENAI_MODEL`) | Server → OpenAI |
| Flash Score (downstream app, future) | Reads FairwayIQ summary + fuel endpoints | Outbound — FairwayIQ **exposes** the API |

---

## 3. API Usage

### Supabase
- JS client on server and browser
- RLS enforced on all user-scoped tables
- Service role key used only by server routes (seed, Flash Score API handlers)

### Google Maps JavaScript API
- Loaded client-side with `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- Key must be domain-restricted in Google Cloud Console
- Used for: hole tee/pin markers, live GPS position, distance calculation

### OpenAI
- Server-side only (`/api/advice/*` routes)
- Default model: `gpt-4o` (override with `OPENAI_MODEL` env var)
- Provider swap: calls go through the Vercel AI SDK so switching back to Anthropic later is a one-line change
- Endpoints:
  - `POST /api/advice/hole` — pre-hole caddy advice
  - `POST /api/advice/round` — end-of-round observations
  - `POST /api/advice/hole-insight` — best/worst hole one-liner
  - `POST /api/advice/drill` — weekly practice drill
  - `POST /api/advice/projection` — handicap trajectory narrative
- Fallback: if <3 rounds exist for a hole, return a generic tip based on par and yardage. Never fabricate history.

### Flash Score Outbound API (exposed by FairwayIQ)
Authenticated via `x-api-key` header (value = `FLASH_SCORE_API_KEY`). Uses `data_source = 'real'` only.

- `GET /api/flash-score/golf/summary` — rounds played, handicap, scoring avg, last round, practice streak, weakness
- `GET /api/flash-score/golf/fuel` — integer 0–100 "fuel value" computed from recent activity (logic in `/lib/stats.ts`)

Fuel logic:

| Event | Change |
|-------|--------|
| Round played this week | +40 |
| Practice session this week | +30 |
| Score trend improving (last 5 rounds) | +20 |
| No round and no practice today | -15 |
| Floor | 0 |
| Ceiling | 100 |

---

## 4. Webhooks

- Incoming: none
- Outgoing: none
- Supabase database trigger creates a `user_profiles` row on first sign in (internal, not a webhook)

---

## 5. Failure Handling

- **Supabase down** — active round continues on cached `useActiveRound`; Save & Next retries with exponential backoff; user notified if retries exhausted
- **OpenAI error or timeout** — advice endpoints return 200 with a safe generic fallback string; never block the UI
- **Google Maps load failure** — hole logging still works; map block shows a graceful placeholder
- **Flash Score consumer** — 401 on bad/missing `x-api-key`; 5xx on upstream DB failure with retry guidance

---

## 6. Authentication

- **User auth** — Google OAuth via Supabase. Session cookie set by Supabase callback at `/auth/callback`. No password flow.
- **Operator auth** — Same session + `user_profiles.is_operator = true`, checked server-side on operator routes
- **OpenAI** — `OPENAI_API_KEY` server-side only
- **Flash Score API** — `x-api-key` header matched against `FLASH_SCORE_API_KEY` env var on every request
- **Google Maps** — Public key, domain-restricted in Google Cloud Console
- **Supabase service role** — Used only on server-side for Flash Score endpoints and seed scripts; never exposed to client

---

## 7. Secrets & Keys (Env Var Map)

| Variable | Used By | Scope |
|----------|---------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase client | Client + Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client | Client + Server |
| `SUPABASE_SERVICE_ROLE_KEY` | Seed, Flash Score API | Server only |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Map components | Client |
| `OPENAI_API_KEY` | `/api/advice/*` | Server only |
| `OPENAI_MODEL` | `/api/advice/*` | Server only (default `gpt-4o`) |
| `FLASH_SCORE_API_KEY` | `/api/flash-score/*` | Server only |
| `GOOGLE_CLIENT_ID` | Supabase Auth provider config | Server |
| `GOOGLE_CLIENT_SECRET` | Supabase Auth provider config | Server only |
