import { useState, useEffect, useCallback } from "react";
import {
  getUser,
  getUserActivityFeed,
  updateUser,
  changeUserRole,
  setUserStatus,
} from "../services/userService";
import { useToast } from "../../../context/ToastContext";

export const useUserDetails = (userId, { onChanged } = {}) => {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [userRes, activityRes] = await Promise.all([
        getUser(userId),
        getUserActivityFeed(userId),
      ]);
      setUser(userRes.data);
      setActivity(
        (activityRes.data || []).map((a) => ({
          id: a._id,
          type: a.action,
          message: a.details || a.action,
          timestamp: a.createdAt,
        })),
      );
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't load user", "error");
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const saveProfile = async (data) => {
    try {
      await updateUser(userId, data);
      toast("User updated", "success");
      await fetchAll();
      onChanged?.();
      return true;
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't update user", "error");
      return false;
    }
  };

  const setRole = async (role) => {
    try {
      await changeUserRole(userId, role);
      toast("Role updated", "success");
      await fetchAll();
      onChanged?.();
      return true;
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't change role", "error");
      return false;
    }
  };

  const setStatus = async (status) => {
    try {
      await setUserStatus(userId, status);
      toast(
        status === "suspended" ? "User suspended" : "User activated",
        "success",
      );
      await fetchAll();
      onChanged?.();
      return true;
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't update status", "error");
      return false;
    }
  };

  return { user, activity, loading, saveProfile, setRole, setStatus };
};
