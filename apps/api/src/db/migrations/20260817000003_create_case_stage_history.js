exports.up = function (knex) {
  return knex.schema.createTable('case_stage_history', (table) => {
    table.increments('id').primary();
    table.integer('case_id').notNullable().references('id').inTable('cases').onDelete('CASCADE');
    table.string('stage', 50).notNullable();
    table.timestamp('entered_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('exited_at');
    table.integer('actor_id').references('id').inTable('users');

    table.index('case_id');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('case_stage_history');
};
