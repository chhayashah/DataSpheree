import { useState, useEffect, useCallback } from "react";
import { listUsers } from "../services/userService";
import { useToast } from "../../../context/ToastContext";

const PAGE_LIMIT = 10;

export const useUserList = () => {
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listUsers({
        page,
        limit: PAGE_LIMIT,
        search: search || undefined,
        role: filters.role || undefined,
        status: filters.status || undefined,
        sortBy,
        sortDir,
      });
      setRows(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't load users", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, filters, sortBy, sortDir, toast]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);
  useEffect(() => {
    setPage(1);
  }, [search, filters, sortBy, sortDir]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

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
    refetch: fetchList,
  };
};
