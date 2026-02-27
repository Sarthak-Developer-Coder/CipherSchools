import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401 (expired / invalid token)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on home
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

/* ── Assignments ───────────────────────────────── */
export const fetchAssignments = () => API.get('/assignments');
export const fetchAssignment  = (id) => API.get(`/assignments/${id}`);

/* ── Query execution ───────────────────────────── */
export const executeQuery = (sql, assignmentId) =>
  API.post('/query/execute', { sql, assignmentId });

/* ── Sample data ───────────────────────────────── */
export const fetchSampleData = (table) =>
  API.get('/query/sample-data', { params: { table } });

/* ── LLM Hint ──────────────────────────────────── */
export const getHint = (question, userQuery, tables) =>
  API.post('/hint', { question, userQuery, tables });

/* ── Auth ──────────────────────────────────────── */
export const signup = (data) => API.post('/auth/signup', data);
export const login  = (data) => API.post('/auth/login', data);
export const getMe  = ()     => API.get('/auth/me');

export default API;
