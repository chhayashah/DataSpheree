import axiosInstance from "../../../services/axiosInstance";

export const getSystemHealth = async () => {
  const res = await axiosInstance.get("/monitoring/health");
  return res.data;
};

export const getErrorLogs = async (params) => {
  const res = await axiosInstance.get("/monitoring/errors", { params });
  return res.data;
};
