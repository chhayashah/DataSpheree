import axiosInstance from "../../../services/axiosInstance";

export const listDatasets = async (params) => {
  const res = await axiosInstance.get("/data", { params });
  return res.data;
};

export const getDataset = async (id) => {
  const res = await axiosInstance.get(`/data/${id}`);
  return res.data;
};

export const deleteDataset = async (id) => {
  const res = await axiosInstance.delete(`/data/${id}`);
  return res.data;
};

export const bulkDeleteDatasets = async (ids) => {
  const res = await axiosInstance.delete("/data", { data: { ids } });
  return res.data;
};

export const getDatasetActivity = async (recordId) => {
  const res = await axiosInstance.get("/activity", { params: { recordId } });
  return res.data;
};
