import { api } from '../api/api';

export const registerBank = async (data: any) => {
  const response = await api.post('/api/bancos/cadastrar/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getBanks = async () => {
  const response = await api.get('/api/bancos/');
  return response.data;
};

export const updateBanks = async (bancoId: string, data: any) => {
  const response = await api.put(`/api/bancos/${bancoId}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getBank = async (bancoId: string) => {
  const response = await api.get(`/api/bancos/${bancoId}/`);
  return response.data;
};

export const deleteBank = async (bancoId: string) => {
  const response = await api.delete(`/api/bancos/${bancoId}/`);
  return response.data;
};