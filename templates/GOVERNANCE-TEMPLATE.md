# GOVERNANCE.md

## Purpose
Defines the mandatory rules for building, maintaining, and scaling this project.

---

## 1. Stack Rules

Default stack:

- Frontend: Next.js
- Hosting: Vercel
- Database/Auth: Supabase
- UI: MUI

Rules:
- This stack must be used unless an exception is approved
- All deviations must be documented

---

## 2. UI Standards

- MUI is mandatory for all UI components
- No alternative UI frameworks allowed without approval
- Styling must use MUI theming (no ad-hoc CSS unless justified)

---

## 3. Repository & Branching Rules

- Repository must be in the company GitHub organisation

### Branch Structure
- `dev`
- `staging`
- `main`

### Rules
- No direct push to `main`
- PR required for `staging`
- PR required for `main`

---

## 4. Code Standards

- TypeScript strict mode required
- No use of `any`
- All inputs must be validated
- Errors must not be silently ignored

---

## 5. Data & Architecture Rules

- All database access must go through `/src/lib`
- No direct DB calls from UI components
- Data layer must be abstracted and replaceable

---

## 6. Environment & Security

- No secrets in code
- All secrets stored in `.env.local`
- `.env.example` must define all required variables
- Environment variables must not be accessed directly outside config layer

---

## 7. Folder Structure

- Must follow standard project structure
- No deviation without approval

---

## 8. Documentation Rules

The following files are mandatory:

- `PROJECT.md`
- `README.md`
- `ARCHITECTURE.md`
- `GOVERNANCE.md`
- `DEPLOYMENT.md`
- `DATA_MODEL.md`
- `INTEGRATIONS.md`
- `CHANGELOG.md`

Rules:
- All files must exist
- Must be kept up to date

---

## 9. Ownership Model

| Area | Responsibility |
|------|---------------|
| Frontend | UI |
| Backend | APIs |
| Data | Schema |
| DevOps | Deployment & infrastructure |

---

## 10. Testing Expectations

- Critical flows must be tested
- Basic validation required before deployment

---

## 11. Change Management

- All changes must go through Pull Requests
- No direct changes to production
- Changes must be reviewed before merge

---

## 12. AI Agents

The `/agents` folder contains reusable AI workflows.

Rules:
- Each agent must have a clear purpose
- Each agent must be documented
- No experimental or temporary agents allowed
- Agents must be reusable across sessions
- Agents must not duplicate existing functionality in code

---

## 13. Exceptions

- Any deviation from these rules must be:
  - Documented
  - Justified
  - Approved

---

## 🧠 Principle

**Consistency over flexibility. Always.**