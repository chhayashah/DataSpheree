import { useState, useEffect, useCallback } from "react";
import {
  listReports,
  generateReport,
  deleteReport,
  getReport,
} from "../services/reportService";
import { useToast } from "../../../context/ToastContext";

const PAGE_LIMIT = 10;

export const useReportList = () => {
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [generating, setGenerating] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listReports({ page, limit: PAGE_LIMIT });
      setRows(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't load reports", "error");
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const create = async ({ title, from, to }) => {
    setGenerating(true);
    try {
      await generateReport({ title, from, to });
      toast("Report generated", "success");
      setPage(1);
      await fetchList();
      return true;
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't generate report", "error");
      return false;
    } finally {
      setGenerating(false);
    }
  };

  const remove = async (id) => {
    try {
      await deleteReport(id);
      toast("Report deleted", "success");
      fetchList();
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't delete report", "error");
    }
  };

  // Downloads the persisted trend snapshot for one report — same Blob
  // pattern Analytics uses for its live export, fed from stored data
  // instead of a fresh fetch, since a report is a snapshot by design.
  const downloadCsv = async (id, title) => {
    try {
      const res = await getReport(id);
      const report = res.data;
      const header = "date,uploads,totalRows";
      const csvRows = (report.trend || []).map(
        (t) => `${t.date},${t.uploads},${t.totalRows}`,
      );
      const csv = [header, ...csvRows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't download report", "error");
    }
  };

  return {
    rows,
    pagination,
    loading,
    page,
    setPage,
    generating,
    create,
    remove,
    downloadCsv,
  };
};
