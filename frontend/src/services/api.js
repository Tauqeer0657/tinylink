import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getBackendUrl = () => API_BASE_URL;

export const linkService = {
  createLink: async (data) => {
    const response = await api.post('/api/links', data);
    return response.data;
  },

  getAllLinks: async () => {
    const response = await api.get('/api/links');
    return response.data;
  },

  getLinkStats: async (code) => {
    const response = await api.get(`/api/links/${code}`);
    return response.data;
  },

  deleteLink: async (code) => {
    await api.delete(`/api/links/${code}`);
  },

  healthCheck: async () => {
    const response = await api.get('/healthz');
    return response.data;
  },
};

export default api;
