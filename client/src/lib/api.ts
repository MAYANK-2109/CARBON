import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for HttpOnly cookies (access/refresh tokens)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract server error message if available
    const message = error.response?.data?.message || 'An unexpected error occurred. Please try again.';
    const status = error.response?.status;
    const errors = error.response?.data?.errors;

    return Promise.reject({
      message,
      status,
      errors,
      originalError: error,
    });
  }
);
