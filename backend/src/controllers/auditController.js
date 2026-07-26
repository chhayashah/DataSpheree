const auditService = require("../services/auditService");
const logger = require("../utils/logger");

exports.getAuditLog = async (req, res) => {
  try {
    const { entries, total, page, pages, limit } =
      await auditService.getAuditLog(req.query);
    res.status(200).json({
      success: true,
      data: entries,
      pagination: { total, page, pages, limit },
      actionTypes: auditService.AUDIT_ACTIONS,
    });
  } catch (error) {
    logger.error(`Audit log error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};
