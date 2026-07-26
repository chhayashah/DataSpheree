import { useState, useEffect, useCallback } from "react";
import { getAuditLog } from "../services/auditService";
import { useToast } from "../../../context/ToastContext";

const PAGE_LIMIT = 15;

export const useAuditLog = () => {
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [actionTypes, setActionTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAuditLog({
        page,
        limit: PAGE_LIMIT,
        action: filters.action || undefined,
      });
      setRows(res.data);
      setPagination(res.pagination);
      setActionTypes(res.actionTypes || []);
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't load audit log", "error");
    } finally {
      setLoading(false);
    }
  }, [page, filters, toast]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);
  useEffect(() => {
    setPage(1);
  }, [filters]);

  return {
    rows,
    pagination,
    actionTypes,
    loading,
    filters,
    setFilters,
    page,
    setPage,
  };
};
