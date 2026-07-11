
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

const app = express();

// Render proxy ke peeche hai, isliye trust proxy set karna zaroori hai
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/", rateLimiter);

app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/data", dataRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/activity", activityRoutes);

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Mini OneLake running!" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Express 5 compatible error handler — 4 parameters zaroori hain
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  logger.error(`${statusCode} - ${message} - ${req.originalUrl}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const authRoutes = require("./routes/auth");
// const dataRoutes = require("./routes/data");
// const analyticsRoutes = require("./routes/analytics");
// const rateLimiter = require("./middleware/rateLimiter");
// const logger = require("./utils/logger");
// const activityRoutes = require("./routes/activity");

// const app = express();

// app.use(helmet());
// app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use("/api/", rateLimiter);

// app.use((req, res, next) => {
//   logger.debug(`${req.method} ${req.originalUrl}`);
//   next();
// });

// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/data", dataRoutes);
// app.use("/api/v1/analytics", analyticsRoutes);
// app.use("/api/v1/activity", activityRoutes);

// app.get("/health", (req, res) => {
//   res.json({ success: true, message: "Mini OneLake running!" });
// });

// app.use((req, res) => {
//   res.status(404).json({ success: false, message: "Route not found" });
// });

// // Express 5 compatible error handler — 4 parameters zaroori hain
// app.use((err, req, res, next) => {
//   let statusCode = err.statusCode || 500;
//   let message = err.message || "Internal Server Error";

//   if (err.code === 11000) {
//     statusCode = 400;
//     message = "Duplicate field value entered";
//   }

//   if (err.name === "ValidationError") {
//     statusCode = 400;
//     message = Object.values(err.errors)
//       .map((e) => e.message)
//       .join(", ");
//   }

//   if (err.name === "JsonWebTokenError") {
//     statusCode = 401;
//     message = "Invalid token";
//   }

//   logger.error(`${statusCode} - ${message} - ${req.originalUrl}`);

//   res.status(statusCode).json({
//     success: false,
//     message,
//     ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
//   });
// });

// module.exports = app;
