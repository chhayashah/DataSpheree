/**
 * In-memory metrics for the Monitoring module. No external APM/metrics
 * service is configured in this environment, so this captures what's
 * genuinely available: request/error counts since process start, and a
 * capped buffer of recent errors. Resets on restart — that's an honest
 * limitation of an in-memory store, not hidden: Monitoring's uptime
 * figure makes that obvious to whoever's looking at it.
 */
const MAX_RECENT_ERRORS = 50;

const state = {
  requestCount: 0,
  errorCount: 0,
  recentErrors: [],
};

const recordRequest = () => {
  state.requestCount += 1;
};

const recordError = ({ message, path, statusCode }) => {
  state.errorCount += 1;
  state.recentErrors.unshift({
    message,
    path,
    statusCode,
    timestamp: new Date(),
  });
  if (state.recentErrors.length > MAX_RECENT_ERRORS) {
    state.recentErrors.length = MAX_RECENT_ERRORS;
  }
};

const getSnapshot = () => ({
  requestCount: state.requestCount,
  errorCount: state.errorCount,
  recentErrors: state.recentErrors,
});

module.exports = { recordRequest, recordError, getSnapshot };
