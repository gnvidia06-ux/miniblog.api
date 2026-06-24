
const { Pool } = require('pg');

const connectionString = 'postgresql://postgres:lLFvzoMvHKTkmVsIXYAMpFcitJVIjNCd@reseau.proxy.rlwy.net:45706/railway';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || connectionString,
  ssl: { rejectUnauthorized: false },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
  } else {
    console.log('✅ Conectado a PostgreSQL');
    release();
  }
});

module.exports = pool;