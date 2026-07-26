const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { logActivity } = require("./activityService");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  preferences: user.preferences,
});

exports.registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already registered");

  const user = await User.create({ name, email, password });

  return {
    token: generateToken(user._id),
    user: formatUser(user),
  };
};

exports.loginUser = async ({ email, password }, req) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Invalid email or password");
  }

  if (user.status === "suspended") {
    throw new Error(
      "This account has been suspended. Contact an administrator.",
    );
  }

  await logActivity({
    userId: user._id,
    action: "login",
    details: "User logged in",
    req,
  });

  return {
    token: generateToken(user._id),
    user: formatUser(user),
  };
};

exports.getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return formatUser(user);
};

/**
 * Self-service profile edit — deliberately separate from
 * userService.updateUser, which is admin-only (gated by USER_MANAGE)
 * and acts on someone else's account. This acts only on req.user's own
 * record; there's no id parameter to mix up.
 */
exports.updateProfile = async (userId, { name, email }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (name) user.name = name;
  if (email) user.email = email;
  await user.save();

  return formatUser(user);
};

exports.changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new Error("User not found");

  if (!(await user.matchPassword(currentPassword))) {
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword; // pre-save hook re-hashes
  await user.save();

  await logActivity({
    userId,
    action: "update",
    details: "Password changed",
  });

  return true;
};

exports.updatePreferences = async (userId, preferences) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.preferences = { ...user.preferences, ...preferences };
  await user.save();

  return formatUser(user);
};
