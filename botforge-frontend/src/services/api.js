import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
});

// Har request mein token add 
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getAdminUsers  = () => API.get('/admin/users');
export const getAdminStats  = () => API.get('/admin/stats');
export const updateUserPlan = (id, plan) => API.patch(`/admin/users/${id}/plan`, { plan });
export const toggleAdmin    = (id, is_admin) => API.patch(`/admin/users/${id}/admin`, { is_admin });
export const deleteUser     = (id) => API.delete(`/admin/users/${id}`);

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const getWebsites = () => API.get('/websites');
export const addWebsite = (data) => API.post('/websites', data);
export const getWebsite = (id) => API.get(`/websites/${id}`);
export const deleteWebsite = (id) => API.delete(`/websites/${id}`);
export const recrawlWebsite = (id) => API.post(`/websites/${id}/recrawl`);
export const getChunks = (id) => API.get(`/websites/${id}/chunks`);

export default API;