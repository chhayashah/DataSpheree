import axiosInstance from "../../../services/axiosInstance";

export const updateProfile = async (payload) => {
  const res = await axiosInstance.patch("/auth/profile", payload);
  return res.data;
};

export const changePassword = async (payload) => {
  const res = await axiosInstance.patch("/auth/change-password", payload);
  return res.data;
};

export const updatePreferences = async (payload) => {
  const res = await axiosInstance.patch("/auth/preferences", payload);
  return res.data;
};
