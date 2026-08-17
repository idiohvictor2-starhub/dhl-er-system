// Type-specific fields kept separate so the core `cases` table stays generic.
exports.up = function (knex) {
  return knex.schema.createTable('case_type_detail', (table) => {
    table.increments('id').primary();
    table.integer('case_id').notNullable().references('id').inTable('cases').onDelete('CASCADE');
    table.string('key', 100).notNullable();   // e.g. 'hearing_date', 'appeal_notes', 'union_reference'
    table.text('value');

    table.unique(['case_id', 'key']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('case_type_detail');
};
