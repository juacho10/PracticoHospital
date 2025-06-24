const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'his_hospital_gux1_user',
  host: process.env.DB_HOST || 'dpg-d1csl1re5dus73a9bbbg-a.oregon-postgres.render.com',
  database: process.env.DB_NAME || 'his_hospital_gux1',
  password: process.env.DB_PASSWORD || 'g8TGSFVZzH9soluTkyglkGBYKghdQoiL',
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false // Necesario para Render
  }
});

// Verificación de conexión
pool.query('SELECT NOW()')
  .then(res => console.log('✅ Conexión exitosa a PostgreSQL:', res.rows[0].now))
  .catch(err => console.error('❌ Error de conexión:', err));

module.exports = pool;