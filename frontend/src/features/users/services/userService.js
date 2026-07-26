import axiosInstance from "../../../services/axiosInstance";

export const listUsers = async (params) => {
  const res = await axiosInstance.get("/users", { params });
  return res.data;
};

export const getUser = async (id) => {
  const res = await axiosInstance.get(`/users/${id}`);
  return res.data;
};

export const inviteUser = async (payload) => {
  const res = await axiosInstance.post("/users", payload);
  return res.data;
};

export const updateUser = async (id, payload) => {
  const res = await axiosInstance.patch(`/users/${id}`, payload);
  return res.data;
};

export const changeUserRole = async (id, role) => {
  const res = await axiosInstance.patch(`/users/${id}/role`, { role });
  return res.data;
};

export const setUserStatus = async (id, status) => {
  const res = await axiosInstance.patch(`/users/${id}/status`, { status });
  return res.data;
};

export const getUserActivityFeed = async (userId) => {
  const res = await axiosInstance.get("/activity", { params: { userId } });
  return res.data;
};
