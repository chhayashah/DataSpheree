const express = require("express");
const router = express.Router();
const {
  listReports,
  generateReport,
  getReport,
  deleteReport,
} = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/auth");
const { PERMISSIONS } = require("../constants");

router.get("/", protect, authorize(PERMISSIONS.REPORT_VIEW), listReports);
router.post("/", protect, authorize(PERMISSIONS.REPORT_EXPORT), generateReport);
router.get("/:id", protect, authorize(PERMISSIONS.REPORT_VIEW), getReport);
router.delete(
  "/:id",
  protect,
  authorize(PERMISSIONS.REPORT_EXPORT),
  deleteReport,
);

module.exports = router;
