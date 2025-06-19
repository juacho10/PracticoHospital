#!/bin/bash
echo "--- Instalando dependencias ---"
npm install

echo "--- Creando estructura de base de datos ---"
if [ -f "his_hospital_db.sql" ]; then
  npx sequelize-cli db:migrate
  # O alternativamente:
  # mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < his_hospital_db.sql
fi

echo "--- Build completado ---"