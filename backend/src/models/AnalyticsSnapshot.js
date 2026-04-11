const mongoose = require("mongoose");

const analyticsSnapshotSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },
    totalRecords: { type: Number, default: 0 },
    totalRows: { type: Number, default: 0 },
    topUsers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        email: String,
        uploadCount: Number,
      },
    ],
    peakHour: { type: Number, default: 0 },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AnalyticsSnapshot", analyticsSnapshotSchema);
