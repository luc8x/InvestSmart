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

export const loginUser = async (cpf: string, password: string) => {
  try {
    const res = await usersAPI.post('login/', { cpf, password });
    const { access_token, user } = res.data;

    nookies.set(null, 'access_token', access_token, {
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    if (user.perfil.foto) {
      localStorage.setItem('user_foto', user.perfil.foto);
      user.perfil.foto = null;
    }

    nookies.set(null, 'user_info', JSON.stringify(user), {
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return true;
  } catch (err) {
    console.error('Login error:', err);
    return false;
  }
};

export const getUserFromCookies = (): User | null => {
  try {
    const cookies = nookies.get();
    const user = cookies.user_info ? JSON.parse(cookies.user_info) : null;
    user.perfil.foto = localStorage.getItem('user_foto');
    return user;
  } catch (error) {
    console.error('Erro ao ler user_info dos cookies:', error);
    return null;
  }
};

export const logoutUser = async (ctx = null) => {
  nookies.destroy(ctx, 'user_info');
  if (localStorage.getItem('user_foto')){
    localStorage.removeItem('user_foto');
  }
  nookies.destroy(ctx, 'access_token');
  window.location.href = '/';
};

export const getUserInfo = async () => {
  const res = await usersAPI.get('me/');
  return res.data;
};

export const updateUserInfo = async (data: FormData) => {
  const res = await usersAPI.put('me/', data);
  
  if (res.status === 200) {

    if (res.data.perfil.foto) {
      localStorage.setItem('user_foto', res.data.perfil.foto);
      res.data.perfil.foto = null;
    }

    nookies.set(null, 'user_info', JSON.stringify(res.data), {
      maxAge: 60 * 60 * 24,
      path: '/',
    });
  }

  return res.data;
};