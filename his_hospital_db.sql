-- his_hospital_db.sql
CREATE DATABASE IF NOT EXISTS his_hospital;
USE his_hospital;

-- Tabla de usuarios (personal del hospital)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin','recepcionista', 'enfermería', 'medicina') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pacientes
CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    gender ENUM('M', 'F', 'O') NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    insurance VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de camas/habitaciones
CREATE TABLE IF NOT EXISTS beds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL,
    bed_number VARCHAR(10) NOT NULL,
    wing VARCHAR(20) NOT NULL,
    department ENUM('medicina', 'cirugia', 'icu', 'pediatria', 'maternidad') NOT NULL,
    status ENUM('disponible', 'ocupada', 'en_mantenimiento') DEFAULT 'disponible',
    UNIQUE KEY unique_bed (room_number, bed_number)
);

-- Tabla de admisiones
CREATE TABLE IF NOT EXISTS admissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    admission_date DATETIME NOT NULL,
    admission_type ENUM('programada', 'emergencia', 'derivacion') NOT NULL,
    referring_doctor VARCHAR(100),
    reason TEXT,
    bed_id INT,
    status ENUM('activa', 'alta', 'transferida') DEFAULT 'activa',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (bed_id) REFERENCES beds(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

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