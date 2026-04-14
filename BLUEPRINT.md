# FairwayIQ - Project Blueprint
**Version:** 2.0 (Final)
**Owner:** Steven McIntosh (Flash)
**App Name:** FairwayIQ
**Purpose:** Mobile-first golf round tracker, stat logger, and AI caddy. Built for personal use with a clean API layer for downstream consumption by Flash Score app. Scalable to multiple courses and multiple users from day one architecture.
**Downstream:** REST API consumed by Flash Score (separate app, built later).

---

## 1. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js (App Router) | Flash's standard stack, Vercel deployment |
| UI Library | Material UI (MUI) v6 + MUI X | Component library, data grids, charts, mobile-optimised |
| Styling | MUI `sx` prop + theme tokens | Consistent with MUI ecosystem, no Tailwind |
| Database | Supabase (Postgres) | Managed Postgres, clean JS SDK, built-in auth |
| Auth | Supabase Auth - Google OAuth | One-click sign in, no passwords, secure from day one |
| Maps | Google Maps JavaScript API | GPS position, custom markers, distance calculation |
| AI | OpenAI via Vercel AI SDK (default `gpt-4o`, configurable) | Hole advice and practice recommendations; provider-swappable |
| Hosting | Vercel | Flash's standard, auto-deploys from GitHub |
| Env Management | `.env.local` + Vercel env vars | Standard Next.js pattern |

---

## 2. Project Structure

```
/fairwayiq
  /app
    /api
      /rounds                   - Round CRUD endpoints
      /holes                    - Hole score endpoints
      /courses                  - Course, version, and hole data endpoints
      /stats                    - Aggregated stats endpoints
      /advice                   - AI advice endpoint (calls OpenAI via AI SDK)
      /flash-score              - External API endpoints for Flash Score app
    /auth
      /callback                 - Google OAuth callback handler
    /round
      /[id]                     - Active round view (mobile during play)
    /rounds                     - Round history list
    /stats                      - Stats dashboard (priority screen)
    /courses                    - Course management (operator only)
    /setup                      - New round setup
    /login                      - Google sign in screen
    page.tsx                    - Home / dashboard
    layout.tsx
  /components
    /round
      HoleCard.tsx              - Active hole logging UI
      HolePreview.tsx           - Pre-hole summary and AI advice
      ScorecardSummary.tsx      - End of round summary
      RoundSetup.tsx            - Course, tee, and hole count selection
    /stats
      HoleScorecardStrip.tsx    - 18-hole visual colour band strip
      RadarChart.tsx            - 5-dimension game radar (MUI X)
      BestWorstHoleCards.tsx    - Best and worst hole with AI insight
      TrendSparklines.tsx       - Score, GIR, putts trend lines
      HandicapTrajectory.tsx    - Handicap trend and projection
      StatOverviewCards.tsx     - KPI summary row
      StatsFilterBar.tsx        - Last 20 rounds / All Time toggle
    /map
      HoleMap.tsx               - Google Maps hole view with GPS
      DistanceMarker.tsx
    /ui
      SkipHoleDialog.tsx        - Confirm skip with partial round warning
      PickUpDialog.tsx          - Log partial hole data on pick up
      DevModeBanner.tsx         - Visible banner when seed data is included
  /lib
    supabase.ts                 - Supabase client (server + browser)
    ai.ts                       - AI client (Vercel AI SDK + OpenAI provider) and prompt templates
    gps.ts                      - GPS distance and bearing utilities
    stats.ts                    - Stat aggregation and fuel value logic
    handicap.ts                 - Handicap projection utilities
    auth.ts                     - Auth helpers and isOperator check
    theme.ts                    - MUI custom theme (single source of truth)
  /types
    index.ts                    - All TypeScript interfaces
  /hooks
    useGPS.ts                   - Real-time GPS hook
    useActiveRound.ts           - Active round state management
  /scripts
    seed.ts                     - Seed script: inserts test rounds and hole scores
    reset-seed.ts               - Reset script: deletes all seed data safely
  /tests
    /unit
      stats.test.ts             - Stat aggregation functions
      handicap.test.ts          - Handicap projection logic
      gps.test.ts               - GPS distance calculation
      fuel.test.ts              - Flash Score fuel value logic
    /integration
      round-flow.test.ts        - Full round: setup → hole logging → completion
      skip-hole.test.ts         - Skip and partial round behaviour
      pickup-hole.test.ts       - Pick up hole behaviour
      course-version.test.ts    - Version management and historical round integrity
      auth.test.ts              - Google OAuth flow and RLS enforcement
    /e2e
      round-mobile.test.ts      - Simulated mobile round: all 18 holes logged
      stats-dashboard.test.ts   - Stats render correctly after seeded rounds
      ai-advice.test.ts         - AI advice endpoint returns valid response
  PROJECT.md                    - This file (always read first)
```

---

## 3. Database Schema

### `courses`
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
name              text NOT NULL               -- "Rowany Golf Club"
location          text                        -- "Isle of Man"
country           text
active_version_id uuid                        -- FK to course_versions (set after insert)
created_at        timestamptz DEFAULT now()
```

### `course_versions`
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
course_id         uuid REFERENCES courses(id)
version_number    integer NOT NULL            -- 1, 2, 3...
label             text                        -- "Original Layout" | "2026 Redesign"
effective_from    date NOT NULL
notes             text                        -- reason for version change
nine_hole_config  jsonb                       -- e.g. [1,2,3,4,5,6,7,8,9]
created_by        uuid REFERENCES auth.users(id)
created_at        timestamptz DEFAULT now()
```

### `holes`
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
course_version_id uuid REFERENCES course_versions(id)
hole_number       integer NOT NULL            -- 1-18
name              text                        -- optional hole name
par_white         integer NOT NULL
par_yellow        integer NOT NULL
par_red           integer NOT NULL
stroke_index      integer NOT NULL            -- 1-18
yardage_white     integer
yardage_yellow    integer
yardage_red       integer
gps_tee_white     jsonb                       -- { lat: float, lng: float }
gps_tee_yellow    jsonb
gps_tee_red       jsonb
gps_green         jsonb                       -- centre of green
notes             text
created_at        timestamptz DEFAULT now()
```

### `rounds`
```sql
id                  uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id             uuid REFERENCES auth.users(id)
course_id           uuid REFERENCES courses(id)
course_version_id   uuid REFERENCES course_versions(id)
played_at           date NOT NULL
tee_colour          text NOT NULL               -- 'white' | 'yellow' | 'red'
hole_count          integer NOT NULL            -- 9 or 18
status              text DEFAULT 'active'       -- 'active' | 'complete' | 'partial'
data_source         text DEFAULT 'real'         -- 'real' | 'seed' (see Section 10)
total_strokes       integer
total_par           integer
score_vs_par        integer
stableford_points   integer
weather             text                        -- 'sunny' | 'windy' | 'wet' | 'overcast'
notes               text
created_at          timestamptz DEFAULT now()
```

### `hole_scores`
```sql
id                  uuid PRIMARY KEY DEFAULT gen_random_uuid()
round_id            uuid REFERENCES rounds(id)
hole_id             uuid REFERENCES holes(id)
hole_number         integer NOT NULL
strokes             integer                     -- null if skipped
putts               integer
fairway_direction   text                        -- 'left' | 'centre' | 'right' | null (par 3)
green_in_reg        boolean
penalties           integer DEFAULT 0
penalty_type        text                        -- 'ob' | 'water' | 'unplayable' | null
chip_ins            integer DEFAULT 0
sand_save           boolean
hole_status         text DEFAULT 'complete'     -- 'complete' | 'skipped' | 'picked_up'
notes               text
created_at          timestamptz DEFAULT now()
```

### `practice_sessions`
```sql
id                  uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id             uuid REFERENCES auth.users(id)
session_date        date NOT NULL
duration_mins       integer DEFAULT 30
focus_area          text                        -- 'putting' | 'chipping' | 'driving' | 'approach' | 'bunker'
drill_assigned      text
drill_completed     boolean DEFAULT false
notes               text
created_at          timestamptz DEFAULT now()
```

### `user_profiles`
```sql
id                  uuid PRIMARY KEY REFERENCES auth.users(id)
display_name        text
handicap_index      decimal(4,1)               -- manually updated, e.g. 11.2
home_course_id      uuid REFERENCES courses(id)
is_operator         boolean DEFAULT false
created_at          timestamptz DEFAULT now()
```

---

## 4. Authentication

- Google OAuth via Supabase Auth - configured from day one, no placeholder auth
- "Sign in with Google" is the only login method - no username/password
- On first sign in, a `user_profiles` row is created automatically via Supabase database trigger
- `is_operator` defaults to `false` - Flash's account set to `true` manually in Supabase after first sign in
- All data RLS-protected: users read and write their own data only
- Operator-only routes (course management, version creation) check `is_operator` server-side and return 403 otherwise

### Auth Flow
1. User hits `/` - middleware checks session, redirects to `/login` if none
2. `/login` - single "Sign in with Google" button
3. Supabase handles OAuth, redirects to `/auth/callback`
4. Callback exchanges code for session cookie, redirects to `/`
5. Session persists across visits - user stays signed in

---

## 5. Course and Version Management

### For users
Users never see version numbers. Round setup presents: course name → tee colour → 9 or 18 holes. App silently uses `courses.active_version_id` to load correct hole data.

### For operator (Flash only)
- Accessible at `/courses` (403 for non-operators)
- Create new version: label, effective date, reason for change, re-enter hole data
- "Set as Active" promotes version to `courses.active_version_id`
- All future rounds use the new version automatically
- Historical rounds retain their `course_version_id` - scorecards and stats remain accurate forever
- Operator can view all versions and their effective dates

### 9-hole configuration
Defined once per course version by operator. Stored as `nine_hole_config` array (e.g. `[1,2,3,4,5,6,7,8,9]`) in `course_versions`. When a user selects 9 holes the app loads exactly those holes in that order.

### Adding a new course
Operator creates course → creates version 1 → enters all hole data. Course immediately available to users for round setup.

---

## 6. Round Flow

### 6.1 Round Setup (`/setup`)
1. Select course - dropdown, defaults to home course from `user_profiles`
2. Select tee colour - White / Yellow / Red - large MUI toggle buttons
3. Select 9 or 18 holes - large MUI toggle buttons
4. Date - defaults to today, date picker to change
5. Optional: weather condition
6. "Start Round" - creates `rounds` record with `status = 'active'`, redirects to `/round/[id]` at first hole

On round start, all hole data for the selected course version is fetched and cached in `useActiveRound` hook. No further API calls are needed for hole data during the round.

---

### 6.2 Active Round (`/round/[id]`)

Each hole has two states:

---

**State A - Pre-Hole Screen**

Shown before logging begins on each hole.

- Hole number, par, stroke index, yardage (based on selected tee colour)
- AI advice block - specific to this hole and this user's historical performance on it (see Section 9)
- Mini hole map - Google Maps, tee marker, pin marker, live GPS blue dot
- Distance from current GPS position to pin in yards (live, updates as user moves)
- Two actions:
  - "Start Hole" → advances to State B
  - "Skip Hole" → confirmation dialog: "Skipping this hole will mark your round as partial. Continue?" → if confirmed, writes `hole_status = 'skipped'`, sets `rounds.status = 'partial'`, advances to next hole pre-hole screen

---

**State B - Hole Logging Screen**

Full screen, single thumb operation, no scrolling. MUI components throughout. All tap targets minimum 48px.

```
─────────────────────────────────────
  HOLE 7     Par 4     SI 5     342y
─────────────────────────────────────

  SCORE
  [   −   ]      5      [   +   ]

  FAIRWAY HIT                         ← hidden for par 3
  [  LEFT  ]  [ CENTRE ]  [ RIGHT ]

  GREEN IN REGULATION
  [      YES      ]  [      NO      ]

  PUTTS
  [   −   ]      2      [   +   ]

  PENALTIES
  [   −   ]      0      [   +   ]
  [   OB   ]  [ WATER ]  [ UNPLAYABLE ]    ← shown only if penalties > 0

─────────────────────────────────────
  [ PICK UP ]          [ SAVE & NEXT → ]
─────────────────────────────────────
```

**Save & Next:** writes `hole_scores` record with `hole_status = 'complete'`, updates running score vs par display, advances to next hole State A. On hole 18 (or hole 9 if 9-hole round), advances to End Round screen instead.

**Pick Up:** saves all data entered so far, sets `hole_status = 'picked_up'`. Score recorded as entered (represents minimum strokes taken). Score displayed as "PU" on scorecard. Putts excluded from putting stats if hole not completed. Round can still be marked complete - picking up is a normal part of casual golf. Advances to next hole State A.

---

### 6.3 End Round Screen

- Full scorecard - all holes in a clean MUI table
- Columns: hole, par, score, fairway, GIR, putts, penalties
- Skipped holes clearly marked. Picked up holes shown as "PU"
- Totals row: total strokes, score vs par, stableford points
- Key stats row: GIR%, Fairways%, Avg Putts
- AI round observations - 2-3 sentences (what went well, what cost shots, one thing to work on)
- "Edit Hole" option on any row before completing
- "Complete Round" button - sets `status = 'complete'` (or `'partial'` if any holes skipped)
- Round saved, redirect to `/rounds`

---

### 6.4 Round History (`/rounds`)

- List of all rounds, newest first
- Per row: date, course, tee colour, 9/18, score vs par, stableford, status badge (complete/partial)
- Tap any round to view full hole-by-hole scorecard (read only)

---

## 7. Stats Dashboard (`/stats`) - PRIORITY SCREEN

The most important screen after round logging. Visually exceptional. MUI X charts throughout.

### Stats Filter Bar (global, top of page)
A single persistent filter at the top of the stats page:
- **Last 20 Rounds** (default)
- **All Time**

Toggling this filter re-queries and re-renders all charts and stats on the page simultaneously. Implemented as a context provider so all child components react automatically. In development, a secondary toggle "Include Seed Data" is available (see Section 10).

---

### 7.1 KPI Overview Row
Five horizontally scrollable stat cards (mobile) / grid (desktop):
- Rounds played (within selected filter)
- Scoring average
- Best round (score vs par, within filter)
- GIR %
- Avg Putts per Round

---

### 7.2 Handicap Trajectory
- Line chart of handicap index entries over time (manual entries)
- Projected trend line towards single-figure target
- AI projection: "At your current trajectory you are on track for single figures in approximately X rounds"
- Manual "Update Handicap" button - quick dialog to enter new index

---

### 7.3 18-Hole Scorecard Strip (signature visual)
A horizontal strip of 18 tiles, one per hole, rendered in order.

Each tile:
- Shows hole number
- Colour-banded by average score vs par across all rounds in filter:
  - Eagle or better: gold `#c9a84c`
  - Birdie: blue `#2980b9`
  - Par: green `#27ae60`
  - Bogey: amber `#e67e22`
  - Double bogey: orange `#d35400`
  - Triple or worse: red `#c0392b`
