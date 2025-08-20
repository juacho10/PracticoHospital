const { query, pool } = require('../config/database');

class Admission {
  static async create(admissionData) {
    try {
      const result = await query(
        `INSERT INTO admissions (
          patient_id, admission_date, admission_type,
          referring_doctor, reason, bed_id, status, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id`,
        [
          admissionData.patient_id,
          admissionData.admission_date || new Date(),
          admissionData.admission_type,
          admissionData.referring_doctor || null,
          admissionData.reason,
          admissionData.bed_id || null,
          admissionData.status || 'activa',
          admissionData.created_by
        ]
      );
      return result.rows[0].id;
    } catch (error) {
      console.error('Error al crear admisión:', error);
      throw error;
    }
  }

  static async getAllActive() {
  try {
    const result = await query(
        `SELECT a.*, p.first_name, p.last_name, p.dni, p.gender,
         b.room_number, b.bed_number, b.wing, b.department
      FROM admissions a
      JOIN patients p ON a.patient_id = p.id
      LEFT JOIN beds b ON a.bed_id = b.id
      WHERE a.status = 'activa'
      ORDER BY a.admission_date DESC`
    );
    return result.rows;
  } catch (error) {
    console.error('Error al obtener admisiones activas:', error);
    throw error;
  }
}

  static async findById(id) {
    try {
      const result = await query(
        `SELECT a.*, p.first_name, p.last_name, p.dni
         FROM admissions a
         JOIN patients p ON a.patient_id = p.id
         WHERE a.id = $1`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error al buscar admisión por ID:', error);
      throw error;
    }
  }

  static async update(id, admissionData) {
    try {
      const fields = [];
      const values = [];
      let paramIndex = 1;
      
      for (const [key, value] of Object.entries(admissionData)) {
        if (value !== undefined) {
          fields.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      }
      
      if (fields.length === 0) {
        throw new Error('No se proporcionaron campos para actualizar');
      }
      
      values.push(id);
      const queryText = `
        UPDATE admissions
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
      `;
      
      await query(queryText, values);
    } catch (error) {
      console.error('Error al actualizar admisión:', error);
      throw error;
    }
  }
  static async discharge(id) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

      // 1. Obtener la admisión con bloqueo
    const admissionResult = await client.query(
        `SELECT * FROM admissions WHERE id = $1 FOR UPDATE`,
      [id]
    );
    
    if (admissionResult.rows.length === 0) {
        throw new Error('Admisión no encontrada');
    }
    
    const admission = admissionResult.rows[0];

    // 2. Actualizar estado de la admisión
    await client.query(
      `UPDATE admissions 
         SET status = 'alta', discharge_date = CURRENT_TIMESTAMP 
       WHERE id = $1`,
      [id]
    );

    // 3. Liberar la cama si estaba asignada
    if (admission.bed_id) {
      await client.query(
          `UPDATE beds SET status = 'disponible' WHERE id = $1`,
        [admission.bed_id]
      );
    }

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
      console.error('Error al dar de alta al paciente:', error);
    throw error;
  } finally {
    client.release();
  }
  }
}

module.exports = Admission;