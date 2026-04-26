import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://mpesa-gateway-ryzi.onrender.com/api/v1',
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// For external calls
export const gatewayApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://mpesa-gateway-ryzi.onrender.com/api',
});

export default api;
