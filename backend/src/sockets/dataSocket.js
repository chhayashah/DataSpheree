const { getIO } = require("../config/socket");
const { dataEmitter, DATA_EVENTS } = require("../events/dataEvents");
const logger = require("../utils/logger");

const initDataSocket = () => {
  // data:ingested event pe frontend ko broadcast karo
  dataEmitter.on(DATA_EVENTS.INGESTED, (data) => {
    try {
      const io = getIO();
      io.emit(DATA_EVENTS.INGESTED, data);
      logger.info(`Socket broadcast: ${DATA_EVENTS.INGESTED}`);
    } catch (error) {
      logger.error(`Socket broadcast error: ${error.message}`);
    }
  });

  dataEmitter.on(DATA_EVENTS.PROCESSED, (data) => {
    try {
      const io = getIO();
      io.emit(DATA_EVENTS.PROCESSED, data);
      logger.info(`Socket broadcast: ${DATA_EVENTS.PROCESSED}`);
    } catch (error) {
      logger.error(`Socket broadcast error: ${error.message}`);
    }
  });
};

module.exports = { initDataSocket };
