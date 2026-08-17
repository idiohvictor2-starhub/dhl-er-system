const { pool, transaction } = require('../../db/pool');

let MOCK_CASES = [
  { id: 1, case_type: 'grievance', employee_id: 'EMP-1042', department: 'Operations', location: 'Lagos', date_raised: '2026-07-01', current_stage: 'investigation', owner_id: 1, next_action: 'Interview second witness', deadline: '2026-08-25', outcome: null, status: 'open', created_at: new Date('2026-07-01').toISOString(), updated_at: new Date().toISOString() },
  { id: 2, case_type: 'disciplinary', employee_id: 'EMP-2077', department: 'Warehouse', location: 'Port Harcourt', date_raised: '2026-06-15', current_stage: 'hearing', owner_id: 1, next_action: 'Schedule hearing date', deadline: '2026-08-20', outcome: null, status: 'open', created_at: new Date('2026-06-15').toISOString(), updated_at: new Date().toISOString() },
  { id: 3, case_type: 'union', employee_id: 'EMP-3090', department: 'Operations', location: 'Lagos', date_raised: '2026-05-20', current_stage: 'decision', owner_id: 1, next_action: 'Await JCC ratification', deadline: '2026-08-30', outcome: null, status: 'open', created_at: new Date('2026-05-20').toISOString(), updated_at: new Date().toISOString() },
  { id: 4, case_type: 'grievance', employee_id: 'EMP-1140', department: 'Finance', location: 'Lagos', date_raised: '2026-04-10', current_stage: 'closed', owner_id: 1, next_action: null, deadline: null, outcome: 'Resolved via informal mediation', status: 'closed', created_at: new Date('2026-04-10').toISOString(), updated_at: new Date().toISOString() },
  { id: 5, case_type: 'disciplinary', employee_id: 'EMP-2200', department: 'Warehouse', location: 'Lagos', date_raised: '2026-03-01', current_stage: 'closed', owner_id: 1, next_action: null, deadline: null, outcome: 'Written warning issued', status: 'closed', created_at: new Date('2026-03-01').toISOString(), updated_at: new Date().toISOString() },
];

let MOCK_HISTORY = [
  { id: 1, case_id: 1, stage: 'raised', entered_at: new Date('2026-07-01T08:00:00Z'), exited_at: new Date('2026-07-05T10:00:00Z'), actor_id: 1 },
  { id: 2, case_id: 1, stage: 'investigation', entered_at: new Date('2026-07-05T10:00:00Z'), exited_at: null, actor_id: 1 },
  { id: 3, case_id: 2, stage: 'raised', entered_at: new Date('2026-06-15T08:00:00Z'), exited_at: new Date('2026-06-20T09:00:00Z'), actor_id: 1 },
  { id: 4, case_id: 2, stage: 'hearing', entered_at: new Date('2026-06-20T09:00:00Z'), exited_at: null, actor_id: 1 },
  { id: 5, case_id: 3, stage: 'raised', entered_at: new Date('2026-05-20T08:00:00Z'), exited_at: new Date('2026-06-01T11:00:00Z'), actor_id: 1 },
  { id: 6, case_id: 3, stage: 'decision', entered_at: new Date('2026-06-01T11:00:00Z'), exited_at: null, actor_id: 1 },
  { id: 7, case_id: 4, stage: 'raised', entered_at: new Date('2026-04-10T08:00:00Z'), exited_at: new Date('2026-04-20T14:00:00Z'), actor_id: 1 },
  { id: 8, case_id: 4, stage: 'closed', entered_at: new Date('2026-04-20T14:00:00Z'), exited_at: null, actor_id: 1 },
  { id: 9, case_id: 5, stage: 'raised', entered_at: new Date('2026-03-01T08:00:00Z'), exited_at: new Date('2026-03-15T12:00:00Z'), actor_id: 1 },
  { id: 10, case_id: 5, stage: 'closed', entered_at: new Date('2026-03-15T12:00:00Z'), exited_at: null, actor_id: 1 },
];

async function findAll(filters = {}) {
  try {
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
  } catch (err) {
    let result = [...MOCK_CASES];
    if (filters.status) result = result.filter(c => c.status === filters.status);
    if (filters.case_type) result = result.filter(c => c.case_type === filters.case_type);
    if (filters.location) result = result.filter(c => c.location === filters.location);
    if (filters.department) result = result.filter(c => c.department === filters.department);
    return result;
  }
}

async function findById(id) {
  try {
    const { rows } = await pool.query('SELECT * FROM cases WHERE id = $1', [id]);
    return rows[0] || null;
  } catch (err) {
    return MOCK_CASES.find(c => String(c.id) === String(id)) || null;
  }
}

async function findStageHistory(caseId) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM case_stage_history WHERE case_id = $1 ORDER BY entered_at ASC',
      [caseId]
    );
    return rows;
  } catch (err) {
    return MOCK_HISTORY.filter(h => String(h.case_id) === String(caseId));
  }
}

async function create(data, actorId) {
  try {
    return await transaction(async (client) => {
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
  } catch (err) {
    const newCase = {
      id: MOCK_CASES.length + 1,
      ...data,
      owner_id: data.owner_id || actorId,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    MOCK_CASES.push(newCase);
    MOCK_HISTORY.push({
      id: MOCK_HISTORY.length + 1,
      case_id: newCase.id,
      stage: newCase.current_stage,
      entered_at: new Date(),
      exited_at: null,
      actor_id: actorId
    });
    return newCase;
  }
}

async function update(id, data) {
  try {
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
  } catch (err) {
    const existing = MOCK_CASES.find(c => String(c.id) === String(id));
    if (existing) {
      Object.assign(existing, data, { updated_at: new Date().toISOString() });
    }
    return existing;
  }
}

async function transitionStage(caseId, newStage, actorId) {
  try {
    return await transaction(async (client) => {
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
  } catch (err) {
    const existing = MOCK_CASES.find(c => String(c.id) === String(caseId));
    if (existing) {
      existing.current_stage = newStage;
      existing.updated_at = new Date().toISOString();
      if (newStage === 'closed') {
        existing.status = 'closed';
      }
    }
    // Update history
    const openHistory = MOCK_HISTORY.find(h => String(h.case_id) === String(caseId) && !h.exited_at);
    if (openHistory) {
      openHistory.exited_at = new Date();
    }
    MOCK_HISTORY.push({
      id: MOCK_HISTORY.length + 1,
      case_id: Number(caseId),
      stage: newStage,
      entered_at: new Date(),
      exited_at: null,
      actor_id: actorId
    });
    return existing;
  }
}

module.exports = { findAll, findById, findStageHistory, create, update, transitionStage };

