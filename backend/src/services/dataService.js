const DataRecord = require("../models/DataRecord");
const { parseCSV } = require("../utils/csvParser");
const { dataEmitter, DATA_EVENTS } = require("../events/dataEvents");
const logger = require("../utils/logger");
const { logActivity } = require("./activityService");

// CSV file ingest karo
exports.ingestCSV = async (file, userId,req) => {
  // CSV parse karo
  const rawData = await parseCSV(file.buffer);

  if (!rawData || rawData.length === 0) {
    throw new Error("CSV file empty hai ya invalid format hai");
  }

  // Data clean karo — null/empty rows hatao
  const processedData = rawData.filter((row) =>
    Object.values(row).some((val) => val !== "" && val !== null),
  );

  // MongoDB mein save karo
  const record = await DataRecord.create({
    filename: file.originalname,
    source: "csv",
    rawData,
    processedData,
    totalRows: processedData.length,
    status: "processed",
    uploadedBy: userId,
  });

  await logActivity({
    userId,
    action: "upload",
    details: `Uploaded ${file.originalname} — ${processedData.length} rows`,
    req,
  });


  logger.info(
    `CSV ingested: ${file.originalname}, rows: ${processedData.length}`,
  );

  // Real-time event emit karo
  dataEmitter.emit(DATA_EVENTS.INGESTED, {
    id: record._id,
    filename: record.filename,
    totalRows: record.totalRows,
    uploadedBy: userId,
    createdAt: record.createdAt,
  });

  return record;
};

// Saare records fetch karo
exports.getRecords = async (userId, role) => {
  // Admin sabke records dekh sakta hai, user sirf apne
  const query = role === "admin" ? {} : { uploadedBy: userId };

  const records = await DataRecord.find(query)
    .populate("uploadedBy", "name email")
    .sort({ createdAt: -1 })
    .limit(50);

  return records;
};

// Single record fetch karo
exports.getRecordById = async (id, userId, role) => {
  const record = await DataRecord.findById(id).populate(
    "uploadedBy",
    "name email",
  );

  if (!record) throw new Error("Record not found");

  // User sirf apna record dekh sakta hai
  if (
    role !== "admin" &&
    record.uploadedBy._id.toString() !== userId.toString()
  ) {
    throw new Error("Not authorized to view this record");
  }

  return record;
};
