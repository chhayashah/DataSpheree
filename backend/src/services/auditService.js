const UserActivity = require("../models/UserActivity");
const { PAGINATION } = require("../constants");

const AUDIT_ACTIONS = [
  "invite",
  "role_change",
  "suspend",
  "activate",
  "delete",
  "update",
];

exports.getAuditLog = async (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(
    parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT,
  );

  const filter = { action: { $in: AUDIT_ACTIONS } };

  if (query.action && AUDIT_ACTIONS.includes(query.action)) {
    filter.action = query.action;
  }

  if (query.actor) {
    filter.user = query.actor;
  }

  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }

  const [entries, total] = await Promise.all([
    UserActivity.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    UserActivity.countDocuments(filter),
  ]);

  return {
    entries,
    total,
    page,
    pages: Math.max(Math.ceil(total / limit), 1),
    limit,
  };
};

exports.AUDIT_ACTIONS = AUDIT_ACTIONS;
