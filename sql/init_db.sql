-- Tabla de usuarios (personal del hospital)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'recepcionista', 'enfermería', 'medicina')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pacientes
CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  dni VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  birth_date DATE NOT NULL,
  gender VARCHAR(1) NOT NULL CHECK (gender IN ('M', 'F', 'O')),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  insurance VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de camas/habitaciones
CREATE TABLE IF NOT EXISTS beds (
  id SERIAL PRIMARY KEY,
  room_number VARCHAR(10) NOT NULL,
  bed_number VARCHAR(10) NOT NULL,
  wing VARCHAR(20) NOT NULL,
  department VARCHAR(20) NOT NULL CHECK (department IN ('medicina', 'cirugia', 'icu', 'pediatria', 'maternidad')),
  status VARCHAR(20) DEFAULT 'disponible' CHECK (status IN ('disponible', 'ocupada', 'en_mantenimiento')),
  CONSTRAINT unique_bed UNIQUE (room_number, bed_number)
);

-- Tabla de admisiones
CREATE TABLE IF NOT EXISTS admissions (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  admission_date TIMESTAMP NOT NULL,
  admission_type VARCHAR(20) NOT NULL CHECK (admission_type IN ('programada', 'emergencia', 'derivacion')),
  referring_doctor VARCHAR(100),
  reason TEXT,
  bed_id INTEGER REFERENCES beds(id),
  status VARCHAR(20) DEFAULT 'activa' CHECK (status IN ('activa', 'alta', 'transferida')),
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para sesiones (necesaria para connect-pg-simple)
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- Insertar datos iniciales
-- Usuario administrador (contraseña: admin123)
INSERT INTO users (username, password, full_name, role) 
VALUES ('admin', '$2a$10$CkTLUohziL.OHr/.pLiWzOKhtvBpkSSeiPsmEn.ekgWHAvNBe8khm', 'Administrador Principal', 'admin');

-- Insertar algunas camas de ejemplo
INSERT INTO beds (room_number, bed_number, wing, department, status) VALUES
('101', 'A', 'Norte', 'medicina', 'disponible'),
('101', 'B', 'Norte', 'medicina', 'disponible'),
('102', 'A', 'Norte', 'medicina', 'disponible'),
('102', 'B', 'Norte', 'medicina', 'disponible'),
('103', 'A', 'Norte', 'medicina', 'disponible'),
('103', 'B', 'Norte', 'medicina', 'disponible'),
('201', 'A', 'Sur', 'cirugia', 'disponible'),
('201', 'B', 'Sur', 'cirugia', 'disponible'),
('202', 'A', 'Sur', 'cirugia', 'disponible'),
('202', 'B', 'Sur', 'cirugia', 'disponible'),
('203', 'A', 'Sur', 'cirugia', 'disponible'),
('203', 'B', 'Sur', 'cirugia', 'disponible'),
('301', 'A', 'Este', 'icu', 'disponible'),
('301', 'B', 'Este', 'icu', 'disponible'),
('302', 'A', 'Este', 'icu', 'disponible'),
('302', 'B', 'Este', 'icu', 'disponible'),
('303', 'A', 'Este', 'icu', 'disponible'),
('303', 'B', 'Este', 'icu', 'disponible'),
('401', 'A', 'Oeste', 'pediatria', 'disponible'),
('401', 'B', 'Oeste', 'pediatria', 'disponible'),
('402', 'A', 'Oeste', 'pediatria', 'disponible'),
('402', 'B', 'Oeste', 'pediatria', 'disponible'),
('403', 'A', 'Oeste', 'pediatria', 'disponible'),
('403', 'B', 'Oeste', 'pediatria', 'disponible'),
('501', 'A', 'Oeste', 'maternidad', 'disponible'),
('501', 'B', 'Oeste', 'maternidad', 'disponible'),
('502', 'A', 'Oeste', 'maternidad', 'disponible'),
('502', 'B', 'Oeste', 'maternidad', 'disponible'),
('503', 'A', 'Oeste', 'maternidad', 'disponible'),
('503', 'B', 'Oeste', 'maternidad', 'disponible');