const dataService = require("../services/dataService");
const logger = require("../utils/logger");

exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "CSV file required" });
    }

    if (!req.file.originalname.endsWith(".csv")) {
      return res
        .status(400)
        .json({ success: false, message: "Only CSV files allowed" });
    }

    const record = await dataService.ingestCSV(req.file, req.user._id,req);

    res.status(201).json({
      success: true,
      message: `CSV uploaded: ${record.totalRows} rows processed`,
      data: {
        id: record._id,
        filename: record.filename,
        totalRows: record.totalRows,
        status: record.status,
        createdAt: record.createdAt,
      },
    });
  } catch (error) {
    logger.error(`CSV upload error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getRecords = async (req, res) => {
  try {
    const records = await dataService.getRecords(req.user._id, req.user.role);
    res
      .status(200)
      .json({ success: true, count: records.length, data: records });
  } catch (error) {
    logger.error(`Get records error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getRecordById = async (req, res) => {
  try {
    const record = await dataService.getRecordById(
      req.params.id,
      req.user._id,
      req.user.role,
    );
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    logger.error(`Get record error: ${error.message}`);
    res.status(404).json({ success: false, message: error.message });
  }
};
