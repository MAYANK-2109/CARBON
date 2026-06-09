import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Sends HttpOnly cookies (access/refresh tokens) automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Silent Token-Refresh Interceptor ────────────────────────────────────────
// When the server returns 401 (access token expired), we:
//   1. Call /auth/refresh using a *bare* axios instance (bypasses this interceptor)
//   2. Server sets a fresh accessToken cookie
//   3. Retry the original request
//   4. If refresh also fails, fire 'auth:logout' event → AuthContext clears state
//
// Concurrent 401s are queued so we only send one refresh request at a time.

interface PendingRequest {
  resolve: () => void;
  reject: (reason: unknown) => void;
}

let isRefreshing = false;
let failedQueue: PendingRequest[] = [];

function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve()
  );
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Attempt silent refresh only on 401, and only once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request; it will be retried after refresh completes
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use a plain axios call so this refresh request does NOT go through our
        // interceptor (otherwise a failed refresh would loop back here forever).
        await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Tell AuthContext to clear user state — ProtectedRoute will redirect once
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For all other errors, normalise into a consistent shape
    const message =
      error.response?.data?.message ||
      'An unexpected error occurred. Please try again.';
    const status = error.response?.status;
    const errors = error.response?.data?.errors;

    return Promise.reject({ message, status, errors, originalError: error });
  }
);
