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

- [ ] Project name confirmed | Status: PENDING | Value: ___
- [ ] Owner confirmed | Status: PENDING | Value: ___
- [ ] Project approved via NEW-PROJECT-CHECKLIST | Status: PENDING | Value: ___

---

# 🏗️ 2. Stack Validation (MANDATORY)

### Default Stack

- Next.js
- Vercel
- Supabase
- MUI

---

- [ ] Using default stack? | Status: PENDING | Value: Yes / No

- [ ] If NO — exception documented and approved | Status: PENDING | Value: ___

---

# 🎨 3. UI Standard

- [ ] MUI will be used for all UI components | Status: PENDING | Value: Yes / No

---

# 📦 4. Repository Setup (MANDATORY)

- [ ] Repo created in company GitHub organisation | Status: PENDING | Value: ___

- [ ] Repo naming follows convention | Status: PENDING | Value: ___

---

### Branch Structure

- [ ] `dev` branch created | Status: PENDING | Value: ___
- [ ] `staging` branch created | Status: PENDING | Value: ___
- [ ] `main` branch created | Status: PENDING | Value: ___

---

### Branch Protection Rules

- [ ] No direct push to `main` | Status: PENDING | Value: ___
- [ ] PR required for `staging` | Status: PENDING | Value: ___
- [ ] PR required for `main` | Status: PENDING | Value: ___

---

# 📄 5. Mandatory Project Files

- [ ] `PROJECT.md` created | Status: PENDING | Value: ___
- [ ] `README.md` created | Status: PENDING | Value: ___
- [ ] `ARCHITECTURE.md` created | Status: PENDING | Value: ___
- [ ] `GOVERNANCE.md` created | Status: PENDING | Value: ___
- [ ] `DEPLOYMENT.md` created | Status: PENDING | Value: ___
- [ ] `DATA_MODEL.md` created | Status: PENDING | Value: ___
- [ ] `INTEGRATIONS.md` created | Status: PENDING | Value: ___
- [ ] `CHANGELOG.md` created | Status: PENDING | Value: ___

---

# 🔧 6. Infrastructure Setup

- [ ] Database required? | Status: PENDING | Value: Yes / No
- [ ] Database provider | Status: PENDING | Value: ___

- [ ] Auth required? | Status: PENDING | Value: Yes / No
- [ ] Auth provider | Status: PENDING | Value: ___

- [ ] API routes required? | Status: PENDING | Value: Yes / No

- [ ] External integrations | Status: PENDING | Value: ___

- [ ] Webhooks required? | Status: PENDING | Value: Yes / No

---

# 🔐 7. Credentials & Accounts

- [ ] Hosting account ready (Vercel) | Status: PENDING | Value: ___
- [ ] Database credentials obtained | Status: PENDING | Value: ___
- [ ] Auth keys obtained | Status: PENDING | Value: ___
- [ ] Integration API keys obtained | Status: PENDING | Value: ___

---

# 🌐 8. Environment Setup

- [ ] `.env.example` created | Status: PENDING | Value: ___
- [ ] Environment variables defined | Status: PENDING | Value: ___
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

**“Setup discipline prevents production chaos.”**