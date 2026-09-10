"use client";

import { useState, useTransition, useId } from "react";
import { PersonConfig } from "@/lib/config";
import { WeekEntryData, MetricsMap, FocusAnswersMap, DecisionData } from "@/lib/data";
import { saveWeekEntryAction } from "@/app/tabs/[slug]/actions";

type EditableDecision = Omit<DecisionData, "resolvedAt"> & { key: string };

function makeKey() {
  return Math.random().toString(36).slice(2);
}

function EditableList({
  label,
  helper,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  helper?: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <label className="text-sm font-semibold text-[var(--color-text)]">{label}</label>
      </div>
      {helper && <p className="mb-2 text-xs text-[var(--color-text-muted)]">{helper}</p>}
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <span className="mt-2.5 text-[var(--color-text-muted)]">•</span>
            <input
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              placeholder={placeholder}
              className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="shrink-0 rounded-md px-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-urgent)]"
              aria-label="Remove"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-dark)]"
        >
          + Add item
        </button>
      </div>
    </div>
  );
}

function DecisionsEditor({
  decisions,
  onChange,
}: {
  decisions: EditableDecision[];
  onChange: (d: EditableDecision[]) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs text-[var(--color-text-muted)]">
        The specific ask, your recommendation, and the date you need an answer by. Leave empty if there are none
        this week.
      </p>
      {decisions.length === 0 && (
        <p className="mb-3 rounded-md bg-[var(--color-bg)] px-3 py-2 text-sm italic text-[var(--color-text-muted)]">
          None this week
        </p>
      )}
      <div className="space-y-3">
        {decisions.map((d, i) => (
          <div key={d.key} className="rounded-md border border-[var(--color-border)] p-3">
            <div className="mb-2 flex items-start justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                Decision {i + 1}
              </span>
              <button
                type="button"
                onClick={() => onChange(decisions.filter((_, idx) => idx !== i))}
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-urgent)]"
              >
                Remove
              </button>
            </div>
            <div className="space-y-2">
              <input
                value={d.ask}
                onChange={(e) => {
                  const next = [...decisions];
                  next[i] = { ...next[i], ask: e.target.value };
                  onChange(next);
                }}
                placeholder="What do you need Melissa to decide?"
                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none"
              />
              <input
                value={d.recommendation}
                onChange={(e) => {
                  const next = [...decisions];
                  next[i] = { ...next[i], recommendation: e.target.value };
                  onChange(next);
                }}
                placeholder="Your recommendation"
                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-[var(--color-text-muted)]">Needed by</label>
                <input
                  type="date"
                  value={d.neededBy}
                  onChange={(e) => {
                    const next = [...decisions];
                    next[i] = { ...next[i], neededBy: e.target.value };
                    onChange(next);
                  }}
                  className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm focus:border-[var(--color-accent)] focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          onChange([
            ...decisions,
            { key: makeKey(), id: "", ask: "", recommendation: "", neededBy: new Date().toISOString().slice(0, 10), resolved: false },
          ])
        }
        className="mt-2 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-dark)]"
      >
        + Add decision
      </button>
    </div>
  );
}

function MetricsTable({
  config,
  metrics,
  onChange,
}: {
  config: PersonConfig;
  metrics: MetricsMap;
  onChange: (m: MetricsMap) => void;
}) {
  return (
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
            const value = metrics[m.key] ?? { thisWeek: "", lastWeek: "", target: "" };
            return (
              <tr key={m.key} className="border-t border-[var(--color-border)]">
                <td className="px-3 py-2 align-top font-medium text-[var(--color-text)]">{m.label}</td>
                <td className="px-3 py-2 align-top">
                  <input
                    value={value.thisWeek}
                    onChange={(e) => onChange({ ...metrics, [m.key]: { ...value, thisWeek: e.target.value } })}
                    className="w-32 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 focus:border-[var(--color-accent)] focus:outline-none"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <div className="w-32 rounded-md bg-[var(--color-bg)] px-2 py-1.5 text-[var(--color-text-muted)]">
                    {value.lastWeek || "—"}
                  </div>
                </td>
                <td className="px-3 py-2 align-top">
                  <input
                    value={value.target}
                    onChange={(e) => onChange({ ...metrics, [m.key]: { ...value, target: e.target.value } })}
                    className="w-32 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 focus:border-[var(--color-accent)] focus:outline-none"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
      <h2 className="mb-3 text-base font-bold text-[var(--color-text)]">{title}</h2>
      {children}
    </section>
  );
}

export function TabEditor({
  personSlug,
  weekKeyStr,
  config,
  initialData,
}: {
  personSlug: string;
  weekKeyStr: string;
  config: PersonConfig;
  initialData: WeekEntryData;
}) {
  const formId = useId();
  const [wins, setWins] = useState<string[]>(initialData.wins.length ? initialData.wins : [""]);
  const [priorities, setPriorities] = useState<string[]>(
    initialData.priorities.length ? initialData.priorities : [""]
  );
  const [blockers, setBlockers] = useState(initialData.blockers);
  const [teamUpdates, setTeamUpdates] = useState(initialData.teamUpdates);
  const [metrics, setMetrics] = useState<MetricsMap>(initialData.metrics);
  const [focusAnswers, setFocusAnswers] = useState<FocusAnswersMap>(initialData.focusAnswers);
  const [decisions, setDecisions] = useState<EditableDecision[]>(
    initialData.decisions.map((d) => ({ ...d, key: d.id }))
  );
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<string | null>(null);

  function handleSave() {
    startTransition(async () => {
      await saveWeekEntryAction(personSlug, weekKeyStr, {
        wins,
        priorities,
        blockers,
        teamUpdates,
        metrics,
        focusAnswers,
        decisions: decisions.map((d) => ({
          id: d.id || undefined,
          ask: d.ask,
          recommendation: d.recommendation,
          neededBy: d.neededBy,
        })),
      });
      setSavedAt(new Date().toLocaleTimeString());
    });
  }

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="space-y-5 pb-24"
    >
      <Section title="1. Wins & Accomplishments This Week">
        <EditableList
          label="Top 3–5 outcomes"
          helper="Results, not activity."
          items={wins}
          onChange={setWins}
          placeholder="e.g. Closed the Acme renewal at $42K"
        />
      </Section>

      <Section title="2. Priorities for Next Week">
        <EditableList
          label="In priority order"
          items={priorities}
          onChange={setPriorities}
          placeholder="What moves forward next week"
        />
      </Section>

      <Section title="3. Blockers & Issues">
        <label className="mb-1 block text-sm font-semibold text-[var(--color-text)]">
          What&rsquo;s slowing the team down, and what help (if any) is needed
        </label>
        <textarea
          value={blockers}
          onChange={(e) => setBlockers(e.target.value)}
          rows={4}
          placeholder="None, or describe the blocker and what help would resolve it"
          className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none"
        />
      </Section>

      <Section title="4. Decisions Needed from Melissa">
        <DecisionsEditor decisions={decisions} onChange={setDecisions} />
      </Section>

      <Section title="5. Key Metrics">
        <MetricsTable config={config} metrics={metrics} onChange={setMetrics} />
      </Section>

      <Section title="6. Team & Personnel Updates">
        <label className="mb-1 block text-sm font-semibold text-[var(--color-text)]">
          Staffing changes, hiring status, PTO coverage, recognition, morale notes
        </label>
        <textarea
          value={teamUpdates}
          onChange={(e) => setTeamUpdates(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none"
        />
      </Section>

      <Section title="7. Department Focus Questions">
        <div className="space-y-4">
          {config.focusQuestions.map((q) => (
            <div key={q.key}>
              <label className="mb-1 block text-sm font-semibold text-[var(--color-text)]">{q.question}</label>
              <textarea
                value={focusAnswers[q.key] ?? ""}
                onChange={(e) => setFocusAnswers({ ...focusAnswers, [q.key]: e.target.value })}
                rows={2}
                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>
          ))}
        </div>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-3 sm:px-6">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-dark)] disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save This Week's Report"}
          </button>
          {savedAt && !isPending && (
            <span className="text-sm text-[var(--color-success)]">Saved at {savedAt}</span>
          )}
        </div>
      </div>
    </form>
  );
}
