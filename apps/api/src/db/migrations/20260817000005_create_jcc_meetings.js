exports.up = function (knex) {
  return knex.schema
    .createTable('jcc_meetings', (table) => {
      table.increments('id').primary();
      table.date('meeting_date').notNullable();
      table.text('attendees');
      table.string('minutes_url', 500);
      table.timestamps(true, true);
    })
    .createTable('meeting_action_points', (table) => {
      table.increments('id').primary();
      table.integer('meeting_id').notNullable().references('id').inTable('jcc_meetings').onDelete('CASCADE');
      table.text('description').notNullable();
      table.integer('owner_id').references('id').inTable('users');
      table.date('deadline');
      table.enu('status', ['open', 'closed']).notNullable().defaultTo('open');
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('meeting_action_points').dropTable('jcc_meetings');
};
