const userService = require("../services/userService");
const logger = require("../utils/logger");

exports.listUsers = async (req, res) => {
  try {
    const { users, total, page, pages, limit } = await userService.listUsers(
      req.query,
    );
    res.status(200).json({
      success: true,
      data: users,
      pagination: { total, page, pages, limit },
    });
  } catch (error) {
    logger.error(`List users error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    logger.error(`Get user error: ${error.message}`);
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.inviteUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Name and email are required" });
    }

    const result = await userService.inviteUser(
      { name, email, role },
      req.user._id,
      req,
    );

    res.status(201).json({
      success: true,
      message: "User invited",
      data: result.user,
      tempPassword: result.tempPassword,
    });
  } catch (error) {
    logger.error(`Invite user error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    logger.error(`Update user error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.changeUserRole = async (req, res) => {
  try {
    const user = await userService.changeUserRole(
      req.params.id,
      req.body.role,
      req.user._id,
      req,
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    logger.error(`Change role error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.setUserStatus = async (req, res) => {
  try {
    const user = await userService.setUserStatus(
      req.params.id,
      req.body.status,
      req.user._id,
      req,
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    logger.error(`Set status error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};
