const Report = require("../models/Report");
const analyticsService = require("./analyticsService");
const { PERMISSIONS, hasPermission, PAGINATION } = require("../constants");

exports.generateReport = async (userId, role, { title, from, to }) => {
  const [stats, trend] = await Promise.all([
    analyticsService.getStats(userId, role, { from, to }),
    analyticsService.getDailyTrend(userId, role, { from, to }),
  ]);

  const report = await Report.create({
    title:
      title ||
      `Report ${new Date(from).toLocaleDateString()} – ${new Date(to).toLocaleDateString()}`,
    from,
    to,
    generatedBy: userId,
    summary: {
      totalRecords: stats.totalRecords,
      totalRows: stats.totalRows,
      totalUsers: stats.totalUsers,
    },
    trend,
    status: "ready",
  });

  return report;
};

exports.listReports = async (userId, role, query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(
    parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT,
  );

  const filter = hasPermission(role, PERMISSIONS.DATA_VIEW_ALL)
    ? {}
    : { generatedBy: userId };

  const [reports, total] = await Promise.all([
    Report.find(filter)
      .populate("generatedBy", "name email")
      .select("-trend")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Report.countDocuments(filter),
  ]);

  return {
    reports,
    total,
    page,
    pages: Math.max(Math.ceil(total / limit), 1),
    limit,
  };
};

exports.getReportById = async (id, userId, role) => {
  const report = await Report.findById(id).populate(
    "generatedBy",
    "name email",
  );
  if (!report) throw new Error("Report not found");

  const isOwner = report.generatedBy._id.toString() === userId.toString();
  if (!isOwner && !hasPermission(role, PERMISSIONS.DATA_VIEW_ALL)) {
    throw new Error("Not authorized to view this report");
  }

  return report;
};

exports.deleteReport = async (id, userId, role) => {
  const report = await exports.getReportById(id, userId, role);
  await Report.deleteOne({ _id: report._id });
  return report;
};