- Colour intensity scales with consistency - a hole you bogey 90% of the time is deep red; 50% is mid-tone
- On page load: tiles animate in left to right with subtle fade and scale-up
- Tap any tile → per-hole drill-down panel (Section 7.5)

This is the signature visual of the app. The user sees their entire course performance at a glance before reading a single number.

---

### 7.4 Best Hole / Worst Hole Cards
Two MUI cards, side by side:

**Best Hole card:**
- Hole number and name
- Average score vs par (e.g. "+0.3")
- Key strength stat (e.g. "62% GIR - your best approach hole")
- One-line AI insight: "Your consistency here comes from accurate tee shots. Stay left of the fairway bunker."

**Worst Hole card:**
- Hole number and name
- Average score vs par (e.g. "+2.1")
- Key problem stat (e.g. "Penalty in 1 in 3 rounds")
- One-line AI insight: "You take OB here regularly. Consider a 3-wood off the tee and give yourself a full approach."

---

### 7.5 Per-Hole Drill-Down
Triggered by tapping a tile on the scorecard strip. Full-screen MUI slide-up drawer:

- Hole overview: par, stroke index, yardage, map thumbnail
- Score distribution bar chart: eagle / birdie / par / bogey / double / triple+ (counts and %)
- GIR % with trend line (last 10 rounds on this hole)
- Fairway direction breakdown: left / centre / right as a proportional bar (par 4/5 only)
- Average putts on this hole
- Penalty frequency and most common type
- AI insight specific to this hole and this user's pattern

