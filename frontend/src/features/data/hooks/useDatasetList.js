import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  listDatasets,
  deleteDataset,
  bulkDeleteDatasets,
} from "../services/dataService";
import { useSocketEvent } from "../../../hooks/useSocketEvent";
import { useToast } from "../../../context/ToastContext";

const PAGE_LIMIT = 10;

export const useDatasetList = () => {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [dateRange, setDateRange] = useState(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    return from && to ? { from, to } : null;
  });

  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listDatasets({
        page,
        limit: PAGE_LIMIT,
        search: search || undefined,
        status: filters.status || undefined,
        from: dateRange?.from,
        to: dateRange?.to,
        sortBy,
        sortDir,
      });
      setRows(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't load datasets", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, filters, sortBy, sortDir, dateRange, toast]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    setPage(1);
  }, [search, filters, sortBy, sortDir, dateRange]);

  const clearDateRange = () => {
    setDateRange(null);
    if (searchParams.get("from") || searchParams.get("to")) {
      searchParams.delete("from");
      searchParams.delete("to");
      setSearchParams(searchParams, { replace: true });
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (checked) => {
    setSelectedIds(checked ? new Set(rows.map((r) => r._id)) : new Set());
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

  const removeOne = async (id) => {
    try {
      await deleteDataset(id);
      toast("Dataset deleted", "success");
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      fetchList();
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't delete dataset", "error");
    }
  };

  const removeSelected = async () => {
    try {
      const res = await bulkDeleteDatasets(Array.from(selectedIds));
      toast(res.message || "Datasets deleted", "success");
      setSelectedIds(new Set());
      fetchList();
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't delete datasets", "error");
    }
  };

  const handleLiveUpdate = useCallback(() => fetchList(), [fetchList]);
  useSocketEvent("data:ingested", handleLiveUpdate);
  useSocketEvent("data:processed", handleLiveUpdate);

  return {
    rows,
    pagination,
    loading,
    search,
    setSearch,
    filters,
    setFilters,
    sortBy,
    sortDir,
    handleSort,
    page,
    setPage,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    removeOne,
    removeSelected,
    dateRange,
    clearDateRange,
  };
};
