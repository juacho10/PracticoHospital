const { query, pool } = require('../config/database');

class Bed {
  static async getAll() {
    try {
      const result = await query(
        `SELECT b.*,
         COUNT(a.id) FILTER (WHERE a.status = 'activa') as is_occupied
         FROM beds b
         LEFT JOIN admissions a ON b.id = a.bed_id
         GROUP BY b.id
         ORDER BY b.department, b.room_number, b.bed_number`
      );
      return result.rows.map(row => ({
        ...row,
        status: row.is_occupied > 0 ? 'ocupada' : row.status
      }));
    } catch (error) {
      console.error('Error al obtener todas las camas:', error);
      throw error;
    }
  }

  static async updateStatus(bedId, status) {
    try {
      await query(
        'UPDATE beds SET status = $1 WHERE id = $2',
        [status, bedId]
      );
    } catch (error) {
      console.error('Error al actualizar estado de cama:', error);
      throw error;
    }
  }

  static async create(bedData) {
    try {
      const result = await query(
        `INSERT INTO beds (
          room_number, bed_number, wing, department, status
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id`,
        [
          bedData.room_number,
          bedData.bed_number,
          bedData.wing,
          bedData.department,
          bedData.status || 'disponible'
        ]
      );
      return result.rows[0].id;
    } catch (error) {
      console.error('Error al crear cama:', error);
      throw error;
    }
  }

  static async delete(bedId) {
    try {
      await query('DELETE FROM beds WHERE id = $1', [bedId]);
    } catch (error) {
      console.error('Error al eliminar cama:', error);
      throw error;
    }
  }

  static async findAvailableByDepartment(department, gender) {
    try {
      let queryText = `
        SELECT b.*
        FROM beds b
        LEFT JOIN admissions a ON b.id = a.bed_id AND a.status = 'activa'
        WHERE b.department = $1
        AND b.status = 'disponible'
        AND a.id IS NULL
      `;
      
      let params = [department];
      
      if (department === 'maternidad' && gender === 'F') {
        queryText += ` AND (SELECT p.gender FROM patients p JOIN admissions adm ON p.id = adm.patient_id WHERE adm.bed_id = b.id LIMIT 1) = 'F'`;
      }
      
      const result = await query(queryText, params);
      return result.rows;
    } catch (error) {
      console.error('Error al buscar camas disponibles:', error);
      throw error;
    }
  }

  static async assignBed(bedId, admissionId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // 1. Verificar que la cama esté disponible
      const bedCheck = await client.query(
        `SELECT status FROM beds WHERE id = $1 FOR UPDATE`,
        [bedId]
      );
      
      if (bedCheck.rows[0].status !== 'disponible') {
        throw new Error('La cama no está disponible');
      }
      
      // 2. Verificar que la admisión existe
      const admissionCheck = await client.query(
        `SELECT id FROM admissions WHERE id = $1 FOR UPDATE`,
        [admissionId]
      );
      
      if (admissionCheck.rows.length === 0) {
        throw new Error('Admisión no encontrada');
      }
      
      // 3. Actualizar la admisión con la cama
      await client.query(
        `UPDATE admissions SET bed_id = $1 WHERE id = $2`,
        [bedId, admissionId]
      );
      
      // 4. Actualizar el estado de la cama
      await client.query(
        `UPDATE beds SET status = 'ocupada' WHERE id = $1`,
        [bedId]
      );
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error en assignBed:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async countByStatus() {
    try {
      const result = await query(
        `SELECT status, COUNT(*)
         FROM beds
         GROUP BY status`
      );
      return result.rows;
    } catch (error) {
      console.error('Error al contar camas por estado:', error);
      throw error;
    }
  }
}

module.exports = Bed;