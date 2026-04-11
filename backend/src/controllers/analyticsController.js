const analyticsService = require("../services/analyticsService");
const logger = require("../utils/logger");

exports.getStats = async (req, res) => {
  try {
    const stats = await analyticsService.getStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    logger.error(`Stats error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getTopUsers = async (req, res) => {
  try {
    const topUsers = await analyticsService.getTopUsers();
    res.status(200).json({ success: true, data: topUsers });
  } catch (error) {
    logger.error(`Top users error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getPeakTime = async (req, res) => {
  try {
    const peakTime = await analyticsService.getPeakTime();
    res.status(200).json({ success: true, data: peakTime });
  } catch (error) {
    logger.error(`Peak time error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getDailyTrend = async (req, res) => {
  try {
    const trend = await analyticsService.getDailyTrend();
    res.status(200).json({ success: true, data: trend });
  } catch (error) {
    logger.error(`Daily trend error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};
exports.getInsights = async (req, res) => {
  try {
    const insights = await analyticsService.getInsights();
    res.status(200).json({ success: true, data: insights });
  } catch (error) {
    logger.error(`Insights error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};
