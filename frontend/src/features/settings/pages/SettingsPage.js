import { useState } from "react";
import { Card, CardHeader, CardBody } from "../../../components/ui/Card";
import { PageHeader } from "../../../components/ui/Misc";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useAuth } from "../../../context/AuthContext";
import { changePassword, updatePreferences } from "../services/settingsService";
import { useToast } from "../../../context/ToastContext";

const SettingsPage = () => {
  const { user, updateUserInContext } = useAuth();
  const toast = useToast();

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [pwSaving, setPwSaving] = useState(false);

  const [notifyOnUpload, setNotifyOnUpload] = useState(
    user?.preferences?.notifyOnUpload !== false,
  );
  const [prefSaving, setPrefSaving] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwSaving(true);
    try {
      await changePassword(pwForm);
      toast("Password updated", "success");
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't update password", "error");
    } finally {
      setPwSaving(false);
    }
  };

  const handleToggleNotify = async (checked) => {
    setNotifyOnUpload(checked);
    setPrefSaving(true);
    try {
      const res = await updatePreferences({ notifyOnUpload: checked });
      updateUserInContext({ preferences: res.data.preferences });
    } catch (err) {
      setNotifyOnUpload(!checked);
      toast(
        err.response?.data?.message || "Couldn't update preference",
        "error",
      );
    } finally {
      setPrefSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Security and notification preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Security" subtitle="Change your password" />
          <CardBody>
            <form
              onSubmit={handlePasswordSubmit}
              className="flex flex-col gap-3 max-w-sm"
            >
              <Input
                label="Current password"
                type="password"
                value={pwForm.currentPassword}
                onChange={(e) =>
                  setPwForm({ ...pwForm, currentPassword: e.target.value })
                }
                required
              />
              <Input
                label="New password"
                type="password"
                value={pwForm.newPassword}
                onChange={(e) =>
                  setPwForm({ ...pwForm, newPassword: e.target.value })
                }
                required
                minLength={6}
              />
              <Button
                type="submit"
                size="sm"
                loading={pwSaving}
                className="mt-1 self-start"
              >
                Update password
              </Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Notifications"
            subtitle="What you get notified about"
          />
          <CardBody>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOnUpload}
                disabled={prefSaving}
                onChange={(e) => handleToggleNotify(e.target.checked)}
                className="mt-0.5 accent-accent"
              />
              <span>
                <span className="block text-sm font-medium text-slate-800">
                  Notify me when my uploads finish processing
                </span>
                <span className="block text-xs text-slate-400 mt-0.5">
                  Applies to in-app notifications and the notification bell.
                </span>
              </span>
            </label>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
