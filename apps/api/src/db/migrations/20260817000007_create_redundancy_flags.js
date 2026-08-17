exports.up = function (knex) {
  return knex.schema.createTable('redundancy_flags', (table) => {
    table.increments('id').primary();
    table.integer('case_id').notNullable().references('id').inTable('cases').onDelete('CASCADE');
    table.boolean('union_consultation_done').notNullable().defaultTo(false);
    table.boolean('redeployment_steps_done').notNullable().defaultTo(false);
    table.text('flagged_reason');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('redundancy_flags');
};
