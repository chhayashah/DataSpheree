import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { PageHeader } from "../../../components/ui/Misc";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";
import SearchBar from "../../../components/ui/SearchBar";
import FilterBar from "../../../components/ui/FilterBar";
import Badge from "../../../components/ui/Badge";
import { useUserList } from "../hooks/useUserList";
import InviteUserDialog from "../components/InviteUserDialog";
import UserDetailsDrawer from "../components/UserDetailsDrawer";
import { ROLES } from "../../../constants";

const ROLE_FILTER_OPTIONS = [
  { value: ROLES.ADMIN, label: "Admin" },
  { value: ROLES.ANALYST, label: "Analyst" },
  { value: ROLES.VIEWER, label: "Viewer" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
];

const UsersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const {
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
    setPage,
    refetch,
  } = useUserList();

  useEffect(() => {
    const openId = searchParams.get("open");
    if (openId) setSelectedUserId(openId);
  }, [searchParams]);

  const closeDrawer = () => {
    setSelectedUserId(null);
    if (searchParams.get("open")) {
      searchParams.delete("open");
      setSearchParams(searchParams, { replace: true });
    }
  };

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (r) => (
        <Badge tone="accent">
          {r.role.charAt(0).toUpperCase() + r.role.slice(1)}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <Badge tone={r.status === "suspended" ? "danger" : "success"}>
          {r.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      sortable: true,
      className: "font-data",
      render: (r) => new Date(r.createdAt).toLocaleDateString("en-IN"),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={`${pagination.total} user${pagination.total === 1 ? "" : "s"}`}
        action={
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus size={14} /> Invite user
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name or email…"
        />
        <FilterBar
          filters={[
            { key: "role", label: "All roles", options: ROLE_FILTER_OPTIONS },
            {
              key: "status",
              label: "All statuses",
              options: STATUS_FILTER_OPTIONS,
            },
          ]}
          values={filters}
          onChange={setFilters}
        />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey="id"
        loading={loading}
        emptyTitle="No users found"
        emptyDescription="Invite your first teammate to get started."
        emptyAction={
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus size={14} /> Invite user
          </Button>
        }
        onRowClick={(row) => setSelectedUserId(row.id)}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={handleSort}
        page={pagination.page}
        pages={pagination.pages}
        onPageChange={setPage}
      />

      <InviteUserDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvited={refetch}
      />
      <UserDetailsDrawer
        userId={selectedUserId}
        open={Boolean(selectedUserId)}
        onClose={closeDrawer}
        onChanged={refetch}
      />
    </div>
  );
};

export default UsersPage;
