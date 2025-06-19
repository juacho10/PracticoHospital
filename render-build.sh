#!/bin/bash
echo "Instalando dependencias..."
npm install

echo "Configurando base de datos..."
if [ -f "his_hospital_db.sql" ]; then
  # Comandos para configurar la DB
  echo "Base de datos configurada"
fi

