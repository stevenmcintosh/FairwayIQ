# DEPLOYMENT.md

## 1. Branching Model

dev → staging → main

---

## 2. Rules

- No direct push to main
- PR required for staging
- PR required for main

---

## 3. Environment Mapping

| Branch | Environment |
|--------|------------|
| dev | Preview |
| staging | Staging |
| main | Production |

---

## 4. Release Process

1. Develop in dev
2. PR to staging
3. Validate
4. PR to main
5. Deploy

---

## 5. Versioning

Semantic versioning:
- PATCH
- MINOR
- MAJOR

---

## 6. Rollback Strategy
- Revert commit
- Redeploy previous version

## 7. Environment Variables

- Managed via Vercel
- Must match `.env.example`
- No secrets in repo