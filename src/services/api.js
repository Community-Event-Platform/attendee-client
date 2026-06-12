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

let authToken = null;
const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

const getAuthHeader = () => {
  const token = authToken || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Initialize Authorization header from storage when the module loads
const storedToken = localStorage.getItem('token');
if (storedToken) {
  setAuthToken(storedToken);
}

// Request interceptor - attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};
    const token = authToken || localStorage.getItem('token');
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

export const getEvents = async (params = {}) => {
  const response = await api.get('/events', { params });
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
  const response = await api.post(`/events/${eventId}/register`, additionalInfo, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const registerPaidEvent = async (eventId, quantity = 1, paymentMethod = 'credit_card', additionalInfo = {}) => {
  const payload = {
    quantity,
    payment_method: paymentMethod,
    ...additionalInfo,
  };
  const response = await api.post(`/events/${eventId}/register`, payload, {
    headers: getAuthHeader(),
  });
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

export const approveRegistration = async (registrationId) => {
  const response = await api.post(`/registrations/${registrationId}/approve`, {}, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const rejectRegistration = async (registrationId) => {
  const response = await api.post(`/registrations/${registrationId}/reject`, {}, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// ==================== User APIs ====================

export const getProfileApi = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};

export { setAuthToken };
export default api;