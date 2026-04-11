const activityService = require("../services/activityService");
const logger = require("../utils/logger");

exports.getActivity = async (req, res) => {
  try {
    const activities = await activityService.getUserActivity(
      req.user._id,
      req.user.role,
    );
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    logger.error(`Activity error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getActivityStats = async (req, res) => {
  try {
    const stats = await activityService.getActivityStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    logger.error(`Activity stats error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};
