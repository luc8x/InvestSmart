import nookies from "nookies";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, refreshAccessToken } from "../Auth/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/token/refresh/")
    ) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();

      if (newToken && originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        nookies.destroy(null, "access_token", { path: "/" });
        nookies.destroy(null, "refresh_token", { path: "/" });
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
