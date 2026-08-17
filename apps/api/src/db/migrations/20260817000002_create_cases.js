exports.up = function (knex) {
  return knex.schema.createTable('cases', (table) => {
    table.increments('id').primary();
    table.enu('case_type', ['grievance', 'disciplinary', 'union']).notNullable();
    table.string('employee_id', 50).notNullable();
    table.string('department', 100).notNullable();
    table.string('location', 100).notNullable();
    table.date('date_raised').notNullable();
    table.string('current_stage', 50).notNullable();
    table.integer('owner_id').references('id').inTable('users');
    table.text('next_action');
    table.date('deadline');
    table.text('outcome');
    table.enu('status', ['open', 'closed']).notNullable().defaultTo('open');
    table.timestamps(true, true);

    table.index('status');
    table.index('deadline');
    table.index(['location', 'department']);
    table.index('case_type');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('cases');
};
