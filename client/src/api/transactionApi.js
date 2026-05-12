import axiosInstance from './axiosInstance';

export const getTransactions = async (params = {}) => {
  const res = await axiosInstance.get('/transactions', { params });
  return res.data;
};

export const getTransactionSummary = async (params = {}) => {
  const res = await axiosInstance.get('/transactions/summary', { params });
  return res.data;
};

export const createTransaction = async (data) => {
  const res = await axiosInstance.post('/transactions', data);
  return res.data;
};

export const updateTransaction = async (id, data) => {
  const res = await axiosInstance.put(`/transactions/${id}`, data);
  return res.data;
};

export const deleteTransaction = async (id) => {
  const res = await axiosInstance.delete(`/transactions/${id}`);
  return res.data;
};