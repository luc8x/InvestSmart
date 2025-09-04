import axios from 'axios';
import nookies from 'nookies';

export const createAPI = (baseURL: string) => {
  const api = axios.create({
    baseURL,
    withCredentials: true,
  });

  api.interceptors.request.use(
    (config) => {
      const publicEndpoints = ['register/', 'login/'];
      const isPublicEndpoint = publicEndpoints.some(endpoint => 
        config.url?.includes(endpoint)
      ) || (config.method === 'post' && (config.url === '' || config.url === '/'));
      if (!isPublicEndpoint) {
        const { access_token } = nookies.get(null, 'access_token');
        if (access_token) {
          config.headers.Authorization = `Bearer ${access_token}`;
        }
      } else {
        delete config.headers.Authorization;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return api;
};