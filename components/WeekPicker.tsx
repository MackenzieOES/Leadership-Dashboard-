import Link from "next/link";
import { addWeeks, formatWeekRange, isCurrentWeek, weekKey, getCurrentWeekStart } from "@/lib/weeks";

export function WeekPicker({ basePath, weekStart }: { basePath: string; weekStart: Date }) {
  const prevWeek = weekKey(addWeeks(weekStart, -1));
  const nextWeek = weekKey(addWeeks(weekStart, 1));
  const current = isCurrentWeek(weekStart);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <Link
        href={`${basePath}?week=${prevWeek}`}
        className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 font-medium text-[var(--color-text)] hover:bg-[var(--color-accent-tint)]"
        aria-label="Previous week"
      >
        ← Prev
      </Link>
      <div className="min-w-[9rem] rounded-md px-2 py-1.5 text-center font-semibold text-[var(--color-text)]">
        {formatWeekRange(weekStart)}
        {current && (
          <span className="ml-1.5 rounded-full bg-[var(--color-accent-tint)] px-2 py-0.5 text-xs font-semibold text-[var(--color-accent)]">
            This week
          </span>
        )}
      </div>
      <Link
        href={`${basePath}?week=${nextWeek}`}
        className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 font-medium text-[var(--color-text)] hover:bg-[var(--color-accent-tint)]"
        aria-label="Next week"
      >
        Next →
      </Link>
      {!current && (
        <Link
          href={`${basePath}?week=${weekKey(getCurrentWeekStart())}`}
          className="rounded-md px-2.5 py-1.5 font-medium text-[var(--color-accent)] underline decoration-dotted underline-offset-2 hover:text-[var(--color-accent-dark)]"
        >
          Jump to this week
        </Link>
      )}
    </div>
  );
}
