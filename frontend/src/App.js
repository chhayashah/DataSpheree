import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import AppRoutes from "./routes/AppRoutes";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

const AppLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  if (!user || isAuthPage) {
    return <AppRoutes />;
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <div className="pl-60">
        <Topbar pathname={location.pathname} />
        <main className="p-8 max-w-[1280px] mx-auto">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
