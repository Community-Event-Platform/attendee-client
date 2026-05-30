import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export { api };

export const loginApi = (data) => api.post('/login', data);
export const registerApi = (data) => api.post('/register', data);
export const logoutApi = () => api.post('/logout');
export const getEvents = async () => { const r = await api.get('/events'); return r.data?.data ?? r.data ?? []; };
export const getEventDetail = async (id) => { const r = await api.get('/events/' + id); return r.data?.data ?? r.data; };
export const registerEventApi = async (id) => { const r = await api.post('/events/' + id + '/register'); return r.data; };
export const submitReview = async (id, rating, comment) => { const r = await api.post('/events/' + id + '/reviews', { rating, comment }); return r.data; };
export const registerFreeEvent = async (eventId, additionalInfo = {}) => { const r = await api.post('/events/' + eventId + '/register/free', additionalInfo); return r.data; };
export const registerPaidEvent = async (eventId, quantity, paymentMethod = 'credit_card', additionalInfo = {}) => { const r = await api.post('/events/' + eventId + '/register/paid', { quantity, payment_method: paymentMethod, ...additionalInfo }); return r.data; };
export const getMyRegistrations = async () => { const r = await api.get('/registrations'); return r.data?.data ?? r.data ?? []; };
export const cancelRegistration = async (registrationId) => { const r = await api.post('/registrations/' + registrationId + '/cancel'); return r.data; };
export const checkRegistrationStatus = async (eventId) => { const r = await api.get('/events/' + eventId + '/registration-status'); return r.data; };
export const getProfileApi = () => api.get('/user');

export default api;