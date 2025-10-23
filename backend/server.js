const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'A2!g7Y1Js#s*ULu9b2azNe679F';

//middleware i think this is for security
app.use(cors());
app.use(express.json());

// set up sqlite database
const dbPath = process.env.DATABASE_URL || './inventory.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    // First, check if student_id column exists, if not, add it
    db.get("PRAGMA table_info(users)", (err, result) => {
        if (err) {
            console.error('Error checking table info:', err);
            return;
        }
        
        // Check if student_id column exists
        db.all("PRAGMA table_info(users)", (err, columns) => {
            if (err) {
                console.error('Error getting table info:', err);
                return;
            }
            
            const hasStudentId = columns.some(col => col.name === 'student_id');
            
            if (!hasStudentId) {
                console.log('Adding student_id column to existing users table...');
                db.run("ALTER TABLE users ADD COLUMN student_id TEXT", (err) => {
                    if (err) {
                        console.error('Error adding student_id column:', err);
                    } else {
                        console.log('student_id column added successfully');
                    }
                });
            }
        });
    });

    const schema = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_type TEXT NOT NULL CHECK (user_type IN ('student', 'staff', 'admin')),
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        student_id TEXT,
        parent_email TEXT,
        department TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
    );
    CREATE TABLE IF NOT EXISTS user_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        session_token TEXT UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        genre TEXT,
        isbn TEXT,
        availability_status TEXT DEFAULT 'available',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `;
    
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error creating tables:', err);
        } else {
            console.log('Tables created successfully');
        }
        
        // Create indexes after tables are created
        const indexSchema = `
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_student_id ON users(student_id);
        CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
        `;
        
        db.exec(indexSchema, (err) => {
            if (err) {
                console.error('Error creating indexes:', err);
            } else {
                console.log('Indexes created successfully');
            }
        });
    });
}

//helper function to verify JWT token
function verifyJWTToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (err) {
        console.error('Error verifying JWT token:', err);
        return null;
    }
}

//Database helper functions
async function findUserByEmail(email) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

async function findUserByStudentId(studentId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE student_id = ?';
        db.get(sql, [studentId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

async function createUser(userData) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO users (user_type, student_id, username, email, password_hash, parent_email, department, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.run(sql, [
            userData.userType,
            userData.studentId,
            userData.name,
            userData.email,
            userData.password_hash,
            userData.parentEmail,
            userData.department,
            userData.role
        ], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: this.lastID,
                    ...userData
                });
            }
        });
    });
}

// Attach helper functions to db object
db.findUserByEmail = findUserByEmail;
db.findUserByStudentId = findUserByStudentId;
db.createUser = createUser;

//Routes

    //Health check endpoint 
    app.get('/api/health', (req, res) => {
        res.json({ status: 'ok', message: 'Server is running'});
    });

    //Register new user
    app.post('/api/auth/register', async (req, res) => {
        try {
            const { userType, studentId, name, email, password, parentEmail, department, role, adminKeyword } = req.body;
            if (!userType || !name || !email || !password) {
                return res.status(400).json({ message: 'name, email, and password are required' });
            }
            if (userType === 'staff' && adminKeyword !== 'nickleback') {
                return res.status(400).json({ message: 'invalid staff keyword. Only authorized personnel can register as staff or admin.' });
            }
            const existingUser = await db.findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'user with this email already exists' });
            }
            if (userType === 'student' && studentId) {
                const existingStudent = await db.findUserByStudentId(studentId);
                if (existingStudent) {
                    return res.status(400).json({ message: 'student id already exists' });
                }
            }
            //Hash password
            const saltRounds = 12;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            const userData = {
                userType,
                studentId: userType === 'student' ? studentId : null,
                name,
                email,
                password_hash: passwordHash,
                parentEmail: userType === 'student' ? parentEmail : null,
                department: userType === 'staff' ? department : null,
                role: userType === 'staff' ? role : null
            };
            const newUser = await db.createUser(userData);
            const { password_hash, ...userResponse } = newUser;
            res.status(201).json({ message: 'User created successfully', user: userResponse });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    //Login user
    app.post('/api/auth/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'email and password are required' });
            }
            const user = await db.findUserByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'invalid credentials' });
            }
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'invalid credentials' });
            }

            //Create JWT token
            const sessionToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
            
            //store session in database
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
            db.run('INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)', [user.id, sessionToken, expiresAt], (err) => {
                if (err) {
                    console.error('Error storing session:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                
                //update last login
                db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id], (err) => {
                    if (err) {
                        console.error('Error updating last login:', err);
                    }
                    
                    //return user data (without password hash)
                    const userData = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        userType: user.user_type,
                        studentId: user.student_id,
                        department: user.department,
                        role: user.role,
                        lastLogin: user.last_login
                    };
                    res.json({ message: 'Login successful', user: userData, sessionToken });
                });
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });

//Validate session
app.post('/api/auth/validate', async (req, res) => {
    try {
        const { sessionToken } = req.body;
        if (!sessionToken) {
            return res.status(401).json({ message: 'Session token is required' });
        }
        const decoded = verifyJWTToken(sessionToken);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid or expired session' });
        }
        
        //check if session in database and is not expired
        const sql = 'SELECT u.*, s.expires_at FROM users u JOIN user_sessions s ON u.id = s.user_id WHERE s.session_token = ? AND s.expires_at > CURRENT_TIMESTAMP';
        db.get(sql, [sessionToken], (err, user) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (!user) {
                return res.status(401).json({ message: 'Invalid or expired session' });
            }
            const userData = {
                id: user.id,
                userType: user.user_type,
                studentId: user.student_id,
                name: user.name,
                email: user.email,
                department: user.department,
                role: user.role,
            };
            res.json({ message: 'Session validated', user: userData });
        });
    } catch (error) {
        console.error('Session validation error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//Logout user
app.post('/api/auth/logout', (req, res) => {
    try {
        const { sessionToken } = req.body;
        if (!sessionToken) {
            return res.status(401).json({ message: 'Session token is required' });
        }
        db.run('DELETE FROM user_sessions WHERE session_token = ?', [sessionToken], (err) => {
            if (err) {
                console.error('Error deleting session:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.json({ message: 'Logout successful' });
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Get all books
app.get('/api/books', (req, res) => {
  db.all('SELECT * FROM books', [], (err, books) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    res.json(books);
  });
});

// Add new book (requires authentication)
app.post('/api/books', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = verifyJWTToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { title, author, genre, isbn } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }

    const sql = 'INSERT INTO books (title, author, genre, isbn) VALUES (?, ?, ?, ?)';

    db.run(sql, [title, author, genre, isbn], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to add book', error: err.message });
      }

      res.status(201).json({
        message: 'Book added successfully',
        book: {
          id: this.lastID,
          title,
          author,
          genre,
          isbn
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
  console.log('Environment: ' + (process.env.NODE_ENV || 'development'));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});

