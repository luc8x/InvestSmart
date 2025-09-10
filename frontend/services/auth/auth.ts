import nookies from "nookies";
import api from "../Api/api";

export const getAccessToken = () => {
  const cookies = nookies.get(null);
  return cookies.access_token || null;
};

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = nookies.get(null, 'refresh_token');
    if (!refreshToken) return null;

    const { data } = await api.post("/token/refresh/", { refresh: refreshToken });
    const newAccess = data.access;

    nookies.set(null, 'access_token', newAccess, {
      maxAge: 60 * 15,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return newAccess;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};
