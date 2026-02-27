const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT) || 5432,
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '',
  database: process.env.PG_DATABASE || 'ciphersql_sandbox',
  max: 10,                       // connection-pool limit
  statement_timeout: 5000,       // kill slow queries after 5 s
});

module.exports = pool;
