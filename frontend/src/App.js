import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import { useAuth } from "./context/AuthContext";

const AppLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {user && !hideNavbar && <Navbar />}
      <AppRoutes />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
