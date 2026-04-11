require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./config/socket");
const { initDataSocket } = require("./sockets/dataSocket");

const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;

// HTTP server banao — Express + Socket.io dono isko use karenge
const server = http.createServer(app);

// Socket.io initialize karo
initSocket(server);
initDataSocket();

// DB connect karo phir server start karo
const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
    logger.info(`Health check: http://localhost:${PORT}/health`);
  });
};

// Unhandled errors handle karo
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

startServer();
