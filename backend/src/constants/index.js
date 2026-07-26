const {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
} = require("./permissions");

const ROLES = {
  ADMIN: "admin",
  ANALYST: "analyst",
  VIEWER: "viewer",
};

const DATA_SOURCES = {
  CSV: "csv",
  API: "api",
};

const DATA_STATUS = {
  PENDING: "pending",
  PROCESSED: "processed",
  FAILED: "failed",
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

const FILE_LIMITS = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_TYPES: ["text/csv"],
};

const JWT = {
  EXPIRE: "7d",
};

module.exports = {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  DATA_SOURCES,
  DATA_STATUS,
  PAGINATION,
  FILE_LIMITS,
  JWT,
};
