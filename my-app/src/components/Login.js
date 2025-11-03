import React, { useState } from 'react';
import authService from '../services/authService';
import './Login.css';

function Login({ onLogin, onBack, onSwitchToSignup }) {
  const [form, setForm] = useState({
    email: '',
    password: ''
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
    if (!form.email || !form.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.login(form.email, form.password);
      
      if (result.success) {
        onLogin(result.user);
      } else {
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
        <h2 className="form-title">Login</h2>
        <form onSubmit={handleSubmit}>
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
                placeholder="Enter your SST student email address"
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
                placeholder="Enter your password"
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
              {loading ? 'Logging in...' : 'Login'}
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
          <div className="form-footer">
            <p>Don't have an account? 
              <button 
                type="button" 
                onClick={onSwitchToSignup}
                className="link-button"
                disabled={loading}
              >
                Sign up here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
