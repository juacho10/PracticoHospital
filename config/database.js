const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Verificar conexión a la base de datos
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Error al conectar a PostgreSQL:', err);
  } else {
    console.log('Conexión a PostgreSQL establecida correctamente');
  }
});

module.exports = pool;


