import axios from 'axios';
import nookies from 'nookies';

export const createAPI = (baseURL: string) => {
  const api = axios.create({
    baseURL,
    withCredentials: true,
  });

  api.interceptors.request.use(
    (config) => {
      const { access_token } = nookies.get(null, 'access_token');
      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
        console.log(access_token)
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return api;
};