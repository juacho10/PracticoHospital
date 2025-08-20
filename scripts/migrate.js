require('dotenv').config();
const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false,
    require: true
  } : false
});

async function runMigrations() {
  const client = await pool.connect().catch(err => {
    console.error('❌ Error al conectar a PostgreSQL:', err);
    process.exit(1);
  });

  try {
    console.log('🚀 Ejecutando migraciones...');
    await client.query('BEGIN');
    
    // Usamos el SQL directamente en el código
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      full_name VARCHAR(100) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'recepcionista', 'enfermería', 'medicina')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Resto de tu SQL aquí...
    -- Copia todo el contenido SQL que compartiste
    `;
    
    await client.query(sql);
    await client.query('COMMIT');
    console.log('✅ Migración completada con éxito');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error durante la migración:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();