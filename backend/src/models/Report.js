const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    summary: {
      totalRecords: Number,
      totalRows: Number,
      totalUsers: Number,
    },
    trend: [
      {
        date: String,
        uploads: Number,
        totalRows: Number,
      },
    ],
    status: {
      type: String,
      enum: ["ready", "failed"],
      default: "ready",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Report", ReportSchema);
