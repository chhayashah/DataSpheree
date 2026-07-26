import axiosInstance from "../../../services/axiosInstance";

export const getStats = async (params) => {
  const res = await axiosInstance.get("/analytics/stats", { params });
  return res.data;
};

export const getDailyTrend = async (params) => {
  const res = await axiosInstance.get("/analytics/daily-trend", { params });
  return res.data;
};

export const getTopUsers = async (params) => {
  const res = await axiosInstance.get("/analytics/top-users", { params });
  return res.data;
};

export const getInsights = async (params) => {
  const res = await axiosInstance.get("/analytics/insights", { params });
  return res.data;
};
