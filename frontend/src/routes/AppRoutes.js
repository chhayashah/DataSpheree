import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../features/auth/pages/LoginPage";
import SignupPage from "../features/auth/pages/SignupPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import DataUploadPage from "../features/data/pages/DataUploadPage";
import DataTablePage from "../features/data/pages/DataTablePage";
import DatasetDetailsPage from "../features/data/pages/DatasetDetailsPage";
import AnalyticsPage from "../features/analytics/pages/AnalyticsPage";
import ActivityPage from "../features/dashboard/pages/ActivityPage";
import UsersPage from "../features/users/pages/UsersPage";
import AuditLogPage from "../features/audit/pages/AuditLogPage";
import NotificationsPage from "../features/notifications/pages/NotificationsPage";
import ProfilePage from "../features/settings/pages/ProfilePage";
import SettingsPage from "../features/settings/pages/SettingsPage";
import MonitoringPage from "../features/monitoring/pages/MonitoringPage";
import ReportsPage from "../features/reports/pages/ReportsPage";
import { PageSpinner } from "../components/ui/Misc";
import RequireRole from "../components/auth/RequireRole";
import { PERMISSIONS } from "../constants/permissions";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageSpinner label="Checking session…" />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageSpinner label="Checking session…" />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/data/upload"
        element={
          <PrivateRoute>
            <RequireRole permission={PERMISSIONS.DATA_UPLOAD}>
              <DataUploadPage />
            </RequireRole>
          </PrivateRoute>
        }
      />
      <Route
        path="/data"
        element={
          <PrivateRoute>
            <DataTablePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/data/:id"
        element={
          <PrivateRoute>
            <DatasetDetailsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <PrivateRoute>
            <AnalyticsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/activity"
        element={
          <PrivateRoute>
            <ActivityPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <RequireRole permission={PERMISSIONS.USER_MANAGE}>
              <UsersPage />
            </RequireRole>
          </PrivateRoute>
        }
      />
      <Route
        path="/audit"
        element={
          <PrivateRoute>
            <RequireRole permission={PERMISSIONS.AUDIT_VIEW}>
              <AuditLogPage />
            </RequireRole>
          </PrivateRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <NotificationsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/monitoring"
        element={
          <PrivateRoute>
            <RequireRole permission={PERMISSIONS.SYSTEM_MONITOR_VIEW}>
              <MonitoringPage />
            </RequireRole>
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <RequireRole permission={PERMISSIONS.REPORT_VIEW}>
              <ReportsPage />
            </RequireRole>
          </PrivateRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
