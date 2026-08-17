const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
  await knex('training_completions').del();
  await knex('meeting_action_points').del();
  await knex('jcc_meetings').del();
  await knex('redundancy_flags').del();
  await knex('case_type_detail').del();
  await knex('case_stage_history').del();
  await knex('cases').del();
  await knex('users').del();

  const passwordHash = await bcrypt.hash('changeme123', 10);

  await knex('users').insert([
    { id: 1, name: 'Adaeze Okafor', email: 'er.manager@dhl-example.com', password_hash: passwordHash, role: 'er_manager', department: 'HR', location: 'Lagos' },
    { id: 2, name: 'Tunde Bello', email: 'line.manager@dhl-example.com', password_hash: passwordHash, role: 'line_manager', department: 'Operations', location: 'Lagos' },
    { id: 3, name: 'Grace Effiong', name_dup: undefined, email: 'hr.director@dhl-example.com', password_hash: passwordHash, role: 'hr_director', department: 'HR', location: 'Lagos' },
    { id: 4, name: 'Chidi Nwosu', email: 'line.manager2@dhl-example.com', password_hash: passwordHash, role: 'line_manager', department: 'Warehouse', location: 'Port Harcourt' },
  ].map(({ name_dup, ...rest }) => rest));
};
