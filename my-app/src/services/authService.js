// Authentication service for managing user sessions
class AuthService {
  constructor() {
    this.currentUser = null;
    this.sessionToken = localStorage.getItem('sessionToken');
  }

  // Initialize authentication service
  async init() {
    if (this.sessionToken) {
      try {
        const response = await fetch('/api/auth/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionToken: this.sessionToken })
        });
        
        if (response.ok) {
          const userData = await response.json();
          this.currentUser = userData;
          return true;
        } else {
          this.logout();
          return false;
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        this.logout();
        return false;
      }
    }
    return false;
  }

  // Login user
  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        this.currentUser = data.user;
        this.sessionToken = data.sessionToken;
        localStorage.setItem('sessionToken', this.sessionToken);
        return { success: true, user: data.user };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, user: data.user };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Logout user
  async logout() {
    if (this.sessionToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionToken: this.sessionToken })
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    this.currentUser = null;
    this.sessionToken = null;
    localStorage.removeItem('sessionToken');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null && this.sessionToken !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is admin
  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  // Check if user is staff
  isStaff() {
    return this.currentUser && (this.currentUser.role === 'staff' || this.currentUser.role === 'admin');
  }

  // Check if user is student
  isStudent() {
    return this.currentUser && this.currentUser.user_type === 'student';
  }

  // Get user type
  getUserType() {
    return this.currentUser ? this.currentUser.user_type : null;
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
