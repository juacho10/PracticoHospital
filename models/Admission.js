const pool = require('../config/database');

class Admission {
    static async create(admissionData) {
        const [result] = await pool.query('INSERT INTO admissions SET ?', admissionData);
        return result.insertId;
    }

    static async getAllActive() {
        const [rows] = await pool.query(`
            SELECT a.*, p.first_name, p.last_name, p.dni, p.gender,
                   b.room_number, b.bed_number, b.wing, b.department
            FROM admissions a
            JOIN patients p ON a.patient_id = p.id
            LEFT JOIN beds b ON a.bed_id = b.id
            WHERE a.status = 'activa'
            ORDER BY a.admission_date DESC
        `);
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM admissions WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, admissionData) {
        await pool.query('UPDATE admissions SET ? WHERE id = ?', [admissionData, id]);
    }

    static async discharge(id) {
        await pool.query('UPDATE admissions SET status = "alta" WHERE id = ?', [id]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM admissions WHERE id = ?', [id]);
    }
}

module.exports = Admission;