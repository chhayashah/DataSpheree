const EventEmitter = require("events");

const dataEmitter = new EventEmitter();

// Events
const DATA_EVENTS = {
  INGESTED: "data:ingested",
  PROCESSED: "data:processed",
  FAILED: "data:failed",
};

module.exports = { dataEmitter, DATA_EVENTS };
