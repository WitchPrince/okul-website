export function parseDate(value) {
  if (value instanceof Date || value === undefined || value === null) return value;
  if (typeof value !== "string") return new Date(NaN);

  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  if (!match) return new Date(NaN);

  const [, day, month, year] = match.map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return new Date(NaN);
  }
  return date;
}

export function formatDate(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return value;
  const day = String(value.getUTCDate()).padStart(2, "0");
  const month = String(value.getUTCMonth() + 1).padStart(2, "0");
  const year = String(value.getUTCFullYear()).padStart(4, "0");
  return `${day}-${month}-${year}`;
}

export function todayStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}
