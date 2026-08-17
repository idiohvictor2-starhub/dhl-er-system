require('dotenv').config();

module.exports = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'er_dev',
    password: process.env.DB_PASSWORD || 'er_dev',
    database: process.env.DB_NAME || 'er_case_system',
  },
  migrations: {
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  },
  pool: { min: 2, max: 10 },
};
