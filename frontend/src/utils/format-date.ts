export function parseDate(date: string): string {
  if (date.includes("-")) {
    const parts = date.split("-");
    if (parts[0].length === 4) return date;
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  return date;
}
export function formatDate(date: string): string {
  const [year, month, day] = parseDate(date).split("-");
  return `${day}.${month}.${year}`;
}
