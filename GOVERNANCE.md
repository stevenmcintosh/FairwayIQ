# GOVERNANCE.md — FairwayIQ

## Purpose
Defines the mandatory rules for building, maintaining, and scaling FairwayIQ.

---

## 1. Stack Rules

Default stack (enforced):

- Frontend: Next.js (App Router)
- Hosting: Vercel
- Database/Auth: Supabase
- UI: MUI v6 + MUI X

Rules:
- This stack must be used. Deviations require documented and approved exceptions.
- No Tailwind. No alternative UI frameworks.

---

## 2. UI Standards

- MUI is mandatory for all UI components
- Custom theme in `/lib/theme.ts` is the single source of truth
- No inline colour values; no ad-hoc styling
- All tap targets on the hole logging screen must be ≥ 48px
- Hole logging screen must not require scrolling on an iPhone 12 or newer

See BLUEPRINT §13 (Zero Tolerance Rules) and §14 (Visual Design).

---

## 3. Repository & Branching Rules

- Repository: `github.com/stevenmcintosh/FairwayIQ`
- Personal GitHub account (not a company org). Governance standard noted; exception accepted for personal project.

### Branch Structure
- `dev`
- `staging`
- `main`

### Rules
- No direct push to `main`
- PR required for `staging`
- PR required for `main`
- Branch protection must be enabled on `main` (and `staging`) via GitHub settings

---

## 4. Code Standards

- TypeScript strict mode required
- No use of `any`
- All inputs validated at API boundary
- Errors must not be silently ignored
- All colour / spacing / typography via MUI theme tokens

---

## 5. Data & Architecture Rules

- All DB access goes through `/lib/supabase.ts`
- No direct DB calls from UI components
- RLS enforced on every table
- Server-only secrets (service role key, OpenAI key, Flash Score key) never imported into client code
- `rounds.data_source = 'real'` rows are sacred — reset scripts must guard against touching them

---

## 6. Environment & Security

- No secrets in code
- All secrets stored in `.env.local` (gitignored) and Vercel env vars
- `.env.example` must define all required variables
- Google Maps API key must be domain-restricted in Google Cloud Console
- `FLASH_SCORE_API_KEY` is a shared secret between FairwayIQ and the future Flash Score app

---

## 7. Folder Structure

- Must follow the layout defined in BLUEPRINT §2 / ARCHITECTURE §3
- No deviation without documented reason

---

## 8. Documentation Rules

Mandatory files (all must exist and stay current):

- `BLUEPRINT.md` — Immutable project brief
- `PROJECT.md` — Current project state
- `README.md` — Quick start for any developer
- `ARCHITECTURE.md` — System design
- `GOVERNANCE.md` — This file
- `DEPLOYMENT.md` — Release process
- `DATA_MODEL.md` — Schema reference
- `INTEGRATIONS.md` — External systems
- `CHANGELOG.md` — Change history

---

## 9. Ownership Model

| Area | Owner |
|------|-------|
| Frontend | Steven McIntosh |
| Backend | Steven McIntosh |
| Data | Steven McIntosh |
| DevOps | Steven McIntosh |

---

## 10. Testing Expectations

- Tests are a first-class concern — the app must work reliably on a golf course
- Every Phase 1 feature requires a corresponding test before the phase is considered complete
- Unit tests: stats, handicap, GPS, fuel calculations
- Integration tests: round flow, skip, pick-up, course version, auth
- E2E tests: simulated mobile round, stats dashboard, AI advice

---

## 11. Change Management

- All changes via Pull Requests
- No direct changes to production
- Changes reviewed before merge (even solo — self-review via PR diff)
- Seed/reset scripts require extra scrutiny because of data impact

---

## 12. AI Agents

The `/agents` folder contains reusable AI workflows.

Rules:
- Each agent must have a clear purpose and be documented
- No experimental or temporary agents
- Agents must be reusable across sessions
- Agents must not duplicate functionality already in code

---

## 13. Exceptions

Documented exceptions in force for this project:
- Repository is in a personal GitHub account (`stevenmcintosh/FairwayIQ`) rather than a company org — accepted because FairwayIQ is a personal project

Any further deviation must be documented, justified, and approved.

---

## 🧠 Principle

**Consistency over flexibility. Always.**
