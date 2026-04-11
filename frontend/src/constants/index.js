export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";
export const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  DATA_UPLOAD: "/data/upload",
  DATA_TABLE: "/data",
};

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};
