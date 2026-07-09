import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, FileText } from "lucide-react";
import axiosInstance from "../../../services/axiosInstance";
import { Card, CardHeader, CardBody } from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { PageHeader } from "../../../components/ui/Misc";
import { useToast } from "../../../context/ToastContext";

const DataUploadPage = () => {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSuccess(null);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a CSV file");
    if (!file.name.endsWith(".csv"))
      return setError("Only CSV files are allowed");

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
      formRef.current?.reset();
      toast(
        `${res.data.data?.filename} uploaded — ${res.data.data?.totalRows} rows processed`,
        "success",
      );
    } catch (err) {
      const msg = err.response?.data?.message || "Upload failed";
      setError(msg);
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Upload Data"
        subtitle="Upload CSV files — data will be processed automatically"
      />

      <Card className="mb-4">
        <CardHeader title="CSV File Upload" />
        <CardBody>
          <form ref={formRef} onSubmit={handleUpload}>
            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-canvas px-6 py-10 text-center cursor-pointer hover:border-accent/40 transition-colors">
              <UploadCloud size={30} className="text-slate-300" />
              <span className="text-sm text-slate-500">
                {file ? "Change file" : "Click to select a CSV file"}
              </span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              {file && (
                <span className="inline-flex items-center gap-2 mt-2 rounded-lg bg-accent-soft px-3 py-1.5">
                  <FileText size={13} className="text-accent" />
                  <span className="text-xs font-medium text-accent">
                    {file.name}
                  </span>
                  <span className="text-xs text-accent/70 font-data">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </span>
              )}
            </label>

            {error && (
              <div className="mt-4 rounded-lg bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 rounded-lg bg-success-soft border border-success/20 px-4 py-3.5">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-success">
                  <CheckCircle2 size={15} /> Upload successful
                </p>
                <p className="text-sm text-success/80 mt-1">
                  {success.message}
                </p>
                <div className="flex gap-4 text-xs text-success/70 mt-2 font-data">
                  <span>{success.data?.filename}</span>
                  <span>{success.data?.totalRows} rows</span>
                  <span>{success.data?.status}</span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full mt-5"
            >
              {loading ? "Uploading…" : "Upload CSV"}
            </Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="CSV Format" />
        <CardBody>
          <p className="text-sm text-slate-500 mb-2">
            First row must be headers:
          </p>
          <pre className="font-data text-xs bg-slate-50 rounded-lg px-4 py-3 text-slate-600 leading-relaxed">
            {`name,age,city
Alice,25,Mumbai
Bob,30,Delhi`}
          </pre>
          <p className="text-sm text-slate-500 mt-3">Max file size: 10MB</p>
        </CardBody>
      </Card>
    </div>
  );
};

export default DataUploadPage;
