const pool = require('../config/database');

class Bed {
    // Método para obtener todas las camas
    static async getAll() {
        const [rows] = await pool.query(`
            SELECT b.*, 
                   COUNT(a.id) as is_occupied
            FROM beds b
            LEFT JOIN admissions a ON b.id = a.bed_id AND a.status = 'activa'
            GROUP BY b.id
            ORDER BY b.department, b.room_number, b.bed_number
        `);
        return rows;
    }

    // Método para actualizar el estado de una cama
    static async updateStatus(bedId, status) {
        await pool.query('UPDATE beds SET status = ? WHERE id = ?', [status, bedId]);
    }

    // Método para crear una nueva cama
    static async create(bedData) {
        const [result] = await pool.query('INSERT INTO beds SET ?', bedData);
        return result.insertId;
    }

    // Método para eliminar una cama
    static async delete(bedId) {
        await pool.query('DELETE FROM beds WHERE id = ?', [bedId]);
    }

    // Método para encontrar camas disponibles por departamento
    static async findAvailableByDepartment(department, gender) {
        // Considerar género solo para maternidad y pediatría
        let genderCondition = '';
        if (department === 'maternidad') {
            genderCondition = "AND p.gender = 'F'";
        } else if (department === 'pediatria') {
            // No hay restricción de género para pediatría
            genderCondition = '';
        }

        const [rows] = await pool.query(`
            SELECT b.* 
            FROM beds b
            LEFT JOIN admissions a ON b.id = a.bed_id AND a.status = 'activa'
            LEFT JOIN patients p ON a.patient_id = p.id
            WHERE b.department = ? 
            AND b.status = 'disponible'
            AND a.id IS NULL
            ${genderCondition}
            ORDER BY b.room_number, b.bed_number
        `, [department]);
        
        return rows;
    }

    // Método para asignar una cama
    static async assignBed(bedId, admissionId) {
        await pool.query('UPDATE admissions SET bed_id = ? WHERE id = ?', [bedId, admissionId]);
        await pool.query('UPDATE beds SET status = "ocupada" WHERE id = ?', [bedId]);
    }

    // Método para liberar una cama
    static async freeBed(bedId) {
        await pool.query('UPDATE beds SET status = "disponible" WHERE id = ?', [bedId]);
    }
}

module.exports = Bed;