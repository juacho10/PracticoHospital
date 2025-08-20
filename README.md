# Sistema de Admisión Hospitalaria (HIS Hospital)

Sistema de gestión hospitalaria para admisión de pacientes, asignación de camas y gestión de pacientes.

## Características Principales

Registro de pacientes nuevos y existentes
Asignación de camas/habitaciones
Gestión de admisiones hospitalarias
Roles de usuario (admin, recepcionista)
Búsqueda de pacientes por DNI
Dashboard administrativo
Sistema de autenticación seguro
Reportes de pacientes admitidos
Gestión de camas (disponibles/ocupadas/en mantenimiento)



## Requisitos Técnicos
Backend:

Node.js v16+ (recomendado v18 LTS)
NPM v8+ o Yarn v1.22+
MariaDB v10.6+ o MySQL v8.0+
Express.js v4.18+

Frontend:

Bootstrap v5.3+
Font Awesome v6.4+
Pug v3.0+
Chart.js (para gráficos estadísticos)

Desarrollo:

Git v2.30+
Nodemon (para desarrollo, opcional)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/his-hospital.git
cd his-hospital

## Instalación dependencias:
npm install
# o
yarn install

## Configurar base de datos:

Crear una base de datos MariaDB/MySQL llamada his_hospital
Importar la estructura desde his_hospital_db.sql:
mysql -u usuario -p his_hospital < his_hospital_db.sql
## Iniciar la aplicación:
npm start
# Para desarrollo con autorecarga:
npm run dev