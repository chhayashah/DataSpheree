const authService = require("../services/authService");
const logger = require("../utils/logger");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Name, email, password required" });
    }

    const result = await authService.registerUser({ name, email, password });

    logger.info(`New user registered: ${email}`);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const result = await authService.loginUser({ email, password },req);

    logger.info(`User logged in: ${email}`);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(401).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    logger.error(`GetMe error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};
