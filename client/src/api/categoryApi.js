import axiosInstance from './axiosInstance';

export const getCategories = async (params = {}) => {
  const res = await axiosInstance.get('/categories', { params });
  return res.data;
};

export const createCategory = async (data) => {
  const res = await axiosInstance.post('/categories', data);
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await axiosInstance.put(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await axiosInstance.delete(`/categories/${id}`);
  return res.data;
};