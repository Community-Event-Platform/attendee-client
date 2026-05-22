import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Always reject errors - let callers handle their own 401s
    return Promise.reject(error);
  }
);

// ==================== Auth APIs ====================

export const loginApi = (data) => {
  return api.post('/login', data);
};

export const registerApi = (data) => {
  return api.post('/register', data);
};

export const logoutApi = () => {
  return api.post('/logout');
};

// ==================== Event APIs ====================

export const getEvents = async () => {
  const response = await api.get('/events');
  return response.data?.data ?? response.data ?? [];
};

// ==================== User APIs ====================

export const getProfileApi = () => {
  return api.get('/user');
};

export default api;