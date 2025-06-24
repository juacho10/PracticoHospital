const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findByUsername(username) {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE username = $1 LIMIT 1', 
        [username]
      );
      return rows[0];
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      throw error;
    }
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(candidatePassword, hashedPassword);
  }

    static async getAll() {
        const [rows] = await pool.query('SELECT id, username, full_name, role, created_at FROM users ORDER BY full_name');
        return rows;
    }

    static async create(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const [result] = await pool.query('INSERT INTO users SET ?', {
            username: userData.username,
            password: hashedPassword,
            full_name: userData.full_name,
            role: userData.role
        });
        return result.insertId;
    }

    static async update(id, userData) {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        } else {
            delete userData.password;
        }
        
        await pool.query('UPDATE users SET ? WHERE id = ?', [userData, id]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT id, username, full_name, role, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = User;