const mongoose = require("mongoose");
const os = require("os");
const { getSnapshot } = require("../utils/metrics");
const { getIO } = require("../config/socket");

const DB_STATE_LABELS = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

exports.getSystemHealth = () => {
  const mem = process.memoryUsage();
  const snapshot = getSnapshot();

  let activeConnections = 0;
  try {
    activeConnections = getIO().sockets.sockets.size;
  } catch {
    activeConnections = 0;
  }

  return {
    uptimeSeconds: Math.floor(process.uptime()),
    memory: {
      rssMb: Number((mem.rss / 1024 / 1024).toFixed(1)),
      heapUsedMb: Number((mem.heapUsed / 1024 / 1024).toFixed(1)),
      heapTotalMb: Number((mem.heapTotal / 1024 / 1024).toFixed(1)),
    },
    database: {
      status: DB_STATE_LABELS[mongoose.connection.readyState] || "unknown",
    },
    socket: { activeConnections },
    requests: {
      total: snapshot.requestCount,
      errors: snapshot.errorCount,
      errorRatePct:
        snapshot.requestCount > 0
          ? Number(
              ((snapshot.errorCount / snapshot.requestCount) * 100).toFixed(2),
            )
          : 0,
    },
    loadAverage: os.loadavg(),
  };
};

exports.getErrorLogs = (query = {}) => {
  const limit = Math.min(parseInt(query.limit, 10) || 20, 50);
  return getSnapshot().recentErrors.slice(0, limit);
};
