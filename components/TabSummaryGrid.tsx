import Link from "next/link";
import { TabSummary } from "@/lib/data";

export function TabSummaryGrid({
  summaries,
  weekQuerySuffix,
}: {
  summaries: TabSummary[];
  weekQuerySuffix: string;
}) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
        Department Reports
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {summaries.map((s) => (
          <Link
            key={s.personSlug}
            href={`/tabs/${s.personSlug}${weekQuerySuffix}`}
            className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
                  {s.personName}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">{s.title}</p>
              </div>
              {s.openDecisionsCount > 0 && (
                <span className="shrink-0 rounded-full bg-[var(--color-urgent-tint)] px-2 py-0.5 text-xs font-semibold text-[var(--color-urgent)]">
                  {s.openDecisionsCount} decision{s.openDecisionsCount === 1 ? "" : "s"}
                </span>
              )}
            </div>

            {s.submitted ? (
              <div className="mt-3 space-y-1 text-sm text-[var(--color-text-muted)]">
                <p>
                  {s.winsCount} win{s.winsCount === 1 ? "" : "s"} · {s.prioritiesCount} priorit
                  {s.prioritiesCount === 1 ? "y" : "ies"} next week
                </p>
                {s.blockersPreview && (
                  <p className="line-clamp-2">
                    <span className="font-medium text-[var(--color-text)]">Blockers: </span>
                    {s.blockersPreview}
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm italic text-[var(--color-text-muted)]">Not yet submitted this week</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
