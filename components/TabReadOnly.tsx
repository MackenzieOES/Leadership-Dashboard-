import { PersonConfig } from "@/lib/config";
import { WeekEntryData } from "@/lib/data";
import { resolveDecisionAction } from "@/app/actions";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
      <h2 className="mb-3 text-base font-bold text-[var(--color-text)]">{title}</h2>
      {children}
    </section>
  );
}

function BulletList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) {
    return <p className="text-sm italic text-[var(--color-text-muted)]">{empty}</p>;
  }
  return (
    <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text)]">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function formatDate(dateKey: string): string {
  return new Date(`${dateKey}T00:00:00.000Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function TabReadOnly({ config, data }: { config: PersonConfig; data: WeekEntryData }) {
  if (!data.submitted) {
    return (
      <section className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
        <p className="text-sm font-medium text-[var(--color-text-muted)]">
          {config.name} did not submit a report for this week.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <Section title="1. Wins & Accomplishments This Week">
        <BulletList items={data.wins} empty="No wins listed." />
      </Section>

      <Section title="2. Priorities for Next Week">
        <BulletList items={data.priorities} empty="No priorities listed." />
      </Section>

      <Section title="3. Blockers & Issues">
        <p className="whitespace-pre-wrap text-sm text-[var(--color-text)]">{data.blockers || "None."}</p>
      </Section>

      <Section title="4. Decisions Needed from Melissa">
        {data.decisions.length === 0 ? (
          <p className="text-sm italic text-[var(--color-text-muted)]">None this week.</p>
        ) : (
          <ul className="space-y-3">
            {data.decisions.map((d) => (
              <li key={d.id} className="rounded-md border border-[var(--color-border)] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{d.ask}</p>
                    {d.recommendation && (
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        <span className="font-medium text-[var(--color-text)]">Recommendation: </span>
                        {d.recommendation}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      Needed by {formatDate(d.neededBy)}
                      {d.resolved && <span className="text-[var(--color-success)]"> · Resolved</span>}
                    </p>
                  </div>
                  <form action={resolveDecisionAction}>
                    <input type="hidden" name="decisionId" value={d.id} />
                    <input type="hidden" name="resolved" value={d.resolved ? "false" : "true"} />
                    <button
                      type="submit"
                      className={`whitespace-nowrap rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                        d.resolved
                          ? "border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"
                          : "border-[var(--color-success)] text-[var(--color-success)] hover:bg-[var(--color-success-tint)]"
                      }`}
                    >
                      {d.resolved ? "Reopen" : "Mark resolved"}
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="5. Key Metrics">
        <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="bg-[var(--color-bg)] text-left text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                <th className="px-3 py-2 font-semibold">Metric</th>
                <th className="px-3 py-2 font-semibold">This Week</th>
                <th className="px-3 py-2 font-semibold">Last Week</th>
                <th className="px-3 py-2 font-semibold">Target</th>
              </tr>
            </thead>
            <tbody>
              {config.metrics.map((m) => {
                const v = data.metrics[m.key] ?? { thisWeek: "", lastWeek: "", target: "" };
                return (
                  <tr key={m.key} className="border-t border-[var(--color-border)]">
                    <td className="px-3 py-2 font-medium text-[var(--color-text)]">{m.label}</td>
                    <td className="px-3 py-2">{v.thisWeek || "—"}</td>
                    <td className="px-3 py-2 text-[var(--color-text-muted)]">{v.lastWeek || "—"}</td>
                    <td className="px-3 py-2">{v.target || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="6. Team & Personnel Updates">
        <p className="whitespace-pre-wrap text-sm text-[var(--color-text)]">{data.teamUpdates || "None."}</p>
      </Section>

      <Section title="7. Department Focus Questions">
        <div className="space-y-4">
          {config.focusQuestions.map((q) => (
            <div key={q.key}>
              <p className="text-sm font-semibold text-[var(--color-text)]">{q.question}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--color-text-muted)]">
                {data.focusAnswers[q.key] || "—"}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
