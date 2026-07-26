import { useState, useEffect } from "react";
import { PageHeader } from "../../../components/ui/Misc";
import { Card, CardHeader, CardBody } from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";
import ActivityTimeline from "../../../components/ui/ActivityTimeline";
import { useAuth } from "../../../context/AuthContext";
import { updateProfile } from "../services/settingsService";
import axiosInstance from "../../../services/axiosInstance";
import { useToast } from "../../../context/ToastContext";

const ProfilePage = () => {
  const { user, updateUserInContext } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [saving, setSaving] = useState(false);
  const [activity, setActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const res = await axiosInstance.get("/activity", {
          params: { userId: user.id },
        });
        setActivity(
          (res.data.data || []).map((a) => ({
            id: a._id,
            type: a.action,
            message: a.details || a.action,
            timestamp: a.createdAt,
          })),
        );
      } finally {
        setLoadingActivity(false);
      }
    };
    if (user?.id) loadActivity();
  }, [user?.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      updateUserInContext(form);
      toast("Profile updated", "success");
      setEditing(false);
    } catch (err) {
      toast(err.response?.data?.message || "Couldn't update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="Your account details and activity"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardBody className="flex flex-col items-center text-center gap-3 py-8">
            <div className="h-16 w-16 rounded-full bg-accent/10 text-accent flex items-center justify-center text-2xl font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900">
                {user?.name}
              </p>
              <p className="text-sm text-slate-400">{user?.email}</p>
            </div>
            <Badge tone="accent">{user?.role}</Badge>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Account details"
            action={
              !editing && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
              )
            }
          />
          <CardBody>
            {editing ? (
              <div className="flex flex-col gap-3 max-w-sm">
                <Input
                  label="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  label="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button size="sm" loading={saving} onClick={handleSave}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm max-w-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Name</span>
                  <span className="text-slate-700 font-medium">
                    {user?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email</span>
                  <span className="text-slate-700 font-medium">
                    {user?.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Role</span>
                  <span className="text-slate-700 font-medium capitalize">
                    {user?.role}
                  </span>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Activity history" />
        <CardBody>
          {loadingActivity ? (
            <p className="text-sm text-slate-400">Loading…</p>
          ) : (
            <ActivityTimeline
              entries={activity}
              emptyLabel="No activity recorded yet"
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfilePage;
