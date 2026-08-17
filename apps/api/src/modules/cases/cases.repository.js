const store = require('../../db/store');

async function findAll(filters = {}, user = {}) {
  let result = [...store.CASES];

  // RBAC Filtering
  if (user.role === 'employee') {
    // Employees can ONLY see their own submitted cases
    result = result.filter(c => c.employee_id === user.employee_id || (user.full_name && c.employee_name.includes(user.full_name)));
  } else if (user.role === 'line_manager') {
    // Line managers see cases in their department/location or assigned to them
    result = result.filter(c => c.department === user.department || c.manager_id === user.id || c.owner_id === user.id);
  }

  // Filter queries
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(c =>
      c.case_number.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      c.employee_name.toLowerCase().includes(q) ||
      c.employee_id.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q)
    );
  }
  if (filters.status) result = result.filter(c => c.status === filters.status);
  if (filters.case_type) result = result.filter(c => c.case_type === filters.case_type);
  if (filters.priority) result = result.filter(c => c.priority === filters.priority);
  if (filters.location) result = result.filter(c => c.location.toLowerCase().includes(filters.location.toLowerCase()));
  if (filters.department) result = result.filter(c => c.department.toLowerCase().includes(filters.department.toLowerCase()));

  // Sorting
  if (filters.sortBy === 'oldest') {
    result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else if (filters.sortBy === 'priority') {
    const pWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
    result.sort((a, b) => (pWeight[b.priority] || 0) - (pWeight[a.priority] || 0));
  } else if (filters.sortBy === 'deadline') {
    result.sort((a, b) => (a.sla_due_date || '9999').localeCompare(b.sla_due_date || '9999'));
  } else {
    // Default: newest first
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return result;
}

async function findById(id) {
  const caseItem = store.CASES.find(c => String(c.id) === String(id) || c.case_number === id);
  if (!caseItem) return null;

  const stageHistory = store.STAGE_HISTORY.filter(h => String(h.case_id) === String(caseItem.id));
  const actions = store.ACTIONS.filter(a => String(a.case_id) === String(caseItem.id));
  const documents = store.DOCUMENTS.filter(d => String(d.case_id) === String(caseItem.id));
  const communications = store.COMMUNICATIONS.filter(m => String(m.case_id) === String(caseItem.id));

  return {
    ...caseItem,
    stage_history: stageHistory,
    actions,
    documents,
    communications
  };
}

async function create(data, actor = {}) {
  const nextNum = String(store.CASES.length + 184).padStart(6, '0');
  const caseNumber = `IR-${new Date().getFullYear()}-${nextNum}`;

  const newCase = {
    id: store.CASES.length + 1,
    case_number: caseNumber,
    case_type: data.case_type || 'grievance',
    category: data.category || 'General Workplace Concern',
    subject: data.subject || 'New Industrial Relations Concern',
    description: data.description || '',
    employee_id: data.employee_id || actor.employee_id || 'DHL-EMP-9999',
    employee_name: data.employee_name || actor.name || actor.full_name || 'Staff Member',
    department: data.department || actor.department || 'Operations & Ground Courier',
    location: data.location || actor.location || 'Lagos Headquarters (Victoria Island)',
    priority: data.priority || 'medium',
    status: 'in_progress',
    current_stage: data.case_type === 'disciplinary' ? 'formal_submission' : 'informal_resolution',
    owner_id: 1,
    owner_name: 'Amaka Obi',
    manager_id: 4,
    manager_name: 'Tunde Bakare',
    next_action: 'Initial HR assessment and intake review',
    action_owner_id: 1,
    sla_due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    resolution_date: null,
    outcome: null,
    appeal_status: null,
    confidentiality: data.confidentiality || 'standard',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  store.CASES.unshift(newCase);

  store.STAGE_HISTORY.push({
    id: store.STAGE_HISTORY.length + 1,
    case_id: newCase.id,
    stage: newCase.current_stage,
    entered_at: new Date().toISOString(),
    exited_at: null,
    actor_name: actor.name || actor.full_name || 'System Auto-Intake',
    notes: 'Case officially raised in IRMS with unique identifier.'
  });

  store.AUDIT_LOGS.unshift({
    id: store.AUDIT_LOGS.length + 1,
    user_name: actor.name || actor.full_name || 'Staff Member',
    action: 'CASE_CREATED',
    entity_type: 'Case',
    entity_id: newCase.case_number,
    details: { case_type: newCase.case_type, priority: newCase.priority, location: newCase.location },
    ip_address: '127.0.0.1',
    created_at: new Date().toISOString()
  });

  return newCase;
}

async function transitionStage(caseId, newStage, actor = {}, notes = '') {
  const caseItem = store.CASES.find(c => String(c.id) === String(caseId));
  if (!caseItem) throw new Error('Case not found');

  const oldStage = caseItem.current_stage;
  caseItem.current_stage = newStage;
  caseItem.updated_at = new Date().toISOString();

  if (newStage === 'closed' || newStage === 'resolved') {
    caseItem.status = 'closed';
    caseItem.resolution_date = new Date().toISOString();
  }

  // Update open history item
  const openHistory = store.STAGE_HISTORY.find(h => String(h.case_id) === String(caseId) && !h.exited_at);
  if (openHistory) {
    openHistory.exited_at = new Date().toISOString();
  }

  store.STAGE_HISTORY.push({
    id: store.STAGE_HISTORY.length + 1,
    case_id: Number(caseId),
    stage: newStage,
    entered_at: new Date().toISOString(),
    exited_at: null,
    actor_name: actor.name || actor.full_name || 'IR Admin',
    notes: notes || `Case progressed from ${oldStage} to ${newStage}.`
  });

  store.AUDIT_LOGS.unshift({
    id: store.AUDIT_LOGS.length + 1,
    user_name: actor.name || actor.full_name || 'IR Admin',
    action: 'STAGE_TRANSITIONED',
    entity_type: 'Case',
    entity_id: caseItem.case_number,
    details: { from: oldStage, to: newStage, notes },
    ip_address: '127.0.0.1',
    created_at: new Date().toISOString()
  });

  return caseItem;
}

async function addAction(caseId, actionData, actor = {}) {
  const newAction = {
    id: store.ACTIONS.length + 1,
    case_id: Number(caseId),
    action_title: actionData.action_title,
    description: actionData.description || '',
    owner_name: actionData.owner_name || actor.name || 'Assigned Lead',
    owner_id: actionData.owner_id || actor.id || 1,
    due_date: actionData.due_date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: 'pending',
    priority: actionData.priority || 'medium'
  };
  store.ACTIONS.push(newAction);
  return newAction;
}

async function toggleAction(actionId, status) {
  const act = store.ACTIONS.find(a => String(a.id) === String(actionId));
  if (act) {
    act.status = status;
  }
  return act;
}

async function addDocument(caseId, docData, actor = {}) {
  const newDoc = {
    id: store.DOCUMENTS.length + 1,
    case_id: Number(caseId),
    document_name: docData.document_name,
    file_url: docData.file_url || `/documents/${docData.document_name}`,
    document_type: docData.document_type || 'evidence',
    file_size_kb: docData.file_size_kb || 350,
    uploaded_by_name: actor.name || actor.full_name || 'Staff Member',
    uploaded_at: new Date().toISOString()
  };
  store.DOCUMENTS.push(newDoc);
  return newDoc;
}

async function addCommunication(caseId, commData, actor = {}) {
  const newComm = {
    id: store.COMMUNICATIONS.length + 1,
    case_id: Number(caseId),
    sender_name: actor.name || actor.full_name || 'System User',
    sender_role: actor.role || 'employee',
    message: commData.message,
    is_internal: !!commData.is_internal,
    created_at: new Date().toISOString()
  };
  store.COMMUNICATIONS.push(newComm);
  return newComm;
}

module.exports = {
  findAll,
  findById,
  create,
  transitionStage,
  addAction,
  toggleAction,
  addDocument,
  addCommunication
};
