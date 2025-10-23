# Reading Inventory Backend API

A Node.js/Express backend API for managing a reading inventory system with user authentication and book management.

## Features

- User authentication (JWT-based)
- User registration and login
- Book inventory management
- SQLite database
- CORS enabled
- Session management

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/validate` - Validate session

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Add new book (requires authentication)

### Health Check
- `GET /api/health` - Server health check

## Deployment on Railway

### Prerequisites
1. Railway account
2. Railway CLI installed (`npm install -g @railway/cli`)

### Steps

1. **Login to Railway**
   ```bash
   railway login
   ```

2. **Initialize Railway project**
   ```bash
   cd backend
   railway init
   ```

3. **Deploy to Railway**
   ```bash
   railway up
   ```

4. **Set Environment Variables** (in Railway dashboard)
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: production
   - `PORT`: Will be set automatically by Railway

5. **Access your API**
   - Railway will provide you with a URL like `https://your-app-name.railway.app`
   - Health check: `https://your-app-name.railway.app/api/health`

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Server will run on** `http://localhost:3001`

## Environment Variables

- `PORT`: Server port (default: 3001)
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Environment (development/production)
- `DATABASE_URL`: Database file path (optional)

## Database Schema

The application uses SQLite with the following tables:
- `users`: User accounts and authentication
- `user_sessions`: Active user sessions
- `books`: Book inventory

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Input validation
- SQL injection protection with parameterized queries
