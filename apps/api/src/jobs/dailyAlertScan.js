// Runs once daily (wired up via cron in production, or `node src/jobs/dailyAlertScan.js`
// locally). Deliberately a single scheduled scan rather than continuous
// polling — predictable, low load, and enough for deadline-driven alerts.
require('dotenv').config();
const { pool } = require('../db/pool');

async function scanApproachingDeadlines() {
  const { rows } = await pool.query(`
    SELECT id, case_type, employee_id, deadline
    FROM cases
    WHERE status = 'open'
      AND deadline IS NOT NULL
      AND deadline <= CURRENT_DATE + INTERVAL '3 days'
  `);

  rows.forEach((c) => {
    // Placeholder for real delivery (email/in-app notification insert).
    // Kept as a log statement here so the scaffold runs without an email
    // provider configured.
    console.log(`[ALERT] Case #${c.id} (${c.case_type}, ${c.employee_id}) nears deadline ${c.deadline}`);
  });

  return rows.length;
}

async function refreshDashboard() {
  await pool.query('REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_snapshot');
}

async function run() {
  const alertCount = await scanApproachingDeadlines();
  await refreshDashboard();
  console.log(`Daily scan complete. ${alertCount} case(s) flagged. Dashboard refreshed.`);
  await pool.end();
}

if (require.main === module) {
  run().catch((err) => {
    console.error('Daily alert scan failed:', err);
    process.exit(1);
  });
}

module.exports = { scanApproachingDeadlines, refreshDashboard };
