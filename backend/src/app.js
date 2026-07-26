require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/auth");
const dataRoutes = require("./routes/data");
const analyticsRoutes = require("./routes/analytics");
const rateLimiter = require("./middleware/rateLimiter");
const logger = require("./utils/logger");
const activityRoutes = require("./routes/activity");
const usersRoutes = require("./routes/users");
const auditRoutes = require("./routes/audit");
const notificationsRoutes = require("./routes/notifications");
const monitoringRoutes = require("./routes/monitoring");
const reportsRoutes = require("./routes/reports");
const errorHandler = require("./middleware/errorHandler");
const { recordRequest, recordError } = require("./utils/metrics");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/", rateLimiter);

app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.originalUrl}`);
  next();
});

// Real request/error tracking for the Monitoring module. Deliberately
// status-code-based rather than exception-based: every controller in
// this codebase catches its own errors and responds directly instead
// of calling next(err), so relying on the error-handling middleware
// alone would miss almost everything. This catches a 400/404/500
// response no matter which code path produced it.
app.use((req, res, next) => {
  recordRequest();

  const originalJson = res.json.bind(res);
  let responseBody;
  res.json = (body) => {
    responseBody = body;
    return originalJson(body);
  };

  res.on("finish", () => {
    if (res.statusCode >= 400) {
      recordError({
        message: responseBody?.message || `HTTP ${res.statusCode}`,
        path: req.originalUrl,
        statusCode: res.statusCode,
      });
    }
  });

  next();
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/data", dataRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/activity", activityRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/audit", auditRoutes);
app.use("/api/v1/notifications", notificationsRoutes);
app.use("/api/v1/monitoring", monitoringRoutes);
app.use("/api/v1/reports", reportsRoutes);

app.get("/health", (req, res) => {
  res.json({ success: true, message: "DataSphere API running" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Express 5 compatible error handler — 4 parameters zaroori hain
app.use(errorHandler);

module.exports = app;
