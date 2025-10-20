import React, { useState } from 'react';
import booksData from './Inventory';
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
    parentEmail: ''
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
    if (!form.studentId || !form.name || !form.email || !form.parentEmail) {
      setError('All fields are required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentEmail)) {
      setError('Please enter a valid parent email');
      return;
    }

    setError('');
    onSignup(form);
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
                placeholder="Enter your student ID"
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
                placeholder="Enter your email address"
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
              />
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
            <button type="button" onClick={onBack} className="btn btn-secondary">
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
    department: '',
    role: 'staff'
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
    if (!form.name || !form.email || !form.department) {
      setError('All fields are required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email');
      return;
    }

    setError('');
    onSignup(form);
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
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
            <button type="button" onClick={onBack} className="btn btn-secondary">
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
  const [currentPage, setCurrentPage] = useState('catalog'); // 'catalog', 'signup', 'staffSignup', or 'addBook'
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [registeredStaff, setRegisteredStaff] = useState([]);

  // Group books by genre
  const booksByGenre = groupBooksByGenre(books);

  const handleSignup = (studentData) => {
    setRegisteredStudents([...registeredStudents, studentData]);
    alert(`Welcome, ${studentData.name}! You've been successfully registered.`);
    setCurrentPage('catalog'); // Return to catalog after signup
  };

  const handleStaffSignup = (staffData) => {
    setRegisteredStaff([...registeredStaff, staffData]);
    alert(`Welcome, ${staffData.name}! You've been successfully registered as ${staffData.role}.`);
    setCurrentPage('catalog'); // Return to catalog after signup
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

  // Render Add Book page
  if (currentPage === 'addBook') {
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
          
          <div className="btn-group">
            <button 
              onClick={() => setBooks(booksData)}
              className="btn btn-success"
            >
              🔄 Refresh Book List
            </button>
            <button 
              onClick={navigateToAddBook}
              className="btn btn-warning"
            >
              📚 Add New Book
            </button>
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