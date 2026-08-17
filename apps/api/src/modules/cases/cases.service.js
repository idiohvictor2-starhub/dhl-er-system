const repo = require('./cases.repository');

const CASE_TYPES = ['grievance', 'disciplinary', 'union'];

function validateNewCase(data) {
  const required = ['case_type', 'employee_id', 'department', 'location', 'date_raised', 'current_stage', 'owner_id'];
  const missing = required.filter((f) => !data[f]);
  if (missing.length) {
    const err = new Error(`Missing required fields: ${missing.join(', ')}`);
    err.status = 400;
    throw err;
  }
  if (!CASE_TYPES.includes(data.case_type)) {
    const err = new Error(`case_type must be one of: ${CASE_TYPES.join(', ')}`);
    err.status = 400;
    throw err;
  }
}

// Scopes what a caller can see based on role — line managers only see their
// own department/location, ER Manager and HR Director see everything.
function scopeFilters(user, requestedFilters) {
  const filters = { ...requestedFilters };
  if (user.role === 'line_manager') {
    filters.department = user.department;
    filters.location = user.location;
  }
  return filters;
}

async function listCases(user, requestedFilters) {
  const filters = scopeFilters(user, requestedFilters);
  return repo.findAll(filters);
}

async function getCase(id) {
  const found = await repo.findById(id);
  if (!found) {
    const err = new Error('Case not found');
    err.status = 404;
    throw err;
  }
  const history = await repo.findStageHistory(id);
  return { ...found, stage_history: history };
}

async function createCase(data, actorId) {
  validateNewCase(data);
  return repo.create(data, actorId);
}

async function updateCase(id, data) {
  await getCase(id); // 404s if missing
  return repo.update(id, data);
}

async function moveStage(id, newStage, actorId) {
  await getCase(id);
  if (!newStage) {
    const err = new Error('stage is required');
    err.status = 400;
    throw err;
  }
  return repo.transitionStage(id, newStage, actorId);
}

module.exports = { listCases, getCase, createCase, updateCase, moveStage };
