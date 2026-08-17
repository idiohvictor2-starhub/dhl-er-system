exports.seed = async function (knex) {
  const [c1] = await knex('cases').insert({
    case_type: 'grievance',
    employee_id: 'EMP-1042',
    department: 'Operations',
    location: 'Lagos',
    date_raised: '2026-07-01',
    current_stage: 'investigation',
    owner_id: 1,
    next_action: 'Complete investigation interviews',
    deadline: '2026-08-20',
    status: 'open',
  }).returning('id');

  const [c2] = await knex('cases').insert({
    case_type: 'disciplinary',
    employee_id: 'EMP-2210',
    department: 'Warehouse',
    location: 'Port Harcourt',
    date_raised: '2026-07-15',
    current_stage: 'hearing',
    owner_id: 4,
    next_action: 'Schedule disciplinary hearing',
    deadline: '2026-08-10', // deliberately in the past -> overdue example
    status: 'open',
  }).returning('id');

  const [c3] = await knex('cases').insert({
    case_type: 'union',
    employee_id: 'EMP-0087',
    department: 'HR',
    location: 'Lagos',
    date_raised: '2026-06-20',
    current_stage: 'closed',
    owner_id: 1,
    next_action: null,
    deadline: '2026-07-05',
    outcome: 'Resolved — salary review action point implemented',
    status: 'closed',
  }).returning('id');

  const caseIds = [c1, c2, c3].map((r) => (typeof r === 'object' ? r.id : r));

  await knex('case_stage_history').insert([
    { case_id: caseIds[0], stage: 'informal_resolution', entered_at: '2026-07-01', exited_at: '2026-07-05', actor_id: 1 },
    { case_id: caseIds[0], stage: 'formal_submission', entered_at: '2026-07-05', exited_at: '2026-07-10', actor_id: 1 },
    { case_id: caseIds[0], stage: 'investigation', entered_at: '2026-07-10', exited_at: null, actor_id: 1 },
    { case_id: caseIds[1], stage: 'query', entered_at: '2026-07-15', exited_at: '2026-07-20', actor_id: 4 },
    { case_id: caseIds[1], stage: 'employee_response', entered_at: '2026-07-20', exited_at: '2026-07-25', actor_id: 4 },
    { case_id: caseIds[1], stage: 'hearing', entered_at: '2026-07-25', exited_at: null, actor_id: 4 },
    { case_id: caseIds[2], stage: 'closed', entered_at: '2026-07-05', exited_at: null, actor_id: 1 },
  ]);

  await knex('jcc_meetings').insert({
    id: 1,
    meeting_date: '2026-07-30',
    attendees: 'ER Manager, Union Reps, HR Director',
    minutes_url: null,
  });

  await knex('meeting_action_points').insert({
    meeting_id: 1,
    description: 'Confirm salary review ratification timeline',
    owner_id: 1,
    deadline: '2026-08-25',
    status: 'open',
  });

  await knex('training_completions').insert([
    { employee_id: 2, training_module: 'Grievance Handling', completed_date: '2026-06-01', manager_id: 2, location: 'Lagos' },
    { employee_id: 4, training_module: 'Grievance Handling', completed_date: null, manager_id: 4, location: 'Port Harcourt' },
  ]);
};
