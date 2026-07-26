require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./config/socket");
const { initDataSocket } = require("./sockets/dataSocket");
const { initNotificationSocket } = require("./sockets/notificationSocket");

const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);
initDataSocket();
initNotificationSocket();

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
    logger.info(`Health check: http://localhost:${PORT}/health`);
  });
};

process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

startServer();
