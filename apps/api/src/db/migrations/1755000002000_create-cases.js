exports.up = (pgm) => {
  pgm.createTable('cases', {
    id: 'id',
    case_type: { type: 'varchar(20)', notNull: true }, // grievance | disciplinary | union
    employee_id: { type: 'varchar(50)', notNull: true },
    department: { type: 'varchar(100)', notNull: true },
    location: { type: 'varchar(100)', notNull: true },
    date_raised: { type: 'date', notNull: true },
    current_stage: { type: 'varchar(50)', notNull: true },
    owner_id: { type: 'integer', notNull: true, references: 'users' },
    next_action: { type: 'text' },
    deadline: { type: 'date' },
    outcome: { type: 'text' },
    status: { type: 'varchar(20)', notNull: true, default: 'open' }, // open | closed
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createIndex('cases', 'status');
  pgm.createIndex('cases', 'deadline');
  pgm.createIndex('cases', ['location', 'department']);
  pgm.createIndex('cases', 'case_type');
};

exports.down = (pgm) => {
  pgm.dropTable('cases');
};
