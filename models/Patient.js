const pool = require('../config/database');

class Patient {
    static async create(patientData) {
        try {
            const [result] = await pool.query('INSERT INTO patients SET ?', patientData);
            return result.insertId;
        } catch (error) {
            console.error('Error al crear paciente:', error);
            throw error;
        }
    }

    static async findByDni(dni) {
        try {
            const [rows] = await pool.query('SELECT * FROM patients WHERE dni = ?', [dni]);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar paciente por DNI:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const [rows] = await pool.query('SELECT * FROM patients WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar paciente por ID:', error);
            throw error;
        }
    }

    static async getAll() {
        try {
            const [rows] = await pool.query('SELECT * FROM patients ORDER BY last_name, first_name');
            return rows;
        } catch (error) {
            console.error('Error al obtener todos los pacientes:', error);
            throw error;
        }
    }

    static async update(id, patientData) {
        try {
            await pool.query('UPDATE patients SET ? WHERE id = ?', [patientData, id]);
        } catch (error) {
            console.error('Error al actualizar paciente:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            await pool.query('DELETE FROM patients WHERE id = ?', [id]);
        } catch (error) {
            console.error('Error al eliminar paciente:', error);
            throw error;
        }
    }
}

module.exports = Patient;