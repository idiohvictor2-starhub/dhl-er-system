// Materialized view so the dashboard never runs expensive aggregate
// queries live against the transactional `cases` table.
exports.up = function (knex) {
  return knex.raw(`
    CREATE MATERIALIZED VIEW dashboard_snapshot AS
    SELECT
      status,
      case_type,
      location,
      COUNT(*) AS count,
      AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 86400) AS avg_resolution_days,
      COUNT(*) FILTER (WHERE status = 'open' AND deadline < CURRENT_DATE) AS overdue_count
    FROM cases
    GROUP BY status, case_type, location;
  `);
};

exports.down = function (knex) {
  return knex.raw('DROP MATERIALIZED VIEW IF EXISTS dashboard_snapshot;');
};
