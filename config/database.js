const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false, // ✅ Necesario para Render PostgreSQL
    require: true
  } : false,
  connectionTimeoutMillis: 30000, // ✅ Aumentado a 30s
  idleTimeoutMillis: 60000,
  max: 10, // ✅ Más conexiones para producción
  min: 2
};

const pool = new Pool(poolConfig);

// Función de prueba de conexión mejorada
async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW() as current_time, current_user');
    console.log('✅ Conexión a PostgreSQL exitosa:', res.rows[0]);
    return true;
  } catch (err) {
    console.error('❌ Error de conexión a PostgreSQL:', err.message);
    return false;
  }
}

// Verificar conexión al iniciar
testConnection();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  testConnection
};