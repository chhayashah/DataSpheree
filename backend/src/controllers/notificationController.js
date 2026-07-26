const notificationService = require("../services/notificationService");
const logger = require("../utils/logger");

exports.getNotifications = async (req, res) => {
  try {
    const { notifications, total, unreadCount, page, pages, limit } =
      await notificationService.getNotifications(req.user._id, req.query);
    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: { total, page, pages, limit },
    });
  } catch (error) {
    logger.error(`Get notifications error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user._id,
    );
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    logger.error(`Mark read error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const modifiedCount = await notificationService.markAllAsRead(req.user._id);
    res.status(200).json({ success: true, data: { modifiedCount } });
  } catch (error) {
    logger.error(`Mark all read error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};
