const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'dpg-d1csl1re5dus73a9bbbg-a.oregon-postgres.render.com',
    user: process.env.DB_USER || 'his_hospital_gux1_user',
    password: process.env.DB_PASSWORD || 'g8TGSFVZzH9soluTkyglkGBYKghdQoiL',
    database: process.env.DB_NAME || 'his_hospital_gux1',
    port: process.env.DB_PORT || 5432,
    ssl: {
        rejectUnauthorized: false // Necesario para Render
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificación de conexión
pool.getConnection()
    .then(conn => {
        console.log('✅ Conexión exitosa a la base de datos');
        conn.release();
    })
    .catch(err => {
        console.error('❌ Error de conexión:', err);
    });

module.exports = pool;


