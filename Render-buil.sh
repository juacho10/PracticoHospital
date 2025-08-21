#!/bin/bash
set -e

echo "➡️ Instalando dependencias..."
npm install

echo "➡️ Verificando conexión a la base de datos..."
node -e "
const { pool } = require('./config/database.js');
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Conexión a PostgreSQL exitosa');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error de conexión a PostgreSQL:', err.message);
    process.exit(1);
  });
"

echo "✅ Build completado"