import { api } from '@/services/Api/api';
import nookies from 'nookies';

export const login = async (cpf: string, password: string) => {
    const { data } = await api.post("/users/login/", { cpf, password });
    if (data.success) {
            nookies.set(null, "access_token", data.data.access, {
                maxAge: 60 * 15,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
            });

        if (data.data.refresh) {
            nookies.set(null, "refresh_token", data.data.refresh, {
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            });
        }
    }
    
    if (data.success && data.data.user) {
        return true;
    }
    
    return false;
};

export const logoutUser = async () => {
    try {
        await api.post("/users/logout/");
    } catch (error) {
        console.log(error);
    } finally {
        nookies.destroy(null, "access_token", { path: "/" });
        nookies.destroy(null, "refresh_token", { path: "/" });
        nookies.destroy(null, 'user_info', { path: '/' });
        if (typeof window !== "undefined") {
            localStorage.removeItem('user_foto');
            window.location.href = "/login";
        }
    }
};

export const getUserInfo = async () => {
    const response = await api.get('/api/users/me/');
    return response.data;
};

export const updateUserInfo = async (data: any) => {
    const response = await api.put('/api/users/me/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.success) {
        console.log('Usuario atualizado com sucesso', response.data.data.user);
    }

    return response.data;
};

export const registerUser = async (userData: any) => {
    const response = await api.post('/api/users/', {
        ...userData,
        password_confirm: userData.password
    });
    return response.data;
};