const Notification = require("../models/Notification");
const {
  notificationEmitter,
  NOTIFICATION_EVENTS,
} = require("../events/notificationEvents");
const { PAGINATION } = require("../constants");

exports.createNotification = async ({
  userId,
  type,
  message,
  relatedRecord,
}) => {
  const notification = await Notification.create({
    user: userId,
    type,
    message,
    relatedRecord: relatedRecord || null,
  });

  notificationEmitter.emit(NOTIFICATION_EVENTS.CREATED, {
    id: notification._id,
    userId: userId.toString(),
    type,
    message,
    read: false,
    createdAt: notification.createdAt,
  });

  return notification;
};

exports.getNotifications = async (userId, query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(
    parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT,
  );

  const filter = { user: userId };
  if (query.unreadOnly === "true") filter.read = false;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ user: userId, read: false }),
  ]);

  return {
    notifications,
    total,
    unreadCount,
    page,
    pages: Math.max(Math.ceil(total / limit), 1),
    limit,
  };
};

exports.markAsRead = async (id, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: id, user: userId },
    { read: true },
    { new: true },
  );
  if (!notification) throw new Error("Notification not found");
  return notification;
};

exports.markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { user: userId, read: false },
    { read: true },
  );
  return result.modifiedCount;
};
