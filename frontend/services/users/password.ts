import { api } from '@/services/Api/api';

export const resetPassword = async (email:string) => {
  const response = await api.post('/api/users/esqueceu_a_senha/', { email });
  return response.data;
};

export const confirmResetPassword = async (token:string, newPassword:string) => {
  const response = await api.post('/api/users/reset_password/', { 
    token, 
    new_password: newPassword 
  });
  return response.data;
};

export const changePassword = async (currentPassword:string, newPassword:string) => {
  const response = await api.post('/api/users/change_password/', {
    current_password: currentPassword,
    new_password: newPassword
  });
  return response.data;
};