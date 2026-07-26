const analyticsService = require("../services/analyticsService");
const logger = require("../utils/logger");

const previousRange = (from, to) => {
  if (!from || !to) return null;
  const start = new Date(from);
  const end = new Date(to);
  const durationMs = end - start;
  const prevTo = new Date(start.getTime() - 1);
  const prevFrom = new Date(prevTo.getTime() - durationMs);
  return { from: prevFrom.toISOString(), to: prevTo.toISOString() };
};

exports.getStats = async (req, res) => {
  try {
    const { from, to, compare } = req.query;
    const data = await analyticsService.getStats(req.user._id, req.user.role, {
      from,
      to,
    });

    let previous = null;
    if (compare === "true") {
      const prevRange = previousRange(from, to);
      if (prevRange) {
        previous = await analyticsService.getStats(
          req.user._id,
          req.user.role,
          prevRange,
        );
      }
    }

    res.status(200).json({ success: true, data, previous });
  } catch (error) {
    logger.error(`Stats error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getTopUsers = async (req, res) => {
  try {
    const topUsers = await analyticsService.getTopUsers(
      req.user._id,
      req.user.role,
      req.query,
    );
    res.status(200).json({ success: true, data: topUsers });
  } catch (error) {
    logger.error(`Top users error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getPeakTime = async (req, res) => {
  try {
    const peakTime = await analyticsService.getPeakTime(
      req.user._id,
      req.user.role,
      req.query,
    );
    res.status(200).json({ success: true, data: peakTime });
  } catch (error) {
    logger.error(`Peak time error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getDailyTrend = async (req, res) => {
  try {
    const trend = await analyticsService.getDailyTrend(
      req.user._id,
      req.user.role,
      req.query,
    );
    res.status(200).json({ success: true, data: trend });
  } catch (error) {
    logger.error(`Daily trend error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getInsights = async (req, res) => {
  try {
    const insights = await analyticsService.getInsights(
      req.user._id,
      req.user.role,
      req.query,
    );
    res.status(200).json({ success: true, data: insights });
  } catch (error) {
    logger.error(`Insights error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};
