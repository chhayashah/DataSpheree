import { Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../features/auth/pages/LoginPage";
import SignupPage from "../features/auth/pages/SignupPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import DataUploadPage from "../features/data/pages/DataUploadPage";
import DataTablePage from "../features/data/pages/DataTablePage";
import InsightsPage from "../features/dashboard/pages/InsightsPage";
import ActivityPage from "../features/dashboard/pages/ActivityPage";



const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) {
    window.location.href = "/login";
    return null;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
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
            <DataUploadPage />
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
        path="/insights"
        element={
          <PrivateRoute>
            <InsightsPage />
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
