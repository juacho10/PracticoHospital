const pool = require('../config/database');

class Patient {
    static async create(patientData) {
        const [result] = await pool.query('INSERT INTO patients SET ?', patientData);
        return result.insertId;
    }

    static async findByDni(dni) {
        const [rows] = await pool.query('SELECT * FROM patients WHERE dni = ?', [dni]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM patients WHERE id = ?', [id]);
        return rows[0];
    }

    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM patients ORDER BY last_name, first_name');
        return rows;
    }

    static async update(id, patientData) {
        await pool.query('UPDATE patients SET ? WHERE id = ?', [patientData, id]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM patients WHERE id = ?', [id]);
    }
}

module.exports = Patient;