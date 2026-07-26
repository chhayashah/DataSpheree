import { useState } from "react";
import { Copy, Check } from "lucide-react";
import Dialog from "../../../components/ui/Dialog";
import { CardBody } from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { ROLES } from "../../../constants";
import { inviteUser } from "../services/userService";
import { useToast } from "../../../context/ToastContext";

const ROLE_OPTIONS = [
  { value: ROLES.VIEWER, label: "Viewer" },
  { value: ROLES.ANALYST, label: "Analyst" },
  { value: ROLES.ADMIN, label: "Admin" },
];

const InviteUserDialog = ({ open, onClose, onInvited }) => {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", role: ROLES.VIEWER });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setForm({ name: "", email: "", role: ROLES.VIEWER });
    setResult(null);
    setCopied(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await inviteUser(form);
      setResult({ user: res.data, tempPassword: res.tempPassword });
      onInvited?.();
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't invite user", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(result.tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={result ? "User invited" : "Invite user"}
    >
      <CardBody>
        {!result ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Name"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jordan Rivera"
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="jordan@company.com"
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-600">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" loading={submitting} className="mt-1">
              Send invite
            </Button>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-900">
                {result.user.name}
              </span>{" "}
              has been added as {result.user.role}. There's no email service
              configured, so share this temporary password with them directly —
              it won't be shown again.
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-slate-50 px-3 py-2.5">
              <code className="flex-1 font-data text-sm text-slate-800 select-all">
                {result.tempPassword}
              </code>
              <button
                onClick={copyPassword}
                aria-label="Copy password"
                className="text-slate-400 hover:text-accent transition-colors"
              >
                {copied ? (
                  <Check size={15} className="text-success" />
                ) : (
                  <Copy size={15} />
                )}
              </button>
            </div>
            <Button onClick={handleClose}>Done</Button>
          </div>
        )}
      </CardBody>
    </Dialog>
  );
};

export default InviteUserDialog;
