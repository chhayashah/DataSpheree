const DataRecord = require("../models/DataRecord");
const User = require("../models/User");
const { parseCSV } = require("../utils/csvParser");
const { dataEmitter, DATA_EVENTS } = require("../events/dataEvents");
const logger = require("../utils/logger");
const { logActivity } = require("./activityService");
const { createNotification } = require("./notificationService");
const {
  PERMISSIONS,
  hasPermission,
  PAGINATION,
  DATA_STATUS,
} = require("../constants");

exports.ingestCSV = async (file, userId, req) => {
  const rawData = await parseCSV(file.buffer);

  if (!rawData || rawData.length === 0) {
    throw new Error("CSV file empty hai ya invalid format hai");
  }

  const processedData = rawData.filter((row) =>
    Object.values(row).some((val) => val !== "" && val !== null),
  );

  const record = await DataRecord.create({
    filename: file.originalname,
    source: "csv",
    rawData,
    processedData,
    totalRows: processedData.length,
    fileSize: file.size,
    status: "processed",
    uploadedBy: userId,
  });

  await logActivity({
    userId,
    action: "upload",
    details: `Uploaded ${file.originalname} — ${processedData.length} rows`,
    relatedRecord: record._id,
    req,
  });

  logger.info(
    `CSV ingested: ${file.originalname}, rows: ${processedData.length}`,
  );

  dataEmitter.emit(DATA_EVENTS.INGESTED, {
    id: record._id,
    filename: record.filename,
    totalRows: record.totalRows,
    uploadedBy: userId,
    createdAt: record.createdAt,
  });

  const uploader = await User.findById(userId).select("preferences");
  if (uploader?.preferences?.notifyOnUpload !== false) {
    await createNotification({
      userId,
      type: "upload_processed",
      message: `${record.filename} finished processing — ${record.totalRows} rows.`,
      relatedRecord: record._id,
    });
  }

  return record;
};

/**
 * Paginated, searchable, sortable, filterable dataset list — the fix for
 * the earlier audit's H1 finding (no pagination anywhere). Every future
 * list endpoint (Reports, Audit Logs, Users) should copy this shape:
 * { records, total, page, pages, limit }.
 */
exports.getRecords = async (userId, role, query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(
    parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT,
  );

  const filter = hasPermission(role, PERMISSIONS.DATA_VIEW_ALL)
    ? {}
    : { uploadedBy: userId };

  if (query.search) {
    const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.filename = { $regex: escaped, $options: "i" };
  }

  if (query.status && Object.values(DATA_STATUS).includes(query.status)) {
    filter.status = query.status;
  }

  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }

  const SORTABLE_FIELDS = ["createdAt", "filename", "totalRows", "status"];
  const sortBy = SORTABLE_FIELDS.includes(query.sortBy)
    ? query.sortBy
    : "createdAt";
  const sortDir = query.sortDir === "asc" ? 1 : -1;

  const [records, total] = await Promise.all([
    DataRecord.find(filter)
      .select("-rawData -processedData")
      .populate("uploadedBy", "name email")
      .sort({ [sortBy]: sortDir })
      .skip((page - 1) * limit)
      .limit(limit),
    DataRecord.countDocuments(filter),
  ]);

  return {
    records,
    total,
    page,
    pages: Math.max(Math.ceil(total / limit), 1),
    limit,
  };
};

exports.getRecordById = async (id, userId, role) => {
  const record = await DataRecord.findById(id).populate(
    "uploadedBy",
    "name email",
  );

  if (!record) throw new Error("Record not found");

  const isOwner = record.uploadedBy._id.toString() === userId.toString();
  if (!isOwner && !hasPermission(role, PERMISSIONS.DATA_VIEW_ALL)) {
    throw new Error("Not authorized to view this record");
  }

  return record;
};

/**
 * Rule-based, dataset-scoped insights — same "explicit JavaScript logic,
 * not fake AI" philosophy as the global Insights module, just narrowed
 * to comparing this one record against its peers.
 */
exports.getRecordInsights = async (record, userId, role) => {
  const scopeFilter = hasPermission(role, PERMISSIONS.DATA_VIEW_ALL)
    ? {}
    : { uploadedBy: userId };

  const peers = await DataRecord.find({
    ...scopeFilter,
    _id: { $ne: record._id },
  }).select("totalRows fileSize createdAt");

  const insights = [];

  if (peers.length === 0) {
    insights.push({
      type: "info",
      message:
        "This is the only dataset in scope — no peer comparison available yet.",
    });
    return insights;
  }

  const avgRows =
    peers.reduce((sum, p) => sum + (p.totalRows || 0), 0) / peers.length;

  if (record.totalRows > avgRows * 1.5) {
    insights.push({
      type: "warning",
      message: `This dataset has ${Math.round(
        record.totalRows / avgRows,
      )}x more rows than the average dataset in scope (${Math.round(avgRows)} rows).`,
    });
  } else if (record.totalRows < avgRows * 0.5) {
    insights.push({
      type: "info",
      message: `This dataset is smaller than usual — ${record.totalRows} rows vs. an average of ${Math.round(avgRows)}.`,
    });
  } else {
    insights.push({
      type: "success",
      message: `Row count (${record.totalRows}) is in line with the average dataset in scope.`,
    });
  }

  const sameDayCount = peers.filter(
    (p) =>
      new Date(p.createdAt).toDateString() ===
      new Date(record.createdAt).toDateString(),
  ).length;
  if (sameDayCount > 0) {
    insights.push({
      type: "info",
      message: `${sameDayCount} other dataset${sameDayCount === 1 ? " was" : "s were"} uploaded the same day as this one.`,
    });
  }

  return insights;
};

/**
 * Other datasets from the same uploader — the "Related" tab. Simple,
 * real relation (no ML/embedding matching pretending to be smarter than
 * it is), consistent with the project's rule-based-over-fake approach.
 */
exports.getRelatedRecords = async (record) => {
  return DataRecord.find({
    uploadedBy: record.uploadedBy._id,
    _id: { $ne: record._id },
  })
    .select("filename totalRows status createdAt")
    .sort({ createdAt: -1 })
    .limit(5);
};

exports.deleteRecord = async (id, userId, req) => {
  const record = await DataRecord.findById(id);
  if (!record) throw new Error("Record not found");

  await DataRecord.deleteOne({ _id: id });

  await logActivity({
    userId,
    action: "delete",
    details: `Deleted ${record.filename}`,
    req,
  });

  logger.info(`Record deleted: ${record.filename} (${id})`);
  return record;
};

exports.bulkDeleteRecords = async (ids, userId, req) => {
  const records = await DataRecord.find({ _id: { $in: ids } }).select(
    "filename",
  );

  const result = await DataRecord.deleteMany({ _id: { $in: ids } });

  await logActivity({
    userId,
    action: "delete",
    details: `Bulk deleted ${result.deletedCount} dataset(s)`,
    req,
  });

  logger.info(`Bulk delete: ${result.deletedCount} record(s)`);
  return {
    deletedCount: result.deletedCount,
    filenames: records.map((r) => r.filename),
  };
};
