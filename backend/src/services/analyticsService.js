const DataRecord = require("../models/DataRecord");
const { PERMISSIONS, hasPermission } = require("../constants");

const buildScopeFilter = (userId, role) =>
  hasPermission(role, PERMISSIONS.DATA_VIEW_ALL) ? {} : { uploadedBy: userId };

const buildDateFilter = (from, to) => {
  if (!from && !to) return {};
  const createdAt = {};
  if (from) createdAt.$gte = new Date(from);
  if (to) createdAt.$lte = new Date(to);
  return { createdAt };
};

const buildFilter = (userId, role, from, to) => ({
  ...buildScopeFilter(userId, role),
  ...buildDateFilter(from, to),
});

exports.getStats = async (userId, role, { from, to } = {}) => {
  const filter = buildFilter(userId, role, from, to);

  const totalRecords = await DataRecord.countDocuments(filter);
  const totalRowsAgg = await DataRecord.aggregate([
    { $match: filter },
    { $group: { _id: null, total: { $sum: "$totalRows" } } },
  ]);
  const contributors = await DataRecord.distinct("uploadedBy", filter);
  const recentRecords = await DataRecord.find(filter)
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("uploadedBy", "name email");

  return {
    totalRecords,
    totalRows: totalRowsAgg[0]?.total || 0,
    totalUsers: contributors.length,
    recentRecords,
  };
};

exports.getTopUsers = async (userId, role, { from, to } = {}) => {
  const filter = buildFilter(userId, role, from, to);

  return DataRecord.aggregate([
    { $match: filter },
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
};

exports.getPeakTime = async (userId, role, { from, to } = {}) => {
  const filter = buildFilter(userId, role, from, to);

  return DataRecord.aggregate([
    { $match: filter },
    { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } },
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
};

exports.getDailyTrend = async (userId, role, { from, to } = {}) => {
  const rangeStart = from
    ? new Date(from)
    : (() => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return d;
      })();
  const rangeEnd = to ? new Date(to) : new Date();

  const filter = {
    ...buildScopeFilter(userId, role),
    createdAt: { $gte: rangeStart, $lte: rangeEnd },
  };

  return DataRecord.aggregate([
    { $match: filter },
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
};

exports.getInsights = async (userId, role, { from, to } = {}) => {
  const trend = await exports.getDailyTrend(userId, role, { from, to });

  const avgUploads =
    trend.length > 0
      ? Number(
          (trend.reduce((sum, d) => sum + d.uploads, 0) / trend.length).toFixed(
            1,
          ),
        )
      : 0;

  const anomalies = trend
    .filter((d) => d.uploads > avgUploads * 2 && avgUploads > 0)
    .map((d) => ({
      type: "danger",
      message: `Unusually high uploads on ${d.date} (${d.uploads} vs. average ${avgUploads}).`,
    }));

  const peakDay = trend.reduce(
    (max, d) => (d.uploads > (max?.uploads || 0) ? d : max),
    null,
  );

  const { totalRecords, totalRows } = await exports.getStats(userId, role, {
    from,
    to,
  });

  const suggestions = [];
  if (totalRecords === 0) {
    suggestions.push({
      type: "info",
      message:
        "No datasets in this range yet — try a wider date range or upload a CSV.",
    });
  }
  if (totalRecords > 0 && avgUploads < 1) {
    suggestions.push({
      type: "warning",
      message:
        "Upload frequency is low in this range — more frequent uploads improve trend accuracy.",
    });
  }
  if (anomalies.length > 0) {
    suggestions.push({
      type: "danger",
      message: `${anomalies.length} anomaly detected in this range's upload pattern.`,
    });
  }
  if (totalRecords >= 5 && anomalies.length === 0) {
    suggestions.push({
      type: "success",
      message: "Upload pattern looks steady across this range.",
    });
  }

  return {
    summary: {
      totalRecords,
      totalRows,
      avgUploadsPerDay: avgUploads,
      activeDays: trend.length,
    },
    trend,
    anomalies,
    peakDay,
    suggestions,
  };
};
