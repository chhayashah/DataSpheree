const UserActivity = require("../models/UserActivity");

exports.logActivity = async ({ userId, action, details, req }) => {
  try {
    await UserActivity.create({
      user: userId,
      action,
      details: details || "",
      ipAddress: req?.ip || "",
      userAgent: req?.headers["user-agent"] || "",
    });
  } catch (err) {
    console.error("Activity log error:", err.message);
  }
};

exports.getUserActivity = async (userId, role) => {
  const query = role === "admin" ? {} : { user: userId };

  const activities = await UserActivity.find(query)
    .populate("user", "name email role")
    .sort({ createdAt: -1 })
    .limit(50);

  return activities;
};

exports.getActivityStats = async () => {
  const totalLogins = await UserActivity.countDocuments({ action: "login" });
  const totalUploads = await UserActivity.countDocuments({ action: "upload" });

  // Activity per day last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const dailyActivity = await UserActivity.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          action: "$action",
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);

  // Most active users
  const mostActive = await UserActivity.aggregate([
    {
      $group: {
        _id: "$user",
        totalActions: { $sum: 1 },
        logins: { $sum: { $cond: [{ $eq: ["$action", "login"] }, 1, 0] } },
        uploads: { $sum: { $cond: [{ $eq: ["$action", "upload"] }, 1, 0] } },
      },
    },
    { $sort: { totalActions: -1 } },
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
        name: "$userInfo.name",
        email: "$userInfo.email",
        totalActions: 1,
        logins: 1,
        uploads: 1,
      },
    },
  ]);

  return { totalLogins, totalUploads, dailyActivity, mostActive };
};
