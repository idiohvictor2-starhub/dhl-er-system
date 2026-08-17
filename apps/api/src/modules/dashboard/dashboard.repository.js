const { pool } = require('../../db/pool');

const MOCK_SNAPSHOT = [
  { status: 'open', case_type: 'grievance', location: 'Lagos', count: '1', avg_resolution_days: null },
  { status: 'open', case_type: 'disciplinary', location: 'Port Harcourt', count: '1', avg_resolution_days: null },
  { status: 'open', case_type: 'union', location: 'Lagos', count: '1', avg_resolution_days: null },
  { status: 'closed', case_type: 'grievance', location: 'Lagos', count: '1', avg_resolution_days: '10.0' },
  { status: 'closed', case_type: 'disciplinary', location: 'Lagos', count: '1', avg_resolution_days: '14.0' }
];

async function getSnapshot() {
  try {
    const { rows } = await pool.query('SELECT * FROM dashboard_snapshot');
    return rows;
  } catch (err) {
    return MOCK_SNAPSHOT;
  }
}

async function getOverdueCount() {
  try {
    const { rows } = await pool.query(
      `SELECT COUNT(*) FROM cases WHERE status = 'open' AND deadline < CURRENT_DATE`
    );
    return Number(rows[0].count);
  } catch (err) {
    return 1;
  }
}

async function refresh() {
  try {
    await pool.query('REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_snapshot');
  } catch (err) {
    // Ignore in mock mode
  }
}

module.exports = { getSnapshot, getOverdueCount, refresh };

