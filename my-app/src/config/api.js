// API configuration for different environments
const getApiUrl = () => {
  // Check if we're in development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }
  
  // For production, use environment variable or default
  return process.env.REACT_APP_API_URL || 'https://your-backend-url.railway.app';
};

export const API_BASE_URL = getApiUrl();
