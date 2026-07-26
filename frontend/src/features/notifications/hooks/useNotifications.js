import { useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  markAsRead as markAsReadApi,
  markAllAsRead as markAllAsReadApi,
} from "../services/notificationService";
import { useSocketEvent } from "../../../hooks/useSocketEvent";
import { useToast } from "../../../context/ToastContext";

export const useNotifications = (limit = 10) => {
  const toast = useToast();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications({ page, limit });
      setNotifications(res.data);
      setUnreadCount(res.unreadCount);
      setPagination(res.pagination);
    } catch (err) {
      toast(
        err.response?.data?.message || "Couldn't load notifications",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, toast]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleNew = useCallback(
    (payload) => {
      setNotifications((prev) =>
        [
          {
            _id: payload.id,
            type: payload.type,
            message: payload.message,
            read: false,
            createdAt: payload.createdAt,
          },
          ...prev,
        ].slice(0, limit),
      );
      setUnreadCount((c) => c + 1);
      toast(payload.message, "info");
    },
    [limit, toast],
  );
  useSocketEvent("notification:new", handleNew);

  const markRead = async (id) => {
    try {
      await markAsReadApi(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      toast(
        err.response?.data?.message || "Couldn't update notification",
        "error",
      );
    }
  };

  const markAllRead = async () => {
    try {
      await markAllAsReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      toast(
        err.response?.data?.message || "Couldn't update notifications",
        "error",
      );
    }
  };

  return {
    notifications,
    unreadCount,
    pagination,
    loading,
    page,
    setPage,
    markRead,
    markAllRead,
  };
};
