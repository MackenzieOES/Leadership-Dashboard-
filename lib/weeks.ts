// Weeks run Monday -> Sunday. Every week is identified by its Monday date
// (stored at UTC midnight) so history is unambiguous regardless of the
// viewer's timezone.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Returns the UTC-midnight Monday that starts the week containing `date`. */
export function getWeekStart(date: Date): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay(); // 0 = Sunday, 1 = Monday, ...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diffToMonday);
  return d;
}

export function getCurrentWeekStart(): Date {
  return getWeekStart(new Date());
}

export function addWeeks(weekStart: Date, delta: number): Date {
  return new Date(weekStart.getTime() + delta * 7 * MS_PER_DAY);
}

/** URL-friendly key, e.g. "2026-09-08". */
export function weekKey(weekStart: Date): string {
  return weekStart.toISOString().slice(0, 10);
}

export function parseWeekKey(key: string | undefined | null): Date {
  if (!key) return getCurrentWeekStart();
  const parsed = new Date(`${key}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return getCurrentWeekStart();
  return getWeekStart(parsed);
}

/** Human label, e.g. "Sep 8 - Sep 14, 2026". */
export function formatWeekRange(weekStart: Date): string {
  const weekEnd = addWeeks(weekStart, 1);
  const lastDay = new Date(weekEnd.getTime() - MS_PER_DAY);
  const startFmt = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  const endFmt = lastDay.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${startFmt} – ${endFmt}`;
}

export function isCurrentWeek(weekStart: Date): boolean {
  return weekKey(weekStart) === weekKey(getCurrentWeekStart());
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}
