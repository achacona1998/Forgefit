export function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function isoDate(date = new Date()): string {
  return date.toISOString().split("T")[0];
}

export function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return isoDate(d);
}

export function getWeekday(date: string): number {
  return new Date(date).getDay();
}

export function formatDate(date: string, locale = "es-ES"): string {
  return new Date(date).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "short" });
}