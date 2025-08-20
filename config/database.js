const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { 
    rejectUnauthorized: false,
    require: true
  } : false,
  connectionTimeoutMillis: 10000, // Aumentado a 10 segundos
  idleTimeoutMillis: 30000,
  max: 5, // Conexiones máximas reducidas
  min: 1  // Conexiones mínimas
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