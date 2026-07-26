export const PRESET_DAYS = { "7d": 7, "30d": 30, "90d": 90 };

export const rangeToISO = (key) => {
  const days = PRESET_DAYS[key];
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  return { from: from.toISOString(), to: to.toISOString() };
};
