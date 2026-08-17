exports.up = (pgm) => {
  pgm.createTable('case_stage_history', {
    id: 'id',
    case_id: { type: 'integer', notNull: true, references: 'cases', onDelete: 'CASCADE' },
    stage: { type: 'varchar(50)', notNull: true },
    entered_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    exited_at: { type: 'timestamptz' },
    actor_id: { type: 'integer', notNull: true, references: 'users' },
  });

  pgm.createIndex('case_stage_history', 'case_id');
};

exports.down = (pgm) => {
  pgm.dropTable('case_stage_history');
};
