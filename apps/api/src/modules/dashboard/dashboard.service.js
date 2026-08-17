const knex = require('../../db/knex');

// Reads from the materialized view, never the live `cases` table —
// this is what keeps the dashboard cheap regardless of case volume.
async function getSnapshot() {
  return knex('dashboard_snapshot').select('*');
}

async function refreshSnapshot() {
  await knex.raw('REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_snapshot;');
}

module.exports = { getSnapshot, refreshSnapshot };
