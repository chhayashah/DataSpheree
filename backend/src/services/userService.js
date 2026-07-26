const User = require("../models/User");
const { logActivity } = require("./activityService");
const { createNotification } = require("./notificationService");
const { generateTempPassword } = require("../utils/generatePassword");
const { ROLES, PAGINATION } = require("../constants");
const logger = require("../utils/logger");

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
});

exports.listUsers = async (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(
    parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT,
  );

  const filter = {};
  if (query.search) {
    const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: { $regex: escaped, $options: "i" } },
      { email: { $regex: escaped, $options: "i" } },
    ];
  }
  if (query.role && Object.values(ROLES).includes(query.role)) {
    filter.role = query.role;
  }
  if (query.status && ["active", "suspended"].includes(query.status)) {
    filter.status = query.status;
  }

  const SORTABLE_FIELDS = ["createdAt", "name", "email", "role"];
  const sortBy = SORTABLE_FIELDS.includes(query.sortBy)
    ? query.sortBy
    : "createdAt";
  const sortDir = query.sortDir === "asc" ? 1 : -1;

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ [sortBy]: sortDir })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    users: users.map(formatUser),
    total,
    page,
    pages: Math.max(Math.ceil(total / limit), 1),
    limit,
  };
};

exports.getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");
  return formatUser(user);
};

/**
 * Admin-provisioned account creation — the entry point this whole RBAC
 * system was missing until now. No email service is configured here,
 * so the temp password is returned once for the admin to share
 * manually.
 */
exports.inviteUser = async ({ name, email, role }, invitedByUserId, req) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("A user with this email already exists");

  if (role && !Object.values(ROLES).includes(role)) {
    throw new Error("Invalid role");
  }

  const tempPassword = generateTempPassword();
  const user = await User.create({
    name,
    email,
    password: tempPassword,
    role: role || ROLES.VIEWER,
  });

  await logActivity({
    userId: invitedByUserId,
    action: "invite",
    details: `Invited ${email} as ${user.role}`,
    req,
  });

  await createNotification({
    userId: user._id,
    type: "invited",
    message: `Welcome to DataSphere — you've been added as ${user.role}.`,
  });

  logger.info(`User invited: ${email} (${user.role}) by ${invitedByUserId}`);

  return { user: formatUser(user), tempPassword };
};

exports.updateUser = async (id, { name, email }, req) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  if (name) user.name = name;
  if (email) user.email = email;
  await user.save();

  await logActivity({
    userId: id,
    action: "update",
    details: "Profile details updated by an administrator",
    req,
  });

  return formatUser(user);
};

/**
 * Changing a role must never leave zero admins in the system — that's
 * a genuine self-lockout bug, not a theoretical one, and it's cheap to
 * guard against here.
 */
exports.changeUserRole = async (id, role, requesterId, req) => {
  if (!Object.values(ROLES).includes(role)) {
    throw new Error("Invalid role");
  }

  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  if (user.role === ROLES.ADMIN && role !== ROLES.ADMIN) {
    const adminCount = await User.countDocuments({ role: ROLES.ADMIN });
    if (adminCount <= 1) {
      throw new Error(
        "Can't remove the last admin — promote another user first",
      );
    }
  }

  const previousRole = user.role;
  user.role = role;
  await user.save();

  await logActivity({
    userId: id,
    action: "role_change",
    details: `Role changed from ${previousRole} to ${role}`,
    req,
  });

  await createNotification({
    userId: id,
    type: "role_change",
    message: `Your role was changed to ${role}.`,
  });

  return formatUser(user);
};

exports.setUserStatus = async (id, status, requesterId, req) => {
  if (!["active", "suspended"].includes(status)) {
    throw new Error("Invalid status");
  }

  if (id === requesterId?.toString() && status === "suspended") {
    throw new Error("You can't suspend your own account");
  }

  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  user.status = status;
  await user.save();

  await logActivity({
    userId: id,
    action: status === "suspended" ? "suspend" : "activate",
    details:
      status === "suspended"
        ? "Account suspended by an administrator"
        : "Account reactivated by an administrator",
    req,
  });

  await createNotification({
    userId: id,
    type: status === "suspended" ? "suspended" : "activated",
    message:
      status === "suspended"
        ? "Your account has been suspended."
        : "Your account has been reactivated.",
  });

  return formatUser(user);
};
