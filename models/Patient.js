const { query } = require('../config/database');

class Patient {
  static async create(patientData) {
    try {
      const result = await query(
        `INSERT INTO patients (
          dni, first_name, last_name, birth_date,
          gender, address, phone, email, insurance
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id`,
        [
          patientData.dni,
          patientData.first_name,
          patientData.last_name,
          patientData.birth_date,
          patientData.gender,
          patientData.address || null,
          patientData.phone || null,
          patientData.email || null,
          patientData.insurance || null
        ]
      );
      return result.rows[0].id;
    } catch (error) {
      console.error('Error al crear paciente:', error);
      throw error;
    }
  }

static async findByDni(dni) {
  try {
    if (!dni || typeof dni !== 'string') {
      throw new Error('DNI no válido');
    }
    
    const cleanDni = dni.trim();
    const result = await query(
      'SELECT * FROM patients WHERE dni = $1',
      [cleanDni]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error en findByDni:', error);
    throw error;
  }
}
  static async findById(id) {
    try {
      const result = await query(
        'SELECT * FROM patients WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error al buscar paciente por ID:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const result = await query(
        'SELECT * FROM patients ORDER BY last_name, first_name'
      );
      return result.rows;
    } catch (error) {
      console.error('Error al obtener todos los pacientes:', error);
      throw error;
    }
  }

  static async update(id, patientData) {
    try {
      const fields = [];
      const values = [];
      let paramIndex = 1;
      
      for (const [key, value] of Object.entries(patientData)) {
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
        UPDATE patients
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;
      
      const result = await query(queryText, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await query('DELETE FROM patients WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      throw error;
    }
  }

  static async searchByDniOrName(searchTerm) {
    try {
      const result = await query(
        `SELECT * FROM patients
        WHERE dni ILIKE $1
        OR first_name ILIKE $1
        OR last_name ILIKE $1
        ORDER BY last_name, first_name`,
        [`%${searchTerm}%`]
      );
      return result.rows;
    } catch (error) {
      console.error('Error al buscar pacientes:', error);
      throw error;
    }
  }
}

module.exports = Patient;