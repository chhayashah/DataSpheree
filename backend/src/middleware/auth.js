const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");
const { hasPermission } = require("../constants");

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    if (req.user.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "This account has been suspended.",
      });
    }

    next();
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    return res
      .status(401)
      .json({ success: false, message: "Token invalid or expired" });
  }
};

/**
 * Route-level authorization. Takes one or more PERMISSIONS values (see
 * constants/permissions.js), never role names — the caller declares what
 * capability the route requires, and hasPermission() is the only place
 * that knows which roles grant it. If the requesting user's role grants
 * ANY of the listed permissions, the request proceeds.
 *
 * Usage: router.post("/upload", protect, authorize(PERMISSIONS.DATA_UPLOAD), ...)
 */
exports.authorize =
  (...permissions) =>
  (req, res, next) => {
    const allowed = permissions.some((permission) =>
      hasPermission(req.user.role, permission),
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
