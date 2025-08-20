#!/bin/bash
set -e

echo "➡️ Instalando dependencias..."
npm install

echo "➡️ Ejecutando migraciones..."
npm run migrate || echo "⚠️ Advertencia: Las migraciones fallaron, pero continuando..."

echo "✅ Build completado"