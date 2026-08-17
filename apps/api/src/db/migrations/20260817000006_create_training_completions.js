exports.up = function (knex) {
  return knex.schema.createTable('training_completions', (table) => {
    table.increments('id').primary();
    table.integer('employee_id').notNullable().references('id').inTable('users');
    table.string('training_module', 150).notNullable();
    table.date('completed_date');
    table.integer('manager_id').references('id').inTable('users');
    table.string('location', 100);

    table.index(['manager_id', 'location']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('training_completions');
};
