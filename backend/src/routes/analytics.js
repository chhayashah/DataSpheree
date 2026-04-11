const express = require("express");
const router = express.Router();
const {
  getStats,
  getTopUsers,
  getPeakTime,
  getDailyTrend,
  getInsights,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");

// authorize(ROLES.ADMIN) hatao — sabhi users dekh saken
router.get("/stats", protect, getStats);
router.get("/top-users", protect, getTopUsers);
router.get("/peak-time", protect, getPeakTime);
router.get("/daily-trend", protect, getDailyTrend);
router.get("/insights", protect, getInsights);

module.exports = router;
