import axiosInstance from "../../../services/axiosInstance";

export const getAuditLog = async (params) => {
  const res = await axiosInstance.get("/audit", { params });
  return res.data;
};
