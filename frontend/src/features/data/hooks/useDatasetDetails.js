import { useState, useEffect, useCallback } from "react";
import {
  getDataset,
  getDatasetActivity,
  deleteDataset,
} from "../services/dataService";
import { useSocketEvent } from "../../../hooks/useSocketEvent";
import { useToast } from "../../../context/ToastContext";

export const useDatasetDetails = (id) => {
  const toast = useToast();

  const [record, setRecord] = useState(null);
  const [insights, setInsights] = useState([]);
  const [related, setRelated] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const [detailRes, activityRes] = await Promise.all([
        getDataset(id),
        getDatasetActivity(id),
      ]);
      setRecord(detailRes.data);
      setInsights(detailRes.insights || []);
      setRelated(detailRes.related || []);
      setActivity(
        (activityRes.data || []).map((a) => ({
          id: a._id,
          type: a.action,
          message: a.details || a.action,
          timestamp: a.createdAt,
        })),
      );
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleProcessed = useCallback(
    (payload) => {
      if (payload.id === id) fetchAll();
    },
    [id, fetchAll],
  );
  useSocketEvent("data:processed", handleProcessed);

  const remove = async () => {
    try {
      await deleteDataset(id);
      toast("Dataset deleted", "success");
      return true;
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't delete dataset", "error");
      return false;
    }
  };

  return {
    record,
    insights,
    related,
    activity,
    loading,
    notFound,
    remove,
    refetch: fetchAll,
  };
};
