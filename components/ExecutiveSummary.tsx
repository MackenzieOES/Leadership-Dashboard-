import Link from "next/link";
import { ExecutiveSummaryItem } from "@/lib/data";

export function ExecutiveSummary({
  items,
  weekQuerySuffix,
}: {
  items: ExecutiveSummaryItem[];
  weekQuerySuffix: string;
}) {
  return (
    <section className="mb-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
        Executive Summary — Top Moment From Each Department
      </h2>
      <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.personSlug} className="flex items-start gap-2 text-sm leading-snug">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden />
            <span>
              <Link
                href={`/tabs/${item.personSlug}${weekQuerySuffix}`}
                className="font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)]"
              >
                {item.personName}
              </Link>
              {": "}
              {item.submitted ? (
                item.topWin ? (
                  <span className="text-[var(--color-text-muted)]">{item.topWin}</span>
                ) : (
                  <span className="italic text-[var(--color-text-muted)]">No wins listed this week</span>
                )
              ) : (
                <span className="italic text-[var(--color-text-muted)]">Not yet submitted</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
