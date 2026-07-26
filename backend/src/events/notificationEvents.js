const EventEmitter = require("events");

const notificationEmitter = new EventEmitter();

const NOTIFICATION_EVENTS = {
  CREATED: "notification:new",
};

module.exports = { notificationEmitter, NOTIFICATION_EVENTS };
