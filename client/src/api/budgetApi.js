import axiosInstance from './axiosInstance';

export const getBudgets = async (params = {}) => {
  const res = await axiosInstance.get('/budgets', { params });
  return res.data;
};

export const createBudget = async (data) => {
  const res = await axiosInstance.post('/budgets', data);
  return res.data;
};

export const updateBudget = async (id, data) => {
  const res = await axiosInstance.put(`/budgets/${id}`, data);
  return res.data;
};

export const deleteBudget = async (id) => {
  const res = await axiosInstance.delete(`/budgets/${id}`);
  return res.data;
};