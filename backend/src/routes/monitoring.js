const express = require("express");
const router = express.Router();
const {
  getSystemHealth,
  getErrorLogs,
} = require("../controllers/monitoringController");
const { protect, authorize } = require("../middleware/auth");
const { PERMISSIONS } = require("../constants");

router.use(protect, authorize(PERMISSIONS.SYSTEM_MONITOR_VIEW));

router.get("/health", getSystemHealth);
router.get("/errors", getErrorLogs);

module.exports = router;
