# CLAUDE.md — Project Setup & Governance OS

> This file defines how Claude operates within this project.
> It enforces setup discipline, governance standards, and consistent project structure.

---

# 🧠 SYSTEM OVERVIEW

This project follows a **2-stage model**:

## Stage 1 — Project Approval (External)
Completed via:
- `NEW-PROJECT-CHECKLIST.md`

Purpose:
- Validate project is worth building
- Confirm owner, scope, and stack direction
- Ensure approval is granted

---

## Stage 2 — Project Setup (This System)
Managed via:
- `SETUP-CHECKLIST.md`

Purpose:
- Configure project correctly
- Enforce governance rules
- Generate required files
- Prepare for development

---

# 🚀 BOOT SEQUENCE (MANDATORY)

On EVERY session start:

---

## Step 1 — Validate Project Readiness

Check:

- Does `NEW-PROJECT-CHECKLIST.md` exist?
- Is it completed?

### If NOT completed:

Say:

> "Before we start, this project must pass the New Project Checklist.
> This ensures the project is valid, aligned, and approved.
>
> Please complete `NEW-PROJECT-CHECKLIST.md` first."

STOP.

---

## Step 2 — Load Setup Checklist

- Read `SETUP-CHECKLIST.md`
- Count all items with `Status: PENDING`

---

## Step 3 — Session Mode

### FIRST SESSION (all PENDING)

Say:

> "This looks like a newly approved project — let's set it up properly.
>
> Tell me everything you already know:
> - project purpose
> - users
> - tools/services
> - decisions already made
>
> The more you share, the faster we complete setup."

Then:
- Extract answers
- Update checklist immediately
- Continue questioning

---

### PARTIAL SESSION

Say:

> "Welcome back — you have X setup items remaining. Let's continue."

---

### SETUP COMPLETE

- Skip onboarding
- Act as full project assistant

---

# 🧩 QUESTIONING STYLE

- Ask in grouped themes (not one-by-one)
- Accept partial answers
- Allow skipping (mark SKIPPED)
- Offer defaults:
  - Next.js
  - Vercel
  - Supabase
  - MUI
- Explain why decisions matter (1 sentence max)
- Do NOT block progress unnecessarily

---

# 🔒 GOVERNANCE RULES (ENFORCED)

## Stack Standard

Default stack:

- Frontend: Next.js
- Hosting: Vercel
- Database/Auth: Supabase
- UI: MUI

Rules:
- Deviations must be documented
- Deviations require approval

---

## UI Standard

- MUI is mandatory
- No alternative UI frameworks without approval
- Styling via MUI theming

---

## Repository Rules

All projects MUST:

- Exist in company GitHub organisation
- Follow naming convention:
  - `ops-tool-xxx`
  - `product-tool-xxx`
  - `ai-tool-xxx`

### Branch Structure

- `dev`
- `staging`
- `main`

### Rules

- No direct push to `main`
- PR required for `staging`
- PR required for `main`

---

## Required Files (MANDATORY)

All projects MUST include:

- `PROJECT.md`
- `README.md`
- `ARCHITECTURE.md`
- `GOVERNANCE.md`
- `DEPLOYMENT.md`
- `DATA_MODEL.md`
- `INTEGRATIONS.md`
- `CHANGELOG.md`
- `.env.example`

---

# 📄 TEMPLATE-AWARE FILE GENERATION

## Location

Templates are stored in:
/templates/


## README Generation

When generating or updating `README.md`:

### Rules

* Use the existing README template as the base
* Populate with project-specific details:

  * Project name
  * Description
  * Stack (confirm or override defaults)
  * Setup instructions
  * Key commands
* Keep it concise and developer-focused
* Do NOT include business case or deep architecture detail
* Ensure a new developer can run the project within 10 minutes

---

### Behaviour

When setup completes:

1. Generate all governance files
2. Update `README.md` with final project details
3. Replace placeholders with real values
4. Improve clarity where needed
5. Keep structure consistent with template



