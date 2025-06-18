import axios from 'axios';
import nookies from 'nookies';

export const createAPI = (baseURL: string) => {
  const api = axios.create({
    baseURL,
    withCredentials: true,
  });

  api.interceptors.request.use((config) => {
    const cookies = nookies.get(null);
    const token = cookies.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};