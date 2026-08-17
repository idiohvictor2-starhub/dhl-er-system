# Architecture notes

See `ER_Case_Management_Project_Plan.docx` for the full plan. Quick reference for this scaffold:

- **Database:** PostgreSQL. Single instance locally (Docker), managed Postgres with automated backups + point-in-time recovery in production.
- **Dashboard reads:** always from `dashboard_snapshot` (materialized view), refreshed by the daily cron job — never live aggregate queries against `cases`.
- **Stage transitions:** always via `cases.repository.transitionStage`, wrapped in a DB transaction — never update `current_stage` directly without writing to `case_stage_history`.
- **Auth:** JWT, 8h expiry. Role scoping (`line_manager` sees only their department/location) is enforced in `cases.service.scopedFilters` — extend this pattern for any new module.
- **Alerts:** daily cron (`node-cron`), not real-time polling. Currently logs to console — next step is a `notifications` table + email delivery.
