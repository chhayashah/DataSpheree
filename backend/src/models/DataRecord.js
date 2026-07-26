const mongoose = require("mongoose");
const { DATA_SOURCES, DATA_STATUS } = require("../constants");
const dataRecordSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: Object.values(DATA_SOURCES),
      required: true,
    },
    rawData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    processedData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    totalRows: {
      type: Number,
      default: 0,
    },
    fileSize: {
      type: Number, // bytes — captured from multer's file.size at upload
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(DATA_STATUS),
      default: DATA_STATUS.PENDING,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DataRecord", dataRecordSchema);
