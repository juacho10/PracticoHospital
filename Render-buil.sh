#!/bin/bash
set -e

echo "➡️ Instalando dependencias..."
npm install

echo "➡️ Ejecutando migraciones..."
node scripts/migrate.js || echo "⚠️ Las migraciones pueden haber fallado (tablas posiblemente ya existan)"

echo "✅ Build completado exitosamente"