import { useState, useEffect } from "react";
import Drawer from "../../../components/ui/Drawer";
import Tabs from "../../../components/ui/Tabs";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";
import ActivityTimeline from "../../../components/ui/ActivityTimeline";
import { PageSpinner } from "../../../components/ui/Misc";
import { useUserDetails } from "../hooks/useUserDetails";
import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../constants";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "activity", label: "Activity" },
];

const ROLE_OPTIONS = [ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN];

const UserDetailsDrawer = ({ userId, open, onClose, onChanged }) => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  const { user, activity, loading, saveProfile, setRole, setStatus } =
    useUserDetails(userId, { onChanged });

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email });
  }, [user]);

  const isSelf = currentUser?.id === user?.id;

  return (
    <Drawer open={open} onClose={onClose} title={user?.name || "User details"}>
      {loading || !user ? (
        <PageSpinner label="Loading user…" />
      ) : (
        <div className="p-5">
          <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

          {activeTab === "overview" && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center text-base font-semibold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  tone={user.status === "suspended" ? "danger" : "success"}
                >
                  {user.status}
                </Badge>
                <span className="text-xs text-slate-400">
                  Joined {new Date(user.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">
                  Role
                </label>
                <select
                  value={user.role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isSelf}
                  className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
                {isSelf && (
                  <p className="text-xs text-slate-400 mt-1">
                    You can't change your own role.
                  </p>
                )}
              </div>

              {editing ? (
                <div className="flex flex-col gap-3">
                  <Input
                    label="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <Input
                    label="Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={async () => {
                        const ok = await saveProfile(form);
                        if (ok) setEditing(false);
                      }}
                    >
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing(true)}
                >
                  Edit profile
                </Button>
              )}

              <div className="border-t border-border pt-4">
                {isSelf ? (
                  <p className="text-xs text-slate-400">
                    You can't suspend your own account.
                  </p>
                ) : user.status === "suspended" ? (
                  <Button size="sm" onClick={() => setStatus("active")}>
                    Reactivate user
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setStatus("suspended")}
                  >
                    Suspend user
                  </Button>
                )}
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <ActivityTimeline
              entries={activity}
              emptyLabel="No recorded activity for this user"
            />
          )}
        </div>
      )}
    </Drawer>
  );
};

export default UserDetailsDrawer;
