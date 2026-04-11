const DataRecord = require("../models/DataRecord");
const User = require("../models/User");

// Overall stats
exports.getStats = async () => {
  const totalRecords = await DataRecord.countDocuments();
  const totalRows = await DataRecord.aggregate([
    { $group: { _id: null, total: { $sum: "$totalRows" } } },
  ]);
  const totalUsers = await User.countDocuments();
  const recentRecords = await DataRecord.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("uploadedBy", "name email");

  return {
    totalRecords,
    totalRows: totalRows[0]?.total || 0,
    totalUsers,
    recentRecords,
  };
};

// Top uploaders
exports.getTopUsers = async () => {
  const topUsers = await DataRecord.aggregate([
    {
      $group: {
        _id: "$uploadedBy",
        uploadCount: { $sum: 1 },
        totalRows: { $sum: "$totalRows" },
      },
    },
    { $sort: { uploadCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        name: "$userInfo.name",
        email: "$userInfo.email",
        uploadCount: 1,
        totalRows: 1,
      },
    },
  ]);

  return topUsers;
};

// Peak upload time (hour of day)
exports.getPeakTime = async () => {
  const peakData = await DataRecord.aggregate([
    {
      $group: {
        _id: { $hour: "$createdAt" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 24 },
    {
      $project: {
        _id: 0,
        hour: "$_id",
        count: 1,
        label: {
          $concat: [
            { $toString: "$_id" },
            ":00 - ",
            { $toString: { $add: ["$_id", 1] } },
            ":00",
          ],
        },
      },
    },
  ]);

  return peakData;
};

// Daily upload trend (last 7 days)
exports.getDailyTrend = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const trend = await DataRecord.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        uploads: { $sum: 1 },
        totalRows: { $sum: "$totalRows" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    {
      $project: {
        _id: 0,
        date: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
          },
        },
        uploads: 1,
        totalRows: 1,
      },
    },
  ]);

  return trend;
};

// AI Insights — trend analysis + anomaly detection
exports.getInsights = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Daily trend last 7 days
  const trend = await DataRecord.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dayOfMonth: "$createdAt" },
        uploads: { $sum: 1 },
        totalRows: { $sum: "$totalRows" },
      },
    },
    { $sort: { "_id": 1 } },
  ]);

  // Average uploads per day
  const avgUploads = trend.length > 0
    ? (trend.reduce((sum, d) => sum + d.uploads, 0) / trend.length).toFixed(1)
    : 0;

  // Anomaly detection — days with uploads > 2x average
  const anomalies = trend.filter((d) => d.uploads > avgUploads * 2).map((d) => ({
    day: d._id,
    uploads: d.uploads,
    message: `Day ${d._id}: Unusually high uploads (${d.uploads} vs avg ${avgUploads})`,
  }));

  // Top performing day
  const peakDay = trend.reduce((max, d) => d.uploads > (max?.uploads || 0) ? d : max, null);

  // Total stats
  const totalRecords = await DataRecord.countDocuments();
  const totalRows = await DataRecord.aggregate([
    { $group: { _id: null, total: { $sum: "$totalRows" } } },
  ]);

  // Smart suggestions
  const suggestions = [];
  if (totalRecords === 0) {
    suggestions.push({ type: "info", message: "Start by uploading your first CSV file!" });
  }
  if (totalRecords > 0 && avgUploads < 1) {
    suggestions.push({ type: "warning", message: "Upload frequency is low — try uploading data daily for better insights." });
  }
  if (anomalies.length > 0) {
    suggestions.push({ type: "alert", message: `${anomalies.length} anomaly detected in upload pattern.` });
  }
  if (totalRecords >= 5) {
    suggestions.push({ type: "success", message: "Great data volume! Consider running aggregation analysis." });
  }

  return {
    summary: {
      totalRecords,
      totalRows: totalRows[0]?.total || 0,
      avgUploadsPerDay: Number(avgUploads),
      activeDays: trend.length,
    },
    trend,
    anomalies,
    peakDay,
    suggestions,
  };
};