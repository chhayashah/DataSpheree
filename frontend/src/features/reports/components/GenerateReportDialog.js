import { useState } from "react";
import Dialog from "../../../components/ui/Dialog";
import { CardBody } from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { rangeToISO } from "../../../utils/dateRange";

const PRESETS = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
];

const GenerateReportDialog = ({ open, onClose, onGenerate, generating }) => {
  const [title, setTitle] = useState("");
  const [rangeKey, setRangeKey] = useState("30d");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { from, to } = rangeToISO(rangeKey);
    const ok = await onGenerate({ title: title || undefined, from, to });
    if (ok) {
      setTitle("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Generate report">
      <CardBody>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Q3 Upload Summary"
          />

          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">
              Date range
            </label>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-white p-1 w-fit">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setRangeKey(p.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    rangeKey === p.key
                      ? "bg-accent text-white"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" loading={generating} className="mt-1">
            Generate
          </Button>
        </form>
      </CardBody>
    </Dialog>
  );
};

export default GenerateReportDialog;
