const { getIO } = require("../config/socket");
const {
  notificationEmitter,
  NOTIFICATION_EVENTS,
} = require("../events/notificationEvents");
const { getUserRoom } = require("../utils/socketRooms");
const logger = require("../utils/logger");

/**
 * Same bridge pattern as sockets/dataSocket.js — internal event in,
 * room-scoped Socket.io emit out. A notification is inherently
 * single-recipient, so this only ever emits to one user's room, never
 * broadcasts.
 */
const initNotificationSocket = () => {
  notificationEmitter.on(NOTIFICATION_EVENTS.CREATED, (notification) => {
    try {
      const io = getIO();
      io.to(getUserRoom(notification.userId)).emit(
        NOTIFICATION_EVENTS.CREATED,
        notification,
      );
    } catch (error) {
      logger.error(`Notification socket emit error: ${error.message}`);
    }
  });
};

module.exports = { initNotificationSocket };
