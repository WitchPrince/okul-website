export function formatDate(date: string): string {
  const [day, month, year] = date.split("-");
  return `${day}.${month}.${year}`;
}

export function parseDate(date: string): string {
  const [day, month, year] = date.split("-");
  return `${year}-${month}-${day}`;
}
