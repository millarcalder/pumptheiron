export const getTodayDateUTC = () => {
  return Date.UTC(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth(),
    new Date().getUTCDate(),
    0,
    0,
    0,
    0,
  ); // Midnight today UTC
};
