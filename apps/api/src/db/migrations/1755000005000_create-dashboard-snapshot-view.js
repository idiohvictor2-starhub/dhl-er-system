exports.up = (pgm) => {
  pgm.sql(`
    CREATE MATERIALIZED VIEW dashboard_snapshot AS
    SELECT
      status,
      case_type,
      location,
      COUNT(*) AS count,
      AVG(
        EXTRACT(EPOCH FROM (COALESCE(updated_at, now()) - created_at)) / 86400.0
      ) FILTER (WHERE status = 'closed') AS avg_resolution_days
    FROM cases
    GROUP BY status, case_type, location;
  `);
  // Unique index required for CONCURRENTLY refresh later
  pgm.sql(`
    CREATE UNIQUE INDEX dashboard_snapshot_unique
    ON dashboard_snapshot (status, case_type, location);
  `);
};

exports.down = (pgm) => {
  pgm.sql('DROP MATERIALIZED VIEW IF EXISTS dashboard_snapshot;');
};
