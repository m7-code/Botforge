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

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const getWebsites = () => API.get('/websites');
export const addWebsite = (data) => API.post('/websites', data);
export const getWebsite = (id) => API.get(`/websites/${id}`);
export const deleteWebsite = (id) => API.delete(`/websites/${id}`);
export const recrawlWebsite = (id) => API.post(`/websites/${id}/recrawl`);

export default API;