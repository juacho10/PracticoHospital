const pool = require('../config/database');

class Bed {
    static async findAvailableByDepartment(department, patientGender) {
        let query = `
            SELECT b.*
            FROM beds b
            LEFT JOIN admissions a ON b.id = a.bed_id AND a.status = 'activa'
            WHERE b.department = ? AND b.status = 'disponible' AND a.id IS NULL
        `;

        const [rows] = await pool.query(query, [department]);
        
        const availableBeds = [];
        for (const bed of rows) {
            const isSingleBed = !bed.bed_number.includes('B');
            
            if (isSingleBed) {
                availableBeds.push(bed);
            } else {
                const roomMateQuery = `
                SELECT p.gender
                    FROM admissions a
                    JOIN patients p ON a.patient_id = p.id
                    WHERE a.bed_id IN (
                        SELECT id FROM beds
                        WHERE room_number = ? AND bed_number != ?
                    )
                    AND a.status = 'activa'
                `;
                
                const [roommates] = await pool.query(roomMateQuery, [bed.room_number, bed.bed_number]);
                
                if (roommates.length === 0 || roommates[0].gender === patientGender) {
                    availableBeds.push(bed);
                }
            }
        }
        
        return availableBeds;
    }

    static async assignBed(bedId, admissionId) {
        await pool.query('UPDATE beds SET status = "ocupada" WHERE id = ?', [bedId]);
        await pool.query('UPDATE admissions SET bed_id = ? WHERE id = ?', [bedId, admissionId]);
    }

    static async freeBed(bedId) {
        await pool.query('UPDATE beds SET status = "disponible" WHERE id = ?', [bedId]);
    }
}

module.exports = Bed;