import React, { useState, useEffect } from 'react';
import booksData from './Inventory';
import authService from './services/authService';
import Login from './components/Login';
import './App.css';
// Books data

// Helper function to group books by genre
function groupBooksByGenre(books) {
  return books.reduce((groups, book) => {
    const genre = book.Genre || 'Unknown';
    if (!groups[genre]) {
      groups[genre] = [];
    }
    groups[genre].push(book);
    return groups;
  }, {});
}

// Student Signup Component
function Signup({ onSignup, onBack }) {
  const [form, setForm] = useState({
    studentId: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    parentEmail: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (!form.studentId || !form.name || !form.email || !form.password || !form.confirmPassword || !form.parentEmail) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentEmail)) {
      setError('Please enter a valid parent email');
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match, please try again');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        userType: 'student',
        studentId: form.studentId,
        name: form.name,
        email: form.email,
        password: form.password,
        parentEmail: form.parentEmail
      };

      const result = await onSignup(userData);
      
      if (!result.success) {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="form-container fade-in-up">
        <h2 className="form-title">Student Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Student ID:
              <input
                type="text"
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your seven digit student ID (ex: 1234567)"
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Name:
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your full name"
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Email:
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your student email address (ex: 1234567@student.ssttx.org)"
              />
              <small className="form-help">Enter your student email address (ex: 1234567@student.ssttx.org)</small>
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Password:
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your password (min 6 characters)"
                disabled={loading}
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Confirm Password:
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Confirm your password"
                disabled={loading}
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Parent Email:
              <input
                type="email"
                name="parentEmail"
                value={form.parentEmail}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter parent's email address"
                disabled={loading}
              />
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            <button 
              type="button" 
              onClick={onBack} 
              className="btn btn-secondary"
              disabled={loading}
            >
              Back to Catalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Book Form Component
function AddBookForm({ onAddBook, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    genre: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.title || !form.author || !form.genre) {
      setError('All fields are required');
      return;
    }

    setError('');
    onAddBook(form);
    // Reset form after successful submission
    setForm({ title: '', author: '', genre: '' });
  };

  return (
    <div className="app-container">
      <div className="form-container fade-in-up">
        <h2 className="form-title">Add New Book to Catalog</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Book Title:
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter book title"
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Author:
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter author name"
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Genre:
              <input
                type="text"
                name="genre"
                value={form.genre}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter book genre (e.g., Fiction, Education, etc.)"
              />
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Add Book
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Staff/Admin Signup Component
function StaffSignup({ onSignup, onBack }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    role: 'staff',
    adminKeyword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword || !form.department) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Check staff keyword for both staff and admin roles
    if (form.adminKeyword !== 'nickleback') {
      setError('Invalid staff keyword. Please enter the correct keyword to register as staff or admin.');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        userType: 'staff',
        name: form.name,
        email: form.email,
        password: form.password,
        department: form.department,
        role: form.role,
        adminKeyword: form.adminKeyword
      };

      const result = await onSignup(userData);
      
      if (!result.success) {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="form-container fade-in-up">
        <h2 className="form-title">Staff/Admin Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Name:
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your full name"
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Email:
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your email address"
                disabled={loading}
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Password:
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your password (min 6 characters)"
                disabled={loading}
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Confirm Password:
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Confirm your password"
                disabled={loading}
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Department:
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                placeholder="e.g., Library, Administration"
                className="form-input"
                disabled={loading}
              />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Role:
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="form-select"
                disabled={loading}
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Staff Keyword:
              <input
                type="password"
                name="adminKeyword"
                value={form.adminKeyword}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter staff keyword"
                disabled={loading}
              />
              <small className="form-help">Enter the special keyword to register as staff or admin</small>
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            <button 
              type="button" 
              onClick={onBack} 
              className="btn btn-secondary"
              disabled={loading}
            >
              Back to Catalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [books, setBooks] = useState(booksData);
  const [currentPage, setCurrentPage] = useState('catalog'); // 'catalog', 'login', 'signup', 'staffSignup', or 'addBook'
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [registeredStaff, setRegisteredStaff] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication on app load
  useEffect(() => {
    const initAuth = async () => {
      const authResult = await authService.init();
      if (authResult) {
        setCurrentUser(authService.getCurrentUser());
        setIsAuthenticated(true);
      }
    };
    initAuth();
  }, []);

  // Group books by genre
  const booksByGenre = groupBooksByGenre(books);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentPage('catalog');
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentPage('catalog');
  };

  const handleSignup = async (userData) => {
    try {
      const result = await authService.register(userData);
      if (result.success) {
        setRegisteredStudents([...registeredStudents, result.user]);
        alert(`Welcome, ${result.user.name}! You've been successfully registered.`);
        setCurrentPage('catalog');
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const handleStaffSignup = async (userData) => {
    try {
      const result = await authService.register(userData);
      if (result.success) {
        setRegisteredStaff([...registeredStaff, result.user]);
        alert(`Welcome, ${result.user.name}! You've been successfully registered as ${result.user.role}.`);
        setCurrentPage('catalog');
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const handleAddBook = (bookData) => {
    const newBook = {
      title: bookData.title,
      author: bookData.author,
      Genre: bookData.genre
    };
    setBooks([...books, newBook]);
    alert(`Book "${bookData.title}" by ${bookData.author} has been added to the catalog!`);
    setCurrentPage('catalog'); // Return to catalog after adding book
  };

  const navigateToLogin = () => {
    setCurrentPage('login');
  };

  const navigateToSignup = () => {
    setCurrentPage('signup');
  };

  const navigateToStaffSignup = () => {
    setCurrentPage('staffSignup');
  };

  const navigateToAddBook = () => {
    setCurrentPage('addBook');
  };

  const navigateToCatalog = () => {
    setCurrentPage('catalog');
  };

  const switchToSignup = () => {
    setCurrentPage('signup');
  };

  // Render Login page
  if (currentPage === 'login') {
    return <Login onLogin={handleLogin} onBack={navigateToCatalog} onSwitchToSignup={switchToSignup} />;
  }

  // Render Add Book page (requires authentication)
  if (currentPage === 'addBook') {
    if (!isAuthenticated) {
      return <Login onLogin={handleLogin} onBack={navigateToCatalog} onSwitchToSignup={switchToSignup} />;
    }
    return <AddBookForm onAddBook={handleAddBook} onCancel={navigateToCatalog} />;
  }

  // Render Staff Signup page
  if (currentPage === 'staffSignup') {
    return <StaffSignup onSignup={handleStaffSignup} onBack={navigateToCatalog} />;
  }

  // Render Student Signup page
  if (currentPage === 'signup') {
    return <Signup onSignup={handleSignup} onBack={navigateToCatalog} />;
  }

  // Render Catalog page
  return (
    <div className="app-container">
      <div className="header">
        <div className="header-content">
          <h1>📚 Reading Inventory Catalog</h1>
          <h3>Welcome to the Digital Library</h3>
          <p className="team-credit">Created and maintained by Capstone Team</p>
          
          {/* Authentication Status */}
          {isAuthenticated && currentUser ? (
            <div className="user-info">
              <p>Welcome, {currentUser.name}! ({currentUser.user_type})</p>
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-prompt">
              <p>Please login or signup to access all features</p>
            </div>
          )}
          
          <div className="btn-group">
            <button 
              onClick={() => setBooks(booksData)}
              className="btn btn-success"
            >
              🔄 Refresh Book List
            </button>
            {isAuthenticated ? (
              <button 
                onClick={navigateToAddBook}
                className="btn btn-warning"
              >
                📚 Add New Book
              </button>
            ) : (
              <button 
                onClick={navigateToLogin}
                className="btn btn-warning"
              >
                🔐 Login to Add Books
              </button>
            )}
            <button 
              onClick={navigateToSignup}
              className="btn btn-primary"
            >
              👨‍🎓 Student Signup
            </button>
            <button 
              onClick={navigateToStaffSignup}
              className="btn btn-info"
            >
              👨‍💼 Admin/Staff Signup
            </button>
            {!isAuthenticated && (
              <button 
                onClick={navigateToLogin}
                className="btn btn-secondary"
              >
                🔑 Login
              </button>
            )}
          </div>
          
          <div className="stats">
            {registeredStudents.length > 0 && (
              <div className="stat-item stat-students">
                👥 Registered Students: {registeredStudents.length}
              </div>
            )}
            {registeredStaff.length > 0 && (
              <div className="stat-item stat-staff">
                👨‍💼 Registered Staff: {registeredStaff.length}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="main-content">
        {Object.keys(booksByGenre).sort().map((genre, genreIndex) => (
          <div key={genre} className="genre-section fade-in-up" style={{ animationDelay: `${genreIndex * 0.1}s` }}>
            <h3 className="genre-title">📖 {genre}</h3>
            <ul className="book-list">
              {booksByGenre[genre].map((book, idx) => (
                <li key={idx} className="book-item">
                  <div className="book-cover">
                    📖
                  </div>
                  <div className="book-info">
                    <h4 className="book-title">{book.title}</h4>
                    <p className="book-author">by {book.author}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        <div className="footer">
          <h1>💬 If you have any questions, please contact the staff.</h1>
          <h2>Made with ❤️ by Capstone Team</h2>
        </div>
      </div>
    </div>
  );
}

export default App;