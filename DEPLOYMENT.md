# DEPLOYMENT.md — FairwayIQ

## 1. Branching Model

`dev` → `staging` → `main`

- Local development and feature branches merge into `dev`
- `dev` merges into `staging` for validation
- `staging` merges into `main` for production release

---

## 2. Rules

- No direct push to `main`
- No direct push to `staging`
- Pull Requests required for `staging` and `main`
- Branch protection enabled on `main` (and `staging`) via GitHub settings
- Seed/reset scripts must never run against production

---

## 3. Environment Mapping

| Branch | Vercel Environment | URL pattern |
|--------|-------------------|--------------|
| `dev` | Preview | fairwayiq-<hash>-<slug>.vercel.app |
| `staging` | Staging (custom env) | staging.fairwayiq.<domain> |
| `main` | Production | fairwayiq.<domain> |

Vercel env vars must be set for all three environments: Development, Preview, and Production.

---

## 4. Release Process

1. Develop on a feature branch off `dev`
2. PR into `dev` → Vercel preview deployment generated
3. Merge `dev` → PR into `staging` → validate on staging
4. Merge `staging` → PR into `main` → production deployment auto-triggers
5. Verify production; tag release

---

## 5. Versioning

Semantic versioning (`MAJOR.MINOR.PATCH`):
- PATCH — bug fixes, no schema change
- MINOR — new features, backwards compatible
- MAJOR — breaking changes (schema, API contract)

Record every release in `CHANGELOG.md`.

---

## 6. Rollback Strategy

- Primary: Vercel "Promote previous deployment" from dashboard (instant)
- Secondary: Revert the merge commit on `main` and redeploy
- Database: Supabase point-in-time recovery if a migration caused data loss
- Never rollback by force-pushing to `main`

---

## 7. Environment Variables

All secrets managed via Vercel env vars (per environment). Mirror in `.env.local` for local development. `.env.example` lists every variable.

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `OPENAI_API_KEY` (server only)
- `OPENAI_MODEL` (server only, optional — default `gpt-4o`)
- `FLASH_SCORE_API_KEY` (server only)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET` (server only)

No secrets in the repo. Ever.

### Pulling env vars from Vercel (after project is linked)

```bash
vercel link --yes
vercel env pull .env.local --yes
```

Re-run `vercel env pull .env.local --yes` at the start of each dev session if you see auth errors — OIDC tokens expire ~12h.

---

## 8. Database Migrations

- Schema changes go into `/supabase/migrations/` (timestamped SQL files)
- Applied via `supabase db push` in CI or manually against each environment
- Run against staging first, then production
- Destructive migrations require explicit approval and a backup

---

## 9. Phase Gates

Per BLUEPRINT §16, each phase has a validation gate:
- Phase 1 (Foundation) → Gate: play one real round, validate logging
- Phase 2 (Stats) → Gate: stats meaningful after 3+ real rounds
- Phase 3 (AI) → Gate: advice grounded in actual history, no fabrication
- Phase 4 (GPS/Maps) → Gate: real Rowany coordinates plotted
- Phase 5 (Flash Score API) → Gate: Flash Score app consumes successfully
