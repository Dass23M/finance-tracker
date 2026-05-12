import axiosInstance from './axiosInstance';

export const getDashboardStats = async (params = {}) => {
  const res = await axiosInstance.get('/stats/dashboard', { params });
  return res.data;
};

export const getCategoryBreakdown = async (params = {}) => {
  const res = await axiosInstance.get('/stats/category-breakdown', { params });
  return res.data;
};

export const getMonthlyTrend = async (params = {}) => {
  const res = await axiosInstance.get('/stats/monthly-trend', { params });
  return res.data;
};