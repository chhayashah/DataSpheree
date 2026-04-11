const express = require("express");
const router = express.Router();
const {
  getActivity,
  getActivityStats,
} = require("../controllers/activityController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getActivity);
router.get("/stats", protect, getActivityStats);

module.exports = router;
