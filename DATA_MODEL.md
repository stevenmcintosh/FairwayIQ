# DATA_MODEL.md — FairwayIQ

> Full SQL definitions live in BLUEPRINT.md §3. This file summarises entities, relationships, and ownership rules. Treat BLUEPRINT as the source of truth for column types; update both if the schema changes.

---

## 1. Overview

Postgres schema on Supabase with Row Level Security. Every user-owned row traces back to `auth.users.id`. Course data is immutable per version via `course_versions`, which protects historical stats.

---

## 2. Entities

| Entity | Description |
|--------|-------------|
| `courses` | A golf course. Points at the currently active version. |
| `course_versions` | A snapshot of course layout (hole data). Immutable once historical rounds reference it. |
| `holes` | Per-hole data for a specific course version (par per tee, yardage per tee, SI, GPS). |
| `rounds` | A round played by a user. Tagged with `data_source` (`'real'` or `'seed'`). |
| `hole_scores` | Per-hole score within a round. Can be complete, skipped, or picked_up. |
| `practice_sessions` | Practice logs with focus area and drill assignment. |
| `user_profiles` | Per-user profile: display name, handicap index, home course, operator flag. |

---

## 3. Relationships

| From | To | Type |
|------|----|------|
| `courses.active_version_id` | `course_versions.id` | 1:1 (pointer to active) |
| `course_versions.course_id` | `courses.id` | many:1 |
| `holes.course_version_id` | `course_versions.id` | many:1 |
| `rounds.user_id` | `auth.users.id` | many:1 |
| `rounds.course_id` | `courses.id` | many:1 |
| `rounds.course_version_id` | `course_versions.id` | many:1 (immutable once set) |
| `hole_scores.round_id` | `rounds.id` | many:1 |
| `hole_scores.hole_id` | `holes.id` | many:1 |
| `practice_sessions.user_id` | `auth.users.id` | many:1 |
| `user_profiles.id` | `auth.users.id` | 1:1 |
| `user_profiles.home_course_id` | `courses.id` | many:1 |

---

## 4. Key Fields

| Entity | Field | Description |
|--------|-------|-------------|
| `rounds` | `data_source` | `'real'` or `'seed'` — single dividing line for reset safety |
| `rounds` | `status` | `'active'`, `'complete'`, `'partial'` |
| `rounds` | `course_version_id` | Frozen at round creation — preserves historical accuracy |
| `hole_scores` | `hole_status` | `'complete'`, `'skipped'`, `'picked_up'` |
| `hole_scores` | `penalty_type` | `'ob'`, `'water'`, `'unplayable'`, or null |
| `course_versions` | `nine_hole_config` | jsonb array of hole numbers for the 9-hole route |
| `holes` | `par_white/yellow/red` | Per-tee par (some courses differ) |
| `holes` | `gps_tee_*` / `gps_green` | jsonb `{ lat, lng }` |
| `user_profiles` | `is_operator` | Course/version management gate |

---

## 5. Source of Truth Rules

- Supabase Postgres is the single source of truth for all domain data
- `BLUEPRINT.md §3` is the source of truth for SQL column definitions
- Course data is owned by the operator (Flash only); never rewritten on existing versions — create a new version instead
- User data is owned by the authenticated user; RLS enforced server-side

---

## 6. Data Constraints

- `rounds.hole_count` ∈ {9, 18}
- `rounds.tee_colour` ∈ {`white`, `yellow`, `red`}
- `hole_scores.strokes` may be null if `hole_status = 'skipped'`
- `hole_scores.putts` excluded from putting stats when `hole_status = 'picked_up'`
- `holes.hole_number` ∈ [1, 18]
- `holes.stroke_index` ∈ [1, 18], unique within a course version
- Reset script **must** guard: abort if it would touch any `rounds` row where `data_source = 'real'`

---

## 7. Ownership

| Entity | Owner |
|--------|-------|
| `courses` | Operator (Flash) |
| `course_versions` | Operator (Flash) |
| `holes` | Operator (Flash) |
| `rounds` | Authenticated user |
| `hole_scores` | Authenticated user |
| `practice_sessions` | Authenticated user |
| `user_profiles` | Authenticated user (self) |

---

## 8. RLS Policy Outline

- `rounds`, `hole_scores`, `practice_sessions`: user can read/write only their own rows (`user_id = auth.uid()`)
- `user_profiles`: user can read/update only their own row
- `courses`, `course_versions`, `holes`: readable by any authenticated user; writable only where `is_operator = true` (enforced server-side, not just RLS)
- Flash Score API routes use the service role key with `data_source = 'real'` filter baked into every query
