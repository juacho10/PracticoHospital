const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findByUsername(username) {
    try {
      const result = await query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      
      if (!result.rows[0]) {
        console.log(`Usuario ${username} no encontrado`);
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error en findByUsername:', error);
      throw error;
    }
  }

  static async comparePassword(candidatePassword, hashedPassword) {
  try {
    if (!candidatePassword || !hashedPassword) {
      return false;
    }
    
    const cleanCandidate = candidatePassword.toString().trim();
    const result = await bcrypt.compare(cleanCandidate, hashedPassword);
    return result;
    
  } catch (error) {
    console.error('Error en comparePassword:', error);
    return false;
  }
}

  static async getAll() {
    try {
      const result = await query(
        'SELECT id, username, full_name, role FROM users ORDER BY full_name'
      );
      return result.rows;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  static async create(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const result = await query(
        `INSERT INTO users (username, password, full_name, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username, full_name, role`,
        [
          userData.username,
          hashedPassword,
          userData.full_name,
          userData.role
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  static async update(id, userData) {
    try {
      let queryText = '';
      let params = [];
      
      if (userData.password) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        queryText = `UPDATE users SET full_name = $1, role = $2, password = $3 WHERE id = $4`;
        params = [userData.full_name, userData.role, hashedPassword, id];
      } else {
        queryText = `UPDATE users SET full_name = $1, role = $2 WHERE id = $3`;
        params = [userData.full_name, userData.role, id];
      }
      
      await query(queryText, params);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await query('DELETE FROM users WHERE id = $1', [id]);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
}

module.exports = User;