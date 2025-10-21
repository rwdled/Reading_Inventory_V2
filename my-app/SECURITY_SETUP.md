# Reading Inventory Security Setup

This document explains how to set up and use the security features for the Reading Inventory system.

## Features Added

### 1. SQLite Database Security
- **User Authentication**: Secure login/logout system
- **Password Hashing**: Passwords are hashed using bcryptjs with salt rounds
- **Session Management**: JWT-based session tokens with expiration
- **User Types**: Support for Students, Staff, and Admin users
- **Data Validation**: Input validation and sanitization

### 2. User Management
- **Student Registration**: Students can register with student ID, name, email, password, and parent email
- **Staff Registration**: Staff can register with name, email, password, department, and role
- **Role-Based Access**: Different permissions for students, staff, and admin users
- **Secure Storage**: All user data is stored securely in SQLite database

### 3. Authentication System
- **Login/Logout**: Secure authentication with session management
- **Protected Routes**: Certain features require authentication
- **Session Persistence**: Users stay logged in across browser sessions
- **Automatic Logout**: Sessions expire after 7 days

## Database Schema

The system uses the following main tables:

### Users Table
- `id`: Primary key
- `user_type`: 'student', 'staff', or 'admin'
- `student_id`: Unique student identifier (for students only)
- `name`: User's full name
- `email`: Unique email address
- `password_hash`: Hashed password
- `parent_email`: Parent's email (for students only)
- `department`: Department (for staff only)
- `role`: 'staff' or 'admin' (for staff only)
- `is_active`: Account status
- `created_at`, `updated_at`, `last_login`: Timestamps

### User Sessions Table
- `id`: Primary key
- `user_id`: Foreign key to users table
- `session_token`: JWT session token
- `expires_at`: Session expiration time
- `created_at`: Session creation time

## How to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
# Start both React app and backend server
npm run dev

# Or start them separately:
# Terminal 1: Backend server
npm run server

# Terminal 2: React app
npm start
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Usage Guide

### For Students
1. **Registration**: Click "Student Signup" and fill in:
   - Student ID (unique identifier)
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Confirm Password
   - Parent Email

2. **Login**: Click "Login" and enter email/password

3. **Features**: Students can browse books and view the catalog

### For Staff/Admin
1. **Registration**: Click "Admin/Staff Signup" and fill in:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Confirm Password
   - Department
   - Role (Staff or Admin)
   - **Staff Keyword**: Enter the special keyword: `nickleback` (required for both staff and admin)

2. **Login**: Click "Login" and enter email/password

3. **Features**: 
   - Staff can add new books to the catalog
   - Admin has additional management capabilities
   - **Staff Access**: Only users with the correct staff keyword can register as staff or admin

## Security Features

### Password Security
- Passwords are hashed using bcryptjs with 12 salt rounds
- Minimum 6 character requirement
- Password confirmation validation

### Session Security
- JWT tokens with 7-day expiration
- Automatic session cleanup for expired tokens
- Secure session storage in database

### Data Validation
- Email format validation
- Required field validation
- Unique constraint enforcement (email, student ID)
- SQL injection prevention through parameterized queries

### Access Control
- Role-based permissions
- Protected routes for sensitive operations
- Authentication required for book management
- **Staff Keyword Protection**: Special keyword "nickleback" required for all staff and admin registrations
- Prevents unauthorized staff and admin account creation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/validate` - Validate session
- `POST /api/auth/logout` - Logout user

### User Management
- `GET /api/users` - Get all users (admin only)

## Database File Location
The SQLite database file is created at: `src/database/inventory.db`

## Environment Variables
You can set the following environment variables:
- `JWT_SECRET`: Secret key for JWT tokens (default: 'your-secret-key-change-in-production')
- `PORT`: Server port (default: 3001)

## Troubleshooting

### Common Issues
1. **Database Connection Error**: Ensure SQLite3 is properly installed
2. **Session Expired**: User needs to login again
3. **Email Already Exists**: Use a different email address
4. **Student ID Already Exists**: Use a different student ID

### Reset Database
To reset the database, delete the `src/database/inventory.db` file and restart the server.

## Security Best Practices

1. **Change JWT Secret**: Update the JWT_SECRET in production
2. **Use HTTPS**: Deploy with SSL/TLS encryption
3. **Regular Backups**: Backup the SQLite database regularly
4. **Monitor Sessions**: Clean up expired sessions periodically
5. **Input Validation**: All user inputs are validated and sanitized

## Production Deployment

For production deployment:
1. Set a strong JWT_SECRET environment variable
2. Use a production-grade database (PostgreSQL/MySQL) instead of SQLite
3. Implement rate limiting for API endpoints
4. Add logging and monitoring
5. Use HTTPS for all communications
6. Implement proper error handling and logging
