import { createAPI } from './axiosConfig';

const bancosAPI = createAPI('http://localhost:8000/api/bancos/');

export const cadastrarBanco = async (data: FormData) => {
  const res = await bancosAPI.post('cadastrar/', data);
  return res.data;
};

export const listarBancos = async () => {
  const res = await bancosAPI.get('');
  return res.data;
};

export const updateBanco = async (TestTube, teste) => {
  const res = await bancosAPI.post('cadastrar/', teste);
}