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

    const record = await dataService.ingestCSV(req.file, req.user._id, req);

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
    const { records, total, page, pages, limit } = await dataService.getRecords(
      req.user._id,
      req.user.role,
      req.query,
    );
    res.status(200).json({
      success: true,
      data: records,
      pagination: { total, page, pages, limit },
    });
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

    const [insights, related] = await Promise.all([
      dataService.getRecordInsights(record, req.user._id, req.user.role),
      dataService.getRelatedRecords(record),
    ]);

    res.status(200).json({ success: true, data: record, insights, related });
  } catch (error) {
    logger.error(`Get record error: ${error.message}`);
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    await dataService.deleteRecord(req.params.id, req.user._id, req);
    res.status(200).json({ success: true, message: "Dataset deleted" });
  } catch (error) {
    logger.error(`Delete record error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.bulkDeleteRecords = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "ids array required" });
    }

    const result = await dataService.bulkDeleteRecords(ids, req.user._id, req);
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} dataset(s) deleted`,
      data: result,
    });
  } catch (error) {
    logger.error(`Bulk delete error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};