---

### 7.6 Game Radar Chart
Pentagon radar chart, 5 dimensions (MUI X):

- **Driving** - fairway % (par 4 and 5 only)
- **Approach** - GIR %
- **Short Game** - chip-in rate and sand save %
- **Putting** - avg putts per hole and 3-putt frequency (inverted - lower is better)
- **Course Management** - penalty rate and scoring on high stroke index holes

Each axis scored 0-100. User's current performance shown as gold fill with transparency. A white outline reference shape shows the benchmark profile for a single-figure handicap golfer. The gap between the two shapes is where the work is.

---

### 7.7 Trend Sparklines
Three compact line charts in a horizontal row (last 20 rounds):
- Score vs par per round
- GIR % per round
- Putts per round

Direction of travel is the message. Clean, minimal, no clutter.

---

### 7.8 Weakness Identifier + Practice Link
Highlighted card at bottom of stats:
- "Your biggest weakness right now: **Approach Play** (42% GIR)"
- "Recommended drill this week: Mid-iron approach shots to a target from 150 yards - 30 minutes"
- "Log Practice Session" button

---

## 8. Practice Sessions

### Logging
- Date, duration (default 30 mins), focus area, notes
- App pre-populates recommended focus area from weakness stats
- Confirm "Drill Completed" checkbox

### Practice Streak
- Weekly streak counter: how many consecutive weeks with at least one session logged
- Feeds Flash Score fuel API (Section 11)

### Practice History
- List of all sessions with focus area and drill completed status

---

## 9. AI Advice System

All AI calls go through `/api/advice`. OpenAI via the Vercel AI SDK (default model `gpt-4o`, override with `OPENAI_MODEL`).

### 9.1 Pre-Hole Advice (`POST /api/advice/hole`)

**Inputs:** hole data (par, SI, yardage, tee colour) + user's historical stats for this specific hole (avg score vs par, GIR%, fairway direction breakdown, avg putts, penalty frequency and type, number of rounds played on hole).

**Prompt approach:** Claude is a knowledgeable caddy. Advice must reference the actual stats. Generic tips are forbidden. 2-3 sentences max. Sound like a caddy, not a chatbot.

**Fallback:** If fewer than 3 rounds have been logged on this hole, return a general tip based on par and yardage only. Never fabricate historical stats.

**Example outputs:**
- "You miss this green on approach in 7 of your last 10 rounds here. At 165 yards into a prevailing headwind, consider one extra club and aim for the centre of the green rather than the flag."
- "You three-putt this green more than any other on the course. The slope runs hard from back to front - always leave yourself below the hole."

### 9.2 End of Round Observations (`POST /api/advice/round`)
Full hole-by-hole scorecard submitted. Returns 2-3 concise observations: what went well, what cost most shots, one concrete thing to work on next time.

### 9.3 Best / Worst Hole Insight (`POST /api/advice/hole-insight`)
Single sentence insight per hole based on aggregated stats. Called when generating best/worst hole cards.

### 9.4 Drill Assignment (`POST /api/advice/drill`)
Receives current weakness stats. Returns: focus area label, specific 30-minute drill description, what metric it targets.

### 9.5 Handicap Projection (`POST /api/advice/projection`)
Receives last 20 rounds scoring data and current handicap. Returns a natural language projection towards single figures.

---

## 10. Seed Data and Reset Scripts

