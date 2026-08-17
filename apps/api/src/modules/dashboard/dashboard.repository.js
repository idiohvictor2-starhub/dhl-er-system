const { pool } = require('../../db/pool');

// Reads from the materialized view, never the live cases table — keeps
// dashboard loads cheap regardless of how much case history accumulates.
async function getSnapshot() {
  const { rows } = await pool.query('SELECT * FROM dashboard_snapshot');
  return rows;
}

async function getOverdueCount() {
  // Overdue is time-sensitive so it's computed live against the small
  // "open" subset only — cheap because of the status/deadline index, not
  // because it reads the view.
  const { rows } = await pool.query(
    `SELECT COUNT(*) FROM cases WHERE status = 'open' AND deadline < CURRENT_DATE`
  );
  return Number(rows[0].count);
}

async function refresh() {
  await pool.query('REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_snapshot');
}

module.exports = { getSnapshot, getOverdueCount, refresh };
