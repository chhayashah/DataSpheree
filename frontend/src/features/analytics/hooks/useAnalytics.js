import { useState, useEffect, useCallback, useRef } from "react";
import {
  getStats,
  getDailyTrend,
  getTopUsers,
  getInsights,
} from "../services/analyticsService";
import { useSocketEvent } from "../../../hooks/useSocketEvent";
import { useToast } from "../../../context/ToastContext";
import { rangeToISO } from "../../../utils/dateRange";

const REFRESH_DEBOUNCE_MS = 800;

export const useAnalytics = () => {
  const toast = useToast();

  const [rangeKey, setRangeKey] = useState("30d");
  const [compare, setCompare] = useState(false);

  const [stats, setStats] = useState(null);
  const [previousStats, setPreviousStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshTimeoutRef = useRef(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const { from, to } = rangeToISO(rangeKey);

      const [statsRes, trendRes, topRes, insightsRes] = await Promise.all([
        getStats({ from, to, compare: compare ? "true" : undefined }),
        getDailyTrend({ from, to }),
        getTopUsers({ from, to }),
        getInsights({ from, to }),
      ]);

      setStats(statsRes.data);
      setPreviousStats(statsRes.previous);
      setTrend(trendRes.data);
      setTopUsers(topRes.data);
      setInsights(insightsRes.data);
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't load analytics", "error");
    } finally {
      setLoading(false);
    }
  }, [rangeKey, compare, toast]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const scheduleRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    refreshTimeoutRef.current = setTimeout(fetchAll, REFRESH_DEBOUNCE_MS);
  }, [fetchAll]);

  useEffect(
    () => () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    },
    [],
  );

  useSocketEvent("data:ingested", scheduleRefresh);
  useSocketEvent("data:processed", scheduleRefresh);

  const exportCsv = () => {
    const header = "date,uploads,totalRows";
    const rows = trend.map((t) => `${t.date},${t.uploads},${t.totalRows}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${rangeKey}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return {
    rangeKey,
    setRangeKey,
    compare,
    setCompare,
    stats,
    previousStats,
    trend,
    topUsers,
    insights,
    loading,
    exportCsv,
  };
};
