import { DecisionRollupItem } from "@/lib/data";
import { resolveDecisionAction } from "@/app/actions";
import { weekKey } from "@/lib/weeks";

function urgencyClasses(neededBy: string): string {
  const today = weekKey(new Date());
  if (neededBy < today) return "text-[var(--color-urgent)] font-semibold";
  const in3Days = new Date();
  in3Days.setDate(in3Days.getDate() + 3);
  if (neededBy <= in3Days.toISOString().slice(0, 10)) return "text-amber-700 font-semibold";
  return "text-[var(--color-text)]";
}

function formatNeededBy(neededBy: string): string {
  return new Date(`${neededBy}T00:00:00.000Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function DecisionRow({ decision }: { decision: DecisionRollupItem }) {
  return (
    <li className="flex flex-col gap-2 border-b border-[var(--color-border)] py-4 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold leading-snug text-[var(--color-text)]">{decision.ask}</p>
        {decision.recommendation && (
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            <span className="font-medium text-[var(--color-text)]">Recommendation: </span>
            {decision.recommendation}
          </p>
        )}
        <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
          <span className="font-medium">{decision.personName}</span> · {decision.department}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
        <div className="text-right text-sm">
          <div className="text-[11px] uppercase tracking-wide text-[var(--color-text-muted)]">Needed by</div>
          <div className={urgencyClasses(decision.neededBy)}>{formatNeededBy(decision.neededBy)}</div>
        </div>
        <form action={resolveDecisionAction}>
          <input type="hidden" name="decisionId" value={decision.id} />
          <input type="hidden" name="resolved" value={decision.resolved ? "false" : "true"} />
          <button
            type="submit"
            className={`whitespace-nowrap rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              decision.resolved
                ? "border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"
                : "border-[var(--color-success)] text-[var(--color-success)] hover:bg-[var(--color-success-tint)]"
            }`}
          >
            {decision.resolved ? "Reopen" : "Mark resolved"}
          </button>
        </form>
      </div>
    </li>
  );
}

export function DecisionsRollup({ decisions }: { decisions: DecisionRollupItem[] }) {
  const active = decisions.filter((d) => !d.resolved).sort((a, b) => a.neededBy.localeCompare(b.neededBy));
  const resolved = decisions
    .filter((d) => d.resolved)
    .sort((a, b) => (b.resolvedAt ?? "").localeCompare(a.resolvedAt ?? ""));

  return (
    <section className="mb-8 overflow-hidden rounded-xl border-2 border-[var(--color-urgent)] bg-[var(--color-urgent-tint)] shadow-sm">
      <div className="flex items-center justify-between gap-3 bg-[var(--color-urgent)] px-5 py-3">
        <h2 className="text-base font-bold tracking-wide text-white sm:text-lg">⚑ Decisions Needed</h2>
        <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white">
          {active.length} open
        </span>
      </div>
      <div className="bg-[var(--color-surface)] px-5">
        {active.length === 0 ? (
          <p className="py-6 text-sm text-[var(--color-text-muted)]">
            Nothing outstanding — every department is caught up.
          </p>
        ) : (
          <ul>
            {active.map((d) => (
              <DecisionRow key={d.id} decision={d} />
            ))}
          </ul>
        )}
      </div>
      {resolved.length > 0 && (
        <details className="bg-[var(--color-surface)] px-5 pb-3">
          <summary className="cursor-pointer select-none py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
            Resolved ({resolved.length})
          </summary>
          <ul>
            {resolved.map((d) => (
              <DecisionRow key={d.id} decision={d} />
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
