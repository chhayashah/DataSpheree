const { getIO } = require("../config/socket");
const { dataEmitter, DATA_EVENTS } = require("../events/dataEvents");
const { getUserRoom } = require("../utils/socketRooms");
const logger = require("../utils/logger");

/**
 * Bridges internal domain events (events/dataEvents.js) to Socket.io.
 * Events are scoped to the uploading user's private room — never a global
 * broadcast — so a user only ever receives events for data they own.
 */
const initDataSocket = () => {
  dataEmitter.on(DATA_EVENTS.INGESTED, (data) => {
    try {
      const io = getIO();
      io.to(getUserRoom(data.uploadedBy)).emit(DATA_EVENTS.INGESTED, data);
      logger.info(
        `Socket emit: ${DATA_EVENTS.INGESTED} -> ${getUserRoom(data.uploadedBy)}`,
      );
    } catch (error) {
      logger.error(`Socket emit error: ${error.message}`);
    }
  });

  dataEmitter.on(DATA_EVENTS.PROCESSED, (data) => {
    try {
      const io = getIO();
      io.to(getUserRoom(data.uploadedBy)).emit(DATA_EVENTS.PROCESSED, data);
      logger.info(
        `Socket emit: ${DATA_EVENTS.PROCESSED} -> ${getUserRoom(data.uploadedBy)}`,
      );
    } catch (error) {
      logger.error(`Socket emit error: ${error.message}`);
    }
  });
};

module.exports = { initDataSocket };
