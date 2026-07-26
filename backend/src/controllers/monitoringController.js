const monitoringService = require("../services/monitoringService");
const logger = require("../utils/logger");

exports.getSystemHealth = async (req, res) => {
  try {
    const health = monitoringService.getSystemHealth();
    res.status(200).json({ success: true, data: health });
  } catch (error) {
    logger.error(`System health error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getErrorLogs = async (req, res) => {
  try {
    const errors = monitoringService.getErrorLogs(req.query);
    res.status(200).json({ success: true, data: errors });
  } catch (error) {
    logger.error(`Error logs error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};
