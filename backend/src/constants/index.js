// User roles
const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

// Data sources
const DATA_SOURCES = {
  CSV: "csv",
  API: "api",
};

// Data status
const DATA_STATUS = {
  PENDING: "pending",
  PROCESSED: "processed",
  FAILED: "failed",
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// File upload limits
const FILE_LIMITS = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_TYPES: ["text/csv"],
};

// JWT
const JWT = {
  EXPIRE: "7d",
};

module.exports = {
  ROLES,
  DATA_SOURCES,
  DATA_STATUS,
  PAGINATION,
  FILE_LIMITS,
  JWT,
};
