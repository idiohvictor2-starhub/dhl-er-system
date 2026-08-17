const { Pool } = require('pg');

// Single shared pool for the whole app — never create a new Pool per request.
// Keep max modest: this system runs low hundreds of active cases, not
// high-throughput traffic, so a small pool avoids exhausting Postgres
// connections while still handling concurrent requests comfortably.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  // Catches idle client errors so one bad connection doesn't crash the process
  console.error('Unexpected error on idle Postgres client', err);
});

async function transaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, transaction };
