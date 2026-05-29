import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;

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

export const getEvents = async () => {
  const response = await api.get('/events');
  return response.data?.data ?? response.data ?? [];
};

export const getEventDetail = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data?.data ?? response.data;
};

export const registerEventApi = async (id) => {
  const response = await api.post(`/events/${id}/register`);
  return response.data;
};
 
export const submitReview = async (id, rating, comment) => {
  const response = await api.post(`/events/${id}/reviews`, { rating, comment });
  return response.data;
};

// ==================== Registration APIs ====================

export const registerFreeEvent = async (eventId, additionalInfo = {}) => {
  const response = await api.post(`/events/${eventId}/register`, additionalInfo);
  return response.data;
};

export const registerPaidEvent = async (eventId, quantity = 1, paymentMethod = 'credit_card', additionalInfo = {}) => {
  const payload = {
    quantity,
    payment_method: paymentMethod,
    ...additionalInfo,
  };
  const response = await api.post(`/events/${eventId}/register`, payload);
  return response.data;
};

export const getMyRegistrations = async () => {
  const response = await api.get('/registrations');
  return response.data?.data ?? response.data ?? [];
};

export const cancelRegistration = async (registrationId) => {
  // Prefer PATCH /registrations/{id}/cancel; fallback to POST for compatibility
  try {
    return (await api.patch(`/registrations/${registrationId}/cancel`)).data;
  } catch (err) {
    const fallback = await api.post(`/registrations/${registrationId}/cancel`);
    return fallback.data;
  }
};

export const checkRegistrationStatus = async (eventId) => {
  const response = await api.get(`/events/${eventId}/registration-status`);
  return response.data;
};

// ==================== User APIs ====================

export const getProfileApi = () => {
  return api.get('/user');
};

export default api;