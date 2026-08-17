exports.up = (pgm) => {
  pgm.createTable('training_completions', {
    id: 'id',
    employee_id: { type: 'varchar(50)', notNull: true },
    training_module: { type: 'varchar(100)', notNull: true },
    completed_date: { type: 'date' },
    manager_id: { type: 'integer', references: 'users' },
    location: { type: 'varchar(100)', notNull: true },
  });

  pgm.createIndex('training_completions', ['manager_id', 'location']);
};

exports.down = (pgm) => {
  pgm.dropTable('training_completions');
};
