const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  }

  // Initialize database connection and create tables
  async init() {
    return new Promise((resolve, reject) => {
      const dbPath = path.join(__dirname, 'inventory.db');
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  // Create tables from schema
  async createTables() {
    return new Promise((resolve, reject) => {
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      this.db.exec(schema, (err) => {
        if (err) {
          console.error('Error creating tables:', err);
          reject(err);
        } else {
          console.log('Database tables created successfully');
          resolve();
        }
      });
    });
  }

  // Close database connection
  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }

  // User Management Methods

  // Create a new user (student or staff)
  async createUser(userData) {
    return new Promise(async (resolve, reject) => {
      try {
        const { userType, studentId, name, email, password, parentEmail, department, role } = userData;
        
        // Hash the password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        const sql = `
          INSERT INTO users (user_type, student_id, name, email, password_hash, parent_email, department, role)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        this.db.run(sql, [userType, studentId, name, email, passwordHash, parentEmail, department, role], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, ...userData });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Find user by email
  async findUserByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ? AND is_active = 1';
      this.db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Find user by student ID
  async findUserByStudentId(studentId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE student_id = ? AND is_active = 1';
      this.db.get(sql, [studentId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Find user by ID
  async findUserById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE id = ? AND is_active = 1';
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user last login
  async updateLastLogin(userId) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?';
      this.db.run(sql, [userId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Session Management

  // Create a new session
  async createSession(userId) {
    return new Promise((resolve, reject) => {
      const sessionToken = jwt.sign({ userId }, this.jwtSecret, { expiresIn: '7d' });
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      
      const sql = `
        INSERT INTO user_sessions (user_id, session_token, expires_at)
        VALUES (?, ?, ?)
      `;
      
      this.db.run(sql, [userId, sessionToken, expiresAt.toISOString()], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(sessionToken);
        }
      });
    });
  }

  // Validate session token
  async validateSession(sessionToken) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT u.*, s.expires_at 
        FROM users u 
        JOIN user_sessions s ON u.id = s.user_id 
        WHERE s.session_token = ? AND s.expires_at > datetime('now')
      `;
      
      this.db.get(sql, [sessionToken], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Delete session (logout)
  async deleteSession(sessionToken) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM user_sessions WHERE session_token = ?';
      this.db.run(sql, [sessionToken], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Clean expired sessions
  async cleanExpiredSessions() {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM user_sessions WHERE expires_at <= datetime('now')";
      this.db.run(sql, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Get all users (for admin)
  async getAllUsers() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, user_type, student_id, name, email, department, role, created_at, last_login FROM users WHERE is_active = 1';
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Update user
  async updateUser(userId, updateData) {
    return new Promise(async (resolve, reject) => {
      try {
        const fields = [];
        const values = [];
        
        if (updateData.name) {
          fields.push('name = ?');
          values.push(updateData.name);
        }
        if (updateData.email) {
          fields.push('email = ?');
          values.push(updateData.email);
        }
        if (updateData.department) {
          fields.push('department = ?');
          values.push(updateData.department);
        }
        if (updateData.role) {
          fields.push('role = ?');
          values.push(updateData.role);
        }
        if (updateData.password) {
          const passwordHash = await bcrypt.hash(updateData.password, 12);
          fields.push('password_hash = ?');
          values.push(passwordHash);
        }
        
        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(userId);
        
        const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        
        this.db.run(sql, values, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Deactivate user (soft delete)
  async deactivateUser(userId) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      this.db.run(sql, [userId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = Database;
