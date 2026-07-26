const reportService = require("../services/reportService");
const logger = require("../utils/logger");

exports.listReports = async (req, res) => {
  try {
    const { reports, total, page, pages, limit } =
      await reportService.listReports(req.user._id, req.user.role, req.query);
    res.status(200).json({
      success: true,
      data: reports,
      pagination: { total, page, pages, limit },
    });
  } catch (error) {
    logger.error(`List reports error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const { title, from, to } = req.body;
    if (!from || !to) {
      return res
        .status(400)
        .json({
          success: false,
          message: "A date range (from, to) is required",
        });
    }

    const report = await reportService.generateReport(
      req.user._id,
      req.user.role,
      {
        title,
        from,
        to,
      },
    );

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    logger.error(`Generate report error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = await reportService.getReportById(
      req.params.id,
      req.user._id,
      req.user.role,
    );
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    logger.error(`Get report error: ${error.message}`);
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    await reportService.deleteReport(
      req.params.id,
      req.user._id,
      req.user.role,
    );
    res.status(200).json({ success: true, message: "Report deleted" });
  } catch (error) {
    logger.error(`Delete report error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};
