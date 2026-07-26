import axiosInstance from "../../../services/axiosInstance";

export const listReports = async (params) => {
  const res = await axiosInstance.get("/reports", { params });
  return res.data;
};

export const generateReport = async (payload) => {
  const res = await axiosInstance.post("/reports", payload);
  return res.data;
};

export const getReport = async (id) => {
  const res = await axiosInstance.get(`/reports/${id}`);
  return res.data;
};

export const deleteReport = async (id) => {
  const res = await axiosInstance.delete(`/reports/${id}`);
  return res.data;
};
