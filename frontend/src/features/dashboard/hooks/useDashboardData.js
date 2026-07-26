import { useState, useEffect, useCallback, useRef } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { useSocketEvent } from "../../../hooks/useSocketEvent";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";

const ACTIVITY_FEED_LIMIT = 20;
const RECENT_UPLOADS_LIMIT = 10;
const REFRESH_DEBOUNCE_MS = 800;

export const useDashboardData = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshTimeoutRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, trendRes, topRes] = await Promise.all([
        axiosInstance.get("/analytics/stats"),
        axiosInstance.get("/analytics/daily-trend"),
        axiosInstance.get("/analytics/top-users"),
      ]);
      setStats(statsRes.data.data);
      setTrend(trendRes.data.data);
      setRecentUploads(statsRes.data.data.recentRecords || []);
      setTopUsers(topRes.data.data || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const scheduleRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    refreshTimeoutRef.current = setTimeout(fetchData, REFRESH_DEBOUNCE_MS);
  }, [fetchData]);

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    };
  }, []);

  const pushActivity = useCallback((entry) => {
    setActivityFeed((prev) =>
      [
        {
          id: `${Date.now()}-${Math.random()}`,
          timestamp: new Date().toISOString(),
          ...entry,
        },
        ...prev,
      ].slice(0, ACTIVITY_FEED_LIMIT),
    );
  }, []);

  const handleIngested = useCallback(
    (payload) => {
      setStats((prev) =>
        prev
          ? {
              ...prev,
              totalRecords: (prev.totalRecords ?? 0) + 1,
              totalRows: (prev.totalRows ?? 0) + (payload.totalRows ?? 0),
            }
          : prev,
      );

      setRecentUploads((prev) =>
        [
          {
            _id: payload.id,
            filename: payload.filename,
            totalRows: payload.totalRows,
            status: "processing",
            uploadedBy: { name: user?.name || "You" },
          },
          ...prev,
        ].slice(0, RECENT_UPLOADS_LIMIT),
      );

      pushActivity({
        type: "upload",
        message: `${payload.filename} uploaded (${payload.totalRows} rows)`,
      });

      toast(`Upload complete: ${payload.filename}`, "success");

      scheduleRefresh();
    },
    [user, pushActivity, toast, scheduleRefresh],
  );

  const handleProcessed = useCallback(
    (payload) => {
      setRecentUploads((prev) =>
        prev.map((r) =>
          r._id === payload.id ? { ...r, status: "processed" } : r,
        ),
      );

      pushActivity({
        type: "processed",
        message: `${payload.filename} finished processing`,
      });
    },
    [pushActivity],
  );

  useSocketEvent("data:ingested", handleIngested);
  useSocketEvent("data:processed", handleProcessed);

  return {
    stats,
    trend,
    recentUploads,
    topUsers,
    activityFeed,
    loading,
    refresh: fetchData,
  };
};