### Philosophy
Real data and seed data coexist safely in the same database. The `data_source` column on `rounds` is the single dividing line:
- `'real'` - actual rounds played by the user. Never touched by scripts.
- `'seed'` - test data inserted by the seed script. Safely deletable at any time.

The stats dashboard always defaults to `data_source = 'real'` only. Seed data is invisible in production use.

### Seed Script (`/scripts/seed.ts`)

Run with: `npx ts-node scripts/seed.ts`

What it inserts:
- 25 realistic completed rounds for Rowany (mixture of 9 and 18 hole, yellow and white tees)
- Hole scores for every round with realistic variance - not perfect, not terrible, roughly 11 handicap level
- Realistic fairway, GIR, putt, and penalty distributions to make stats meaningful
- 8 practice sessions spread over the past 3 months
- One handicap history sequence showing gradual improvement from 13.5 to 11.2
- All rounds marked `data_source = 'seed'`

Seed data is designed to make every stat chart, radar, heatmap, and trend line visually meaningful from day one of development.

### Reset Script (`/scripts/reset-seed.ts`)

Run with: `npx ts-node scripts/reset-seed.ts`

What it deletes:
- All `hole_scores` where `round_id` belongs to a seed round
- All `rounds` where `data_source = 'seed'`
- All `practice_sessions` inserted by seed (identified by a seed marker in notes field)
- Handicap history entries marked as seed

What it never touches:
- Any row where `data_source = 'real'`
- Course data, hole data, course versions
- User profiles
- Auth records

### Dev Mode Toggle
In development (`NODE_ENV = 'development'` only), the stats page shows a secondary filter toggle: "Include Seed Data." When enabled:
- A yellow `DevModeBanner` component renders at the top of the stats page: "⚠ Dev Mode: Seed data included in stats"
- All stats queries include both `real` and `seed` data sources
- This toggle is completely absent in production builds

---

## 11. Flash Score API (External)

Authenticated via `x-api-key` header. Key stored as `FLASH_SCORE_API_KEY` in Vercel env vars on both apps.

All Flash Score endpoints use `data_source = 'real'` data only. Seed data never leaks into the rocket mechanic.

### `GET /api/flash-score/golf/summary`
```json
{
  "rounds_played_total": 24,
  "rounds_played_last_30_days": 3,
  "handicap_index": 11.2,
  "scoring_average": 89.4,
  "last_round": {
    "date": "2026-04-10",
    "score_vs_par": 14,
    "stableford": 28
  },
  "practice_streak_weeks": 3,
  "last_practice": "2026-04-08",
  "weakness": "approach"
}
```

### `GET /api/flash-score/golf/fuel`
Returns `fuel_value` integer 0-100. Logic in `/lib/stats.ts`:

| Event | Fuel change |
|---|---|
| Round played this week | +40 |
| Practice session this week | +30 |
| Score trend improving (last 5 rounds) | +20 |
| No round and no practice today | -15 |
| Floor | 0 |
| Ceiling | 100 |

---

## 12. Tests (`/tests`)

Tests are a first-class concern. The app must work reliably on a golf course before it is considered done. Tests run via `npm test` (Jest + React Testing Library).

### Unit Tests (`/tests/unit`)

**`stats.test.ts`**
- GIR % calculation from hole scores
- Fairways % calculation (par 4/5 only)
- Avg putts calculation (excluding picked up holes)
- Score vs par calculation
- Stableford points calculation
- Fuel value calculation for various scenarios
- Stats correctly filtered by `data_source`
- Stats correctly filtered by last 20 rounds vs all time

**`handicap.test.ts`**
- Projection logic returns sensible values
- Handles edge case: fewer than 5 rounds logged

**`gps.test.ts`**
- Haversine distance calculation between known coordinates
- Bearing calculation
- Edge cases: same point, antipodal points

**`fuel.test.ts`**
- Fuel at 100 does not exceed 100
- Fuel at 0 does not drop below 0
- Correct decay when no activity
- Correct fuel for week with round only
- Correct fuel for week with practice only
- Correct fuel for week with both

