/** Convert Firestore Timestamps, Dates, and date strings into a valid Date. */
export const toDate = (value) => {
  if (!value) return null;

  const date = value instanceof Date
    ? value
    : typeof value?.toDate === 'function'
      ? value.toDate()
      : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value) => {
  const date = toDate(value);
  return date ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}` : 'N/A';
};
