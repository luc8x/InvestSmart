import { createAPI } from './axiosConfig';
import nookies from 'nookies';

export interface User {
  id: number;
  nome_completo: string;
  cpf: string;
  email: string;
  data_nascimento: string;
}

const usersAPI = createAPI('http://localhost:8000/api/users/');

export const registerUser = async (cpf: any, email: any, data_nascimento: any, nome_completo: any, password: any) => {
  const response = await usersAPI.post('register/', { cpf, email, data_nascimento, nome_completo, password });
  return response.data;
};

export const loginUser = async (cpf: any, password: any) => {
  try {
    const res = await usersAPI.post('login/', { cpf, password });
    const access_token = res.data.access_token;

    nookies.set(null, 'access_token', access_token, {
      maxAge: 60 * 60 * 24,
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
    });

    nookies.set(null, 'user_info', JSON.stringify(res.data.user), {
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return true;
  } catch (err) {
    return false;
  }
};

export const getUserFromCookies = (): User | null => {
  try {
    const cookies = nookies.get();
    const user = cookies.user_info ? JSON.parse(cookies.user_info) : null;
    return user;
  } catch (error) {
    console.error('Erro ao ler user_info dos cookies:', error);
    return null;
  }
};

export const logoutUser = async (ctx = null) => {
  nookies.destroy(ctx, 'user_info');
  nookies.destroy(ctx, 'access_token');
  window.location.href = '/';
};

export const getUserInfo = async () => {
  const res = await usersAPI.get('me/');
  return res.data;
};

export const updateUserInfo = async (data: any) => {
  const res = await usersAPI.put('me/', data);
  return res.data;
};

export const uploadFoto = async (data: any) => {
  if (!data) return '';

  const formData = new FormData();
  formData.append('foto', data);

  const res = await usersAPI.post('upload-photo/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data.foto_url;
};
