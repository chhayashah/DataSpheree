const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");
const { getUserRoom, getRoleRoom } = require("../utils/socketRooms");

let io;

/**
 * Handshake-time authentication.
 * Runs once per connection attempt, before the connection is accepted.
 * Uses the same JWT_SECRET / verification path as the REST auth middleware
 * (middleware/auth.js) so there is a single source of truth for "is this
 * token valid" — not a second implementation to keep in sync.
 *
 * Role is looked up fresh from the DB (not read off the token) for the same
 * reason REST auth does it this way: the token only proves identity, and a
 * role claim baked into the token could go stale for up to JWT_EXPIRE if an
 * admin changes the user's role mid-session.
 */
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized: no token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new Error("Unauthorized: user not found"));
    }

    if (user.status === "suspended") {
      return next(new Error("Unauthorized: account suspended"));
    }

    socket.userId = user._id.toString();
    socket.userRole = user.role;

    return next();
  } catch (error) {
    logger.error(`Socket auth failed: ${error.message}`);
    return next(new Error("Unauthorized: invalid or expired token"));
  }
};

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    socket.join(getUserRoom(socket.userId));

    if (socket.userRole) {
      socket.join(getRoleRoom(socket.userRole));
    }

    logger.info(
      `Socket connected: ${socket.id} (user: ${socket.userId}, role: ${socket.userRole})`,
    );

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id} (user: ${socket.userId})`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized yet");
  return io;
};

module.exports = { initSocket, getIO };