### Integration Tests (`/tests/integration`)

**`round-flow.test.ts`**
- Round setup creates correct `rounds` record
- Each hole logged creates correct `hole_scores` record
- Running score vs par updates correctly after each hole
- Round completion calculates and stores totals correctly
- Round marked `complete` on finish

**`skip-hole.test.ts`**
- Skipping a hole writes `hole_status = 'skipped'`
- Round marked `partial` when any hole is skipped
- Skipped holes excluded from stat calculations
- Round can be completed with skipped holes

**`pickup-hole.test.ts`**
- Pick up writes entered data with `hole_status = 'picked_up'`
- Picked up score shown as "PU" on scorecard
- Putts from picked up holes excluded from putting stats
- Round can be marked complete with picked up holes

**`course-version.test.ts`**
- Historical round retains its `course_version_id` after version upgrade
- New rounds use new active version
- Stats for old rounds calculated against their version's hole data
- 9-hole config loads correct holes

**`auth.test.ts`**
- Unauthenticated user redirected to `/login`
- Non-operator user receives 403 on operator routes
- RLS prevents user accessing another user's rounds

### E2E Tests (`/tests/e2e`)

**`round-mobile.test.ts`**
- Complete simulated 18-hole round: setup → 18 holes logged → end screen → completion
- All tap targets meet 48px minimum
- No scrolling required on hole logging screen
- Round marked complete with correct totals

**`stats-dashboard.test.ts`**
- Stats page renders without error after seed data loaded
- All 6 chart components mount correctly
- Last 20 rounds filter applies correctly
- All Time filter applies correctly
- Dev mode seed data toggle works in development

**`ai-advice.test.ts`**
- Advice endpoint returns a valid non-empty string
- Fallback generic advice returned when fewer than 3 rounds on hole
- End of round observations endpoint returns valid response
- Advice endpoint handles OpenAI API error gracefully

---

## 13. Mobile UI - Zero Tolerance Rules

Every screen must pass all of these:

1. **Tap targets minimum 48px height** - no exceptions on the hole logging screen
2. **Steppers only for counts** - strokes, putts, and penalties use [−] value [+] pattern. Never a free-text number input on course
3. **Single thumb operation** - all critical round actions reachable without repositioning the hand
4. **No scrolling on hole logging screen** - entire State B fits on one screen on an iPhone 12 or newer
5. **High contrast, sunlight readable** - dark theme, white text, gold accents. Test in a bright environment
6. **Auto-save on every hole** - data written to Supabase on each Save & Next. Browser close loses nothing
7. **Round data cached on start** - all hole data fetched at round start and held in `useActiveRound`. No live API dependency during play

---

## 14. Visual Design

### Colour Tokens
| Token | Value | Usage |
|---|---|---|
| Primary | `#1a3c2e` | Deep golf green - primary surfaces |
| Surface | `#1e2a35` | Slate - card backgrounds |
| Accent | `#c9a84c` | Warm gold - highlights, CTAs, eagle colour |
| Text Primary | `#f0f0e8` | Off-white |
| Text Secondary | `#9aa8b2` | Muted labels |
| Birdie | `#2980b9` | Blue |
| Par | `#27ae60` | Green |
| Bogey | `#e67e22` | Amber |
| Double | `#d35400` | Orange |
| Triple+ | `#c0392b` | Red |
| Warning | `#f39c12` | Dev mode banner |

### Typography
- **Headings:** Playfair Display - character, prestige, golf-appropriate
- **Body / UI:** DM Sans - clean, legible at small sizes on mobile

### MUI Theme
Custom theme configured in `/lib/theme.ts`. All MUI components inherit from this theme. No inline colour values anywhere in the codebase. All spacing, shadows, and border radii defined in theme.

### Scorecard Strip
The signature visual. Tiles animate in left-to-right on load with staggered delay (CSS `animation-delay`). Each tile has a subtle inner glow that intensifies with performance severity. On hover/tap: tile scales up slightly and shows hole number prominently.

