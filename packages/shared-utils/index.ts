export function formatDate(date: Date): string {
  return date.toISOString();
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}
