# DHL Employee Relations Case Management System

Consolidated tracker for grievance, disciplinary, and union cases across
Lagos and outstation locations. See `docs/` for the full project plan.

## Local development

### Requirements
- Node.js 20+ (use NVM)
- Docker Desktop
- `psql` or a DB GUI (TablePlus/DBeaver) for inspecting data

### First-time setup

```bash
cp .env.example .env          # fill in JWT_SECRET etc. for local dev
npm install                    # installs both workspaces
docker compose up -d db        # starts Postgres only, for local (non-Docker) app dev
npm run migrate                # creates all tables + the dashboard view
npm run seed                   # loads sample cases and 4 dev users (password: password123)
```

### Run the app

Two options:

**A. Run api/web natively (fastest inner loop):**
```bash
npm run dev:api   # http://localhost:4000
npm run dev:web   # http://localhost:5173
```

**B. Run everything in Docker (closer to prod):**
```bash
docker compose up
```

### Useful commands

| Command | What it does |
|---|---|
| `npm run migrate` | Run pending migrations |
| `npm run migrate:down` | Roll back the last migration |
| `npm run seed` | Reload sample data |
| `npm run test:api` | Run API tests |
| `node apps/api/src/jobs/dailyAlertScan.js` | Manually trigger the alert scan + dashboard refresh |

## Repo structure

```
apps/api/     Express backend — routes → controller → service → repository per module
apps/web/     React frontend (Vite)
docs/         Project plan and reference documents
```

## Git workflow

- `main` is protected — merge via PR only, CI must pass (lint, migrate, test)
- Branch per feature: `feature/cases-crud`, `feature/stage-tracker`, matching module names
- Conventional commits (`feat:`, `fix:`, `chore:`) recommended, not enforced

## Build order (see docs/ for the full rationale)

1. Migrations: `users` → `cases` → `case_stage_history` → `training_completions` → `dashboard_snapshot` view
2. Seed data
3. Auth module (JWT, roles)
4. Cases CRUD + stage transition endpoint
5. Dashboard endpoint (reads the materialized view)
6. React frontend, built against the working API
