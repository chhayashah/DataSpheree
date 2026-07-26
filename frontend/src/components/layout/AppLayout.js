import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppRoutes from "../../routes/AppRoutes";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AUTH_PATHS = ["/login", "/signup"];
const COLLAPSE_STORAGE_KEY = "ds:sidebarCollapsed";

const AppLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = AUTH_PATHS.includes(location.pathname);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSE_STORAGE_KEY) === "true",
  );

  useEffect(() => {
    localStorage.setItem(COLLAPSE_STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  if (!user || isAuthPage) {
    return <AppRoutes />;
  }

  return (
    <div className="min-h-screen bg-canvas">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Sidebar
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
      />

      <div className={`md:pl-16 ${collapsed ? "" : "lg:pl-60"}`}>
        <Topbar
          pathname={location.pathname}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <main id="main-content" className="p-4 md:p-8 max-w-[1280px] mx-auto">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
