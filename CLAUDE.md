# CLAUDE.md — Project Setup & Governance OS

> This file defines how Claude operates within this project.
> It enforces setup discipline, governance standards, and consistent project structure.

---

# 🧠 SYSTEM OVERVIEW

This project supports **3 ways to start**:

1. `NEW-PROJECT-CHECKLIST.md` (structured start)
2. `BLUEPRINT.md` (existing project brief)
3. Direct input pasted into Claude

---

# 🚀 BOOT SEQUENCE (MANDATORY)

On EVERY session start:

---

## Step 1 — Check for Blueprint

If `BLUEPRINT.md` exists:

* Read it fully
* Extract:

  * project purpose
  * users
  * scope
  * stack
  * integrations

Then:

* Populate `SETUP-CHECKLIST.md`
* Fill any obvious values
* Identify missing gaps

Say:

> "I’ve reviewed your BLUEPRINT.md and extracted key information.
> Let’s fill in the remaining gaps to complete setup."

---

## Step 2 — If No Blueprint, Check Checklist

If `NEW-PROJECT-CHECKLIST.md` is completed:

* Continue setup

---

## Step 3 — If Neither Exists

Ask:

> "How would you like to start?
>
> 1. Complete the checklist
> 2. Add a BLUEPRINT.md file
> 3. Paste your project brief here
>
> I’ll use that to set up your project."

STOP until input is provided.

---

## Step 4 — Load Setup Checklist

* Read `SETUP-CHECKLIST.md`
* Count PENDING items

---

## Step 5 — Session Mode

### FIRST SESSION

Say:

> "Tell me everything you already know about this project.
> I’ll use it to complete as much setup as possible."

Then:

* Parse input
* Update checklist immediately
* Continue questioning

---

### PARTIAL SESSION

Say:

> "Welcome back — you have X setup items remaining. Let's continue."

---

### SETUP COMPLETE

* Skip setup
* Act as full project assistant

---

# 🧩 QUESTIONING STYLE

* Group related questions
* Accept partial answers
* Allow skipping (mark SKIPPED)
* Ask only for missing gaps
* Offer defaults:

  * Next.js
  * Vercel
  * Supabase
  * MUI

---

# 🔒 GOVERNANCE RULES (ENFORCED)

## Stack Standard

* Next.js
* Vercel
* Supabase
* MUI

Deviations:

* Must be documented
* Must be approved

---

## UI Standard

* MUI is mandatory
* No alternative UI frameworks allowed

---

## Repository Rules

* Must be in company GitHub org

### Branch Structure

* dev
* staging
* main

### Rules

* No direct push to main
* PR required for staging
* PR required for main

---

## Required Files

* PROJECT.md
* README.md
* ARCHITECTURE.md
* GOVERNANCE.md
* DEPLOYMENT.md
* DATA_MODEL.md
* INTEGRATIONS.md
* CHANGELOG.md
* .env.example

---

# 📄 TEMPLATE-AWARE FILE GENERATION

Templates are stored in:

```text
/templates/
```

---

## Rules

* Use templates exactly
* Do not invent structure
* Populate known data
* Leave blanks if unknown

---

## README Generation

When updating `README.md`:

* Use template structure
* Populate real project details
* Keep concise
* Ensure project can be run in 10 minutes

---

# 📄 CHECKLIST MANAGEMENT

* Update immediately on answers
* PENDING → DONE
* Allow SKIPPED with reason

---

# 🏁 WHEN SETUP COMPLETES

Claude must:

1. Generate all required files
2. Populate them using templates
3. Update README.md
4. Highlight missing sections
5. Offer next steps

---

# 🧠 FINAL PRINCIPLE

**“Use what exists. Ask only what’s missing.”**
