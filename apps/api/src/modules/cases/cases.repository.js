const { pool, transaction } = require('../../db/pool');

async function findAll(filters) {
  const clauses = [];
  const values = [];

  if (filters.status) {
    values.push(filters.status);
    clauses.push(`status = $${values.length}`);
  }
  if (filters.case_type) {
    values.push(filters.case_type);
    clauses.push(`case_type = $${values.length}`);
  }
  if (filters.location) {
    values.push(filters.location);
    clauses.push(`location = $${values.length}`);
  }
  if (filters.department) {
    values.push(filters.department);
    clauses.push(`department = $${values.length}`);
  }
  if (filters.owner_id) {
    values.push(filters.owner_id);
    clauses.push(`owner_id = $${values.length}`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const { rows } = await pool.query(
    `SELECT * FROM cases ${where} ORDER BY deadline ASC NULLS LAST, created_at DESC`,
    values
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM cases WHERE id = $1', [id]);
  return rows[0] || null;
}

async function findStageHistory(caseId) {
  const { rows } = await pool.query(
    'SELECT * FROM case_stage_history WHERE case_id = $1 ORDER BY entered_at ASC',
    [caseId]
  );
  return rows;
}

async function create(data, actorId) {
  return transaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO cases
        (case_type, employee_id, department, location, date_raised, current_stage, owner_id, next_action, deadline)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        data.case_type, data.employee_id, data.department, data.location,
        data.date_raised, data.current_stage, data.owner_id, data.next_action || null, data.deadline || null,
      ]
    );
    const created = rows[0];
    await client.query(
      'INSERT INTO case_stage_history (case_id, stage, actor_id) VALUES ($1, $2, $3)',
      [created.id, created.current_stage, actorId]
    );
    return created;
  });
}

async function update(id, data) {
  const fields = ['next_action', 'deadline', 'outcome', 'status'];
  const clauses = [];
  const values = [];

  fields.forEach((field) => {
    if (data[field] !== undefined) {
      values.push(data[field]);
      clauses.push(`${field} = $${values.length}`);
    }
  });

  if (!clauses.length) return findById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE cases SET ${clauses.join(', ')}, updated_at = now() WHERE id = $${values.length} RETURNING *`,
    values
  );
  return rows[0];
}

// Transitions a case to a new stage. Closes the open stage-history row and
// opens a new one in the same transaction, so current_stage and the audit
// trail can never drift apart.
async function transitionStage(caseId, newStage, actorId) {
  return transaction(async (client) => {
    await client.query(
      `UPDATE case_stage_history SET exited_at = now()
       WHERE case_id = $1 AND exited_at IS NULL`,
      [caseId]
    );
    await client.query(
      'INSERT INTO case_stage_history (case_id, stage, actor_id) VALUES ($1, $2, $3)',
      [caseId, newStage, actorId]
    );
    const { rows } = await client.query(
      `UPDATE cases SET current_stage = $1, updated_at = now() WHERE id = $2 RETURNING *`,
      [newStage, caseId]
    );
    return rows[0];
  });
}

module.exports = { findAll, findById, findStageHistory, create, update, transitionStage };
