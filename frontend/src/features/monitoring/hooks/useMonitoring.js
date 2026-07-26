import { useState, useEffect, useCallback, useRef } from "react";
import { getSystemHealth, getErrorLogs } from "../services/monitoringService";
import { useToast } from "../../../context/ToastContext";

const POLL_INTERVAL_MS = 10000;

/**
 * Polls rather than pushes — there's no metrics-streaming socket
 * channel (unlike Dashboard/Dataset List, which react to real
 * data:ingested/processed events). Polling every 10s is the honest
 * choice here rather than dressing this up as "live" when it isn't
 * event-driven.
 */
export const useMonitoring = () => {
  const toast = useToast();
  const [health, setHealth] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchAll = useCallback(async () => {
    try {
      const [healthRes, errorsRes] = await Promise.all([
        getSystemHealth(),
        getErrorLogs({ limit: 20 }),
      ]);
      setHealth(healthRes.data);
      setErrors(errorsRes.data);
    } catch (err) {
      toast(
        err.response?.data?.message || "Couldn't load system health",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(fetchAll, POLL_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchAll]);

  return { health, errors, loading, refetch: fetchAll };
};
