const express = require("express");
const router = express.Router();
const { getAuditLog } = require("../controllers/auditController");
const { protect, authorize } = require("../middleware/auth");
const { PERMISSIONS } = require("../constants");

router.get("/", protect, authorize(PERMISSIONS.AUDIT_VIEW), getAuditLog);

module.exports = router;
