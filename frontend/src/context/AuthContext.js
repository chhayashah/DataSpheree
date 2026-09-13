import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { useToast } from "./ToastContext";
import { hasPermission as checkPermission } from "../constants/permissions";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const { token, user } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast(`Welcome back, ${user.name.split(" ")[0]}`, "success");
      navigate("/dashboard");
    },
    [navigate, toast],
  );

  const register = useCallback(
    async (name, email, password) => {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });
      const { token, user } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast("Account created — welcome to DataSphere", "success");
      navigate("/dashboard");
    },
    [navigate, toast],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast("You've been signed out", "info");
    navigate("/login");
  }, [navigate, toast]);

  // Stable reference (useCallback) so components that depend on it in an
  // effect don't re-run on every unrelated AuthProvider render — only
  // when the role actually changes (login/logout).
  const hasPermission = useCallback(
    (permission) => checkPermission(user?.role, permission),
    [user?.role],
  );

  // Lets self-service edits (Profile name/email, notification
  // preferences) sync the header/sidebar display immediately, without
  // a full re-login — merges into both React state and the localStorage
  // copy login/register already maintain.
  const updateUserInContext = useCallback((partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      hasPermission,
      updateUserInContext,
    }),
    [user, login, logout, register, loading, hasPermission, updateUserInContext],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};