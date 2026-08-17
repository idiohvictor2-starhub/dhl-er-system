// Run with: npm run seed --workspace=apps/api
// Populates believable dev data so you're building the dashboard and case
// list against real shapes, not empty tables.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../pool');

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const passwordHash = await bcrypt.hash('password123', 10);

    const { rows: users } = await client.query(
      `INSERT INTO users (name, email, password_hash, role, department, location)
       VALUES
        ('Amaka Obi', 'amaka.obi@dhl-er.local', $1, 'er_manager', 'Employee Relations', 'Lagos'),
        ('Tunde Bakare', 'tunde.bakare@dhl-er.local', $1, 'line_manager', 'Operations', 'Lagos'),
        ('Grace Effiong', 'grace.effiong@dhl-er.local', $1, 'line_manager', 'Warehouse', 'Port Harcourt'),
        ('Chinedu Eze', 'chinedu.eze@dhl-er.local', $1, 'hr_director', 'HR', 'Lagos')
       RETURNING id, role`,
      [passwordHash]
    );

    const erManager = users.find((u) => u.role === 'er_manager').id;
    const lineManagerLagos = users.find((u) => u.role === 'line_manager' && u.id).id;

    const cases = [
      ['grievance', 'EMP-1042', 'Operations', 'Lagos', '2026-07-01', 'investigation', erManager, 'Interview second witness', '2026-08-25', null, 'open'],
      ['disciplinary', 'EMP-2077', 'Warehouse', 'Port Harcourt', '2026-06-15', 'hearing', erManager, 'Schedule hearing date', '2026-08-20', null, 'open'],
      ['union', 'EMP-3090', 'Operations', 'Lagos', '2026-05-20', 'decision', erManager, 'Await JCC ratification', '2026-08-30', null, 'open'],
      ['grievance', 'EMP-1140', 'Finance', 'Lagos', '2026-04-10', 'closed', erManager, null, null, 'Resolved via informal mediation', 'closed'],
      ['disciplinary', 'EMP-2200', 'Warehouse', 'Lagos', '2026-03-01', 'closed', erManager, null, null, 'Written warning issued', 'closed'],
    ];

    for (const c of cases) {
      const { rows } = await client.query(
        `INSERT INTO cases
          (case_type, employee_id, department, location, date_raised, current_stage, owner_id, next_action, deadline, outcome, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         RETURNING id`,
        c
      );
      await client.query(
        `INSERT INTO case_stage_history (case_id, stage, actor_id) VALUES ($1, $2, $3)`,
        [rows[0].id, c[5], erManager]
      );
    }

    await client.query('COMMIT');
    console.log(`Seeded ${users.length} users and ${cases.length} cases.`);
    console.log('Login with any seeded email + password: password123');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
