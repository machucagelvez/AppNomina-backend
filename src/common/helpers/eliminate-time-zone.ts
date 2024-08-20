export const eliminateTimeZone = (date: Date) => {
  const dateString = date.toISOString().split('Z');
  return new Date(dateString[0]);
};
