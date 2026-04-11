import { useState } from "react";
import axiosInstance from "../../../services/axiosInstance";

const DataUploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSuccess(null);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a CSV file");
    if (!file.name.endsWith(".csv")) return setError("Only CSV files allowed");

    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosInstance.post("/data/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(res.data);
      setFile(null);
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      {/* <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Upload Data</h1>
          <p style={styles.subtitle}>
            Upload CSV files — data will be processed automatically
          </p>
        </div>
        <a href="/dashboard" style={styles.backBtn}>
          ← Dashboard
        </a>
      </div> */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Upload Data</h1>
          <p style={styles.subtitle}>
            Upload CSV files — data will be processed automatically
          </p>
        </div>
      </div>

      {/* Upload Card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>CSV File Upload</h3>

        <form onSubmit={handleUpload}>
          {/* Drop Zone */}
          <div style={styles.dropZone}>
            <div style={styles.dropIcon}>📁</div>
            <p style={styles.dropText}>Select a CSV file to upload</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
            {file && (
              <div style={styles.fileInfo}>
                <span style={styles.fileName}>{file.name}</span>
                <span style={styles.fileSize}>
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
          </div>

          {/* Error */}
          {error && <div style={styles.error}>{error}</div>}

          {/* Success */}
          {success && (
            <div style={styles.successBox}>
              <p style={styles.successTitle}>Upload Successful!</p>
              <p style={styles.successMsg}>{success.message}</p>
              <div style={styles.successStats}>
                <span>File: {success.data?.filename}</span>
                <span>Rows: {success.data?.totalRows}</span>
                <span>Status: {success.data?.status}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            style={{ ...styles.uploadBtn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload CSV"}
          </button>
        </form>
      </div>

      {/* Instructions */}
      <div style={styles.infoCard}>
        <h4 style={styles.infoTitle}>CSV Format</h4>
        <p style={styles.infoText}>First row must be headers:</p>
        <div style={styles.codeBlock}>
          name,age,city
          <br />
          Alice,25,Mumbai
          <br />
          Bob,30,Delhi
        </div>
        <p style={styles.infoText}>Max file size: 10MB</p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "24px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "sans-serif",
    background: "#f8fafc",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "28px",
  },
  title: { fontSize: "24px", fontWeight: "700", margin: 0, color: "#1e293b" },
  subtitle: { fontSize: "13px", color: "#94a3b8", margin: "4px 0 0" },
  backBtn: {
    padding: "8px 16px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#64748b",
    fontSize: "13px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "28px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    marginBottom: "16px",
  },
  cardTitle: {
    margin: "0 0 20px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
  },
  dropZone: {
    border: "2px dashed #e2e8f0",
    borderRadius: "12px",
    padding: "40px 20px",
    textAlign: "center",
    marginBottom: "16px",
    background: "#f8fafc",
  },
  dropIcon: { fontSize: "40px", marginBottom: "12px" },
  dropText: { color: "#64748b", fontSize: "14px", marginBottom: "12px" },
  fileInput: { display: "block", margin: "0 auto", fontSize: "13px" },
  fileInfo: {
    marginTop: "12px",
    padding: "8px 16px",
    background: "#ede9fe",
    borderRadius: "8px",
    display: "inline-block",
  },
  fileName: { color: "#4f46e5", fontWeight: "500", fontSize: "13px" },
  fileSize: { color: "#7c3aed", fontSize: "12px", marginLeft: "8px" },
  error: {
    background: "#fef2f2",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "16px",
  },
  successBox: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
  },
  successTitle: {
    color: "#15803d",
    fontWeight: "600",
    fontSize: "14px",
    margin: "0 0 4px",
  },
  successMsg: { color: "#166534", fontSize: "13px", margin: "0 0 8px" },
  successStats: {
    display: "flex",
    gap: "16px",
    fontSize: "12px",
    color: "#166534",
  },
  uploadBtn: {
    width: "100%",
    padding: "12px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
  },
  infoCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px 28px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  infoTitle: {
    margin: "0 0 8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
  },
  infoText: { color: "#64748b", fontSize: "13px", margin: "0 0 8px" },
  codeBlock: {
    background: "#f1f5f9",
    borderRadius: "8px",
    padding: "12px 16px",
    fontFamily: "monospace",
    fontSize: "12px",
    color: "#334155",
    marginBottom: "8px",
    lineHeight: "1.8",
  },
};

export default DataUploadPage;
