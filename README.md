# 🚀 888A Project Template

> This repository is the **standard starting point** for all internal tools and AI projects.
> It ensures every project is built, structured, and governed consistently.

---

# 🧠 How to Start a New Project

Follow these steps **in order** — do not skip.

---

## ✅ Step 1 — Choose How You Want to Start

You can start a project in **one of three ways**:

### Option A — Checklist (Best for new ideas)

Complete:

👉 `NEW-PROJECT-CHECKLIST.md`

Use this when:

* The idea is early
* You need to define scope and ownership

---

### Option B — Blueprint (Best for defined projects)

Create a file:

```text
BLUEPRINT.md
```

Paste your project brief, PRD, or notes into it.

Use this when:

* You already have a document
* You want to move fast

---

### Option C — Paste into Claude

Skip files and:

👉 Paste your project brief directly into Claude when you start

Use this when:

* You have the info but not structured yet

---

⚠️ **Rule:**
A project must have **clear purpose, owner, and scope** before proceeding.

---

## 🚀 Step 2 — Create Project from Template

1. Go to this repository in GitHub
2. Click **Use this template**
3. Select **Create a new repository**
4. Name your project using convention:

```text
ops-tool-xxx
product-tool-xxx
ai-tool-xxx
```

---

## 💻 Step 3 — Clone the Project

```bash
git clone https://github.com/YOUR-ORG/YOUR-NEW-REPO.git
cd YOUR-NEW-REPO
```

---

## 🤖 Step 4 — Open in Claude

Open the project folder in Claude.

Claude will:

* Read your input (Checklist / Blueprint / Paste)
* Extract known information
* Populate setup checklist
* Ask only for missing details

---

## 🧩 Step 5 — Complete Setup

Claude will guide you through:

* Stack validation (Next.js, Vercel, Supabase, MUI)
* Repo and branch setup
* Integrations and environment setup
* Governance enforcement

---

## 📄 Step 6 — Generate Project Files

Claude will:

* Generate all required documentation
* Populate project files
* Update `README.md` with real project details

---

## 🏗️ Step 7 — Run the Project

```bash
npm install
npm run dev
```

---

# 📁 Project Structure

Each project includes:

* `PROJECT.md` — Project purpose and scope
* `ARCHITECTURE.md` — System design
* `GOVERNANCE.md` — Rules and standards
* `DEPLOYMENT.md` — Release process
* `DATA_MODEL.md` — Data structure
* `INTEGRATIONS.md` — External systems
* `CHANGELOG.md` — Change history

---

# 🔒 Standards (Non-Negotiable)

All projects must:

* Use **Next.js + Vercel + Supabase**
* Use **MUI for UI**
* Follow **branching model: dev → staging → main**
* Use **Pull Requests (no direct push to main)**
* Include all required documentation

---

# 🤖 AI Agents

Reusable workflows live in:

```text
/agents/
```

Rules:

* Must be reusable
* Must be documented
* No temporary or experimental prompts

---

# 🧠 Key Principle

**Consistency over flexibility. Always.**

---

# 🧠 One-liner

**“Start with clarity, build with consistency.”**