### Radar Chart
Gold semi-transparent fill on dark background. White outline reference shape for single-figure benchmark. Clean axes with minimal labels. Animated fill on load.

### Maps
Google Maps dark terrain style. Custom SVG markers: flag icon for tee, glowing circle for pin. User GPS position as pulsing blue dot.

---

## 15. Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o
FLASH_SCORE_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## 16. Build Phases

### Phase 1 - Foundation
Validate this phase with a real round before proceeding.

- [ ] Supabase project, schema creation, RLS policies
- [ ] Google OAuth (Supabase + Google Cloud Console)
- [ ] Rowany seed data: real scorecard data, placeholder GPS coordinates
- [ ] Course version model (operator-controlled, invisible to users)
- [ ] Round setup screen (course, tee, 9/18)
- [ ] Hole logging UI - State B (no map, no AI advice yet)
- [ ] Skip hole and pick up functionality
- [ ] End of round screen and round completion
- [ ] Round history list
- [ ] Unit tests for stats calculations
- [ ] Integration tests for round flow, skip, pick up
- [ ] Seed script and reset script

**Gate: Play one real round. Validate logging is fast, reliable, and survivable one-handed on course.**

### Phase 2 - Stats
Validate after 3+ real rounds.

- [ ] Stats dashboard - all components in Section 7
- [ ] MUI X charts integration
- [ ] Stats filter bar (last 20 / all time)
- [ ] Per-hole drill-down
- [ ] Dev mode seed data toggle
- [ ] Practice session logging
- [ ] E2E stats dashboard test

**Gate: Stats are meaningful and visually strong. Charts render correctly on mobile.**

### Phase 3 - AI
- [ ] Pre-hole AI advice (State A)
- [ ] End of round observations
- [ ] Best/worst hole insights
- [ ] Drill assignment
- [ ] Handicap projection
- [ ] AI advice E2E tests

### Phase 4 - GPS and Maps
- [ ] Google Maps integration
- [ ] Live GPS position
- [ ] Distance to pin calculation
- [ ] Accurate Rowany GPS coordinates plotted
- [ ] GPS unit tests

### Phase 5 - Flash Score API
- [ ] Summary endpoint
- [ ] Fuel endpoint
- [ ] API key authentication
- [ ] Fuel logic unit tests

---

## 17. Pre-Build Checklist
Complete all of these before Claude Code starts Phase 1:

- [ ] Rowany scorecard scanned and provided to Claude - hole data extracted into seed script
- [ ] Supabase project created - URL and anon key noted
- [ ] Google Cloud Console project created - OAuth client ID and secret noted
- [ ] Google Maps API key created and domain-restricted
- [ ] OpenAI API key ready (default model `gpt-4o`)
- [ ] Vercel project created and linked to GitHub repo
- [ ] GitHub repo created with `main` branch protection (no direct pushes)
- [ ] Flash `is_operator = true` set in Supabase after first Google sign in

---

## 18. PROJECT.md Instructions for Claude Code

> Always read this entire file before beginning any work. Do not make assumptions about schema, stack, feature scope, or naming - everything is documented here. If something is undocumented or ambiguous, ask before implementing.
>
> **Mobile first is zero tolerance.** If the hole logging screen requires scrolling or has tap targets below 48px on an iPhone 12, it ships broken.
>
> **MUI everywhere.** No Tailwind. No inline colour values. No ad-hoc styling. The custom theme in `/lib/theme.ts` is the single source of truth for all visual decisions.
>
> **Never push directly to main.** All changes via PR.
>
> **Seed data safety.** The reset script must never touch any row where `data_source = 'real'`. Add a guard check at the top of `reset-seed.ts` that aborts if it detects it would affect real data.
>
> **Rowany GPS coordinates are placeholders** until Flash provides real values from Google Maps satellite view. Never overwrite placeholder entries without explicit instruction.
>
> **Tests are not optional.** Every new feature in Phase 1 requires a corresponding test before the phase is considered complete. The app must work reliably on a golf course.
>
> **The app name is FairwayIQ.** Use this consistently in all UI text, page titles, and metadata.