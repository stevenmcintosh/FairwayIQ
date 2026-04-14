# 🧠 Project Setup Checklist

> **Purpose:**
> This checklist is used AFTER project approval.
> It ensures the project is correctly configured, aligned with standards, and ready for development.

---

## Status Key

- **PENDING** — Not yet answered
- **DONE** — Completed
- **SKIPPED** — Not required

---

# 🧩 1. Project Confirmation

- [x] Project name confirmed | Status: DONE | Value: FairwayIQ
- [x] Owner confirmed | Status: DONE | Value: Steven McIntosh (Flash)
- [ ] Project approved via NEW-PROJECT-CHECKLIST | Status: PENDING | Value: ___ *(BLUEPRINT.md used instead — confirm approved)*

---

# 🏗️ 2. Stack Validation (MANDATORY)

### Default Stack

- Next.js
- Vercel
- Supabase
- MUI

---

- [x] Using default stack? | Status: DONE | Value: Yes (Next.js App Router + Vercel + Supabase + MUI v6 + MUI X)

- [x] If NO — exception documented and approved | Status: SKIPPED | Value: N/A — default stack

---

# 🎨 3. UI Standard

- [x] MUI will be used for all UI components | Status: DONE | Value: Yes (MUI v6 + MUI X, custom theme in /lib/theme.ts)

---

# 📦 4. Repository Setup (MANDATORY)

- [x] Repo created in company GitHub organisation | Status: SKIPPED | Value: github.com/stevenmcintosh/FairwayIQ (personal account — exception documented in GOVERNANCE.md §13)
- [x] Repo naming follows convention | Status: DONE | Value: FairwayIQ

---

### Branch Structure

- [x] `dev` branch created | Status: DONE | Value: created locally 2026-04-13 (needs push to origin)
- [x] `staging` branch created | Status: DONE | Value: created locally 2026-04-13 (needs push to origin)
- [x] `main` branch created | Status: DONE | Value: main (local + origin)

---

### Branch Protection Rules

- [ ] No direct push to `main` | Status: PENDING | Value: enable via GitHub → Settings → Branches
- [ ] PR required for `staging` | Status: PENDING | Value: enable via GitHub → Settings → Branches
- [ ] PR required for `main` | Status: PENDING | Value: enable via GitHub → Settings → Branches

---

# 📄 5. Mandatory Project Files

- [x] `PROJECT.md` created | Status: DONE | Value: populated from BLUEPRINT
- [x] `README.md` created | Status: DONE | Value: populated with quick start + env var guide
- [x] `ARCHITECTURE.md` created | Status: DONE | Value: populated
- [x] `GOVERNANCE.md` created | Status: DONE | Value: populated with project-specific rules + exceptions
- [x] `DEPLOYMENT.md` created | Status: DONE | Value: populated (branching, env mapping, rollback)
- [x] `DATA_MODEL.md` created | Status: DONE | Value: populated (entities, RLS outline; SQL in BLUEPRINT §3)
- [x] `INTEGRATIONS.md` created | Status: DONE | Value: populated (Supabase, Google, OpenAI, Flash Score)
- [x] `CHANGELOG.md` created | Status: DONE | Value: v0.0.1 entry

---

# 🔧 6. Infrastructure Setup

- [x] Database required? | Status: DONE | Value: Yes
- [x] Database provider | Status: DONE | Value: Supabase (Postgres)

- [x] Auth required? | Status: DONE | Value: Yes
- [x] Auth provider | Status: DONE | Value: Supabase Auth — Google OAuth only

- [x] API routes required? | Status: DONE | Value: Yes — /api/rounds, /holes, /courses, /stats, /advice, /flash-score

- [x] External integrations | Status: DONE | Value: Google Maps JS API, OpenAI via Vercel AI SDK (default `gpt-4o`), Flash Score API (outbound)

- [x] Webhooks required? | Status: DONE | Value: No (none in BLUEPRINT; internal Supabase trigger creates user_profiles row on sign in)

---

# 🔐 7. Credentials & Accounts

- [ ] Hosting account ready (Vercel) | Status: PENDING | Value: not yet created
- [x] Database credentials obtained | Status: DONE | Value: Supabase URL + anon + service role in .env.local
- [x] Auth keys obtained | Status: DONE | Value: Google OAuth Client ID + Secret in .env.local
- [x] Integration API keys obtained | Status: DONE | Value: Google Maps ✓ (confirm domain-restricted); OpenAI ✓ in .env.local; Flash Score key pending (generate when needed)

---

# 🌐 8. Environment Setup

- [x] `.env.example` created | Status: DONE | Value: all 8 variables defined with inline comments
- [x] Environment variables defined | Status: DONE | Value: 9 vars — NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, OPENAI_API_KEY, OPENAI_MODEL, FLASH_SCORE_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- [ ] Variables added to Vercel | Status: PENDING | Value: ___

---

# 🚀 9. Deployment Setup

- [ ] Vercel project connected to repo | Status: PENDING | Value: ___

- [ ] Environment mapping:
  - dev → preview | Status: PENDING | Value: ___
  - staging → staging | Status: PENDING | Value: ___
  - main → production | Status: PENDING | Value: ___

---

# 🚦 10. Ready to Build

- [ ] All required items completed or skipped | Status: PENDING | Value: ___

---

## ✅ Final Rule

> Development should not begin until all mandatory sections are complete.

---

## 🧠 One-liner

**"Setup discipline prevents production chaos."**
