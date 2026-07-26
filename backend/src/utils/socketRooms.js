/**
 * Single source of truth for Socket.io room names.
 * Every place that needs to address "this user" or "this role" over
 * sockets should go through these helpers rather than hand-building
 * the string, so the naming convention only has to change in one place.
 */

const getUserRoom = (userId) => `user:${userId}`;

const getRoleRoom = (role) => `role:${role}`;

module.exports = { getUserRoom, getRoleRoom };
