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

exports.loginUser = async ({ email, password },req) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Invalid email or password");
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
