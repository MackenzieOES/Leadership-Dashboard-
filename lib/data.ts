import "server-only";
import { prisma } from "@/lib/db";
import { getPersonConfig, PersonConfig } from "@/lib/config";
import { getWeekStart } from "@/lib/weeks";

export type MetricValue = { thisWeek: string; lastWeek: string; target: string };
export type MetricsMap = Record<string, MetricValue>;
export type FocusAnswersMap = Record<string, string>;

export type DecisionData = {
  id: string;
  ask: string;
  recommendation: string;
  neededBy: string; // ISO date (yyyy-mm-dd)
  resolved: boolean;
  resolvedAt: string | null;
};

export type WeekEntryData = {
  submitted: boolean; // whether a row exists for this exact week
  updatedAt: string | null;
  wins: string[];
  priorities: string[];
  blockers: string;
  teamUpdates: string;
  metrics: MetricsMap;
  focusAnswers: FocusAnswersMap;
  decisions: DecisionData[];
};

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return [];
}

function asMetricsMap(value: unknown): MetricsMap {
  if (value && typeof value === "object") return value as MetricsMap;
  return {};
}

function asFocusAnswersMap(value: unknown): FocusAnswersMap {
  if (value && typeof value === "object") return value as FocusAnswersMap;
  return {};
}

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Loads the person + their report for a given week, filling in metric
 * carry-forward (last week's "this week" value) from the most recent prior
 * week that has data, even if the current week hasn't been saved yet. */
export async function getWeekData(
  personSlug: string,
  weekStart: Date
): Promise<{ person: PersonConfig; personId: string; weekEntryData: WeekEntryData } | null> {
  const config = getPersonConfig(personSlug);
  if (!config) return null;

  const person = await prisma.person.findUnique({ where: { slug: personSlug } });
  if (!person) return null;

  const entry = await prisma.weekEntry.findUnique({
    where: { personId_weekStart: { personId: person.id, weekStart } },
    include: { decisions: true },
  });

  const previousEntry = await prisma.weekEntry.findFirst({
    where: { personId: person.id, weekStart: { lt: weekStart } },
    orderBy: { weekStart: "desc" },
  });

  const previousMetrics = previousEntry ? asMetricsMap(previousEntry.metrics) : {};
  const currentMetrics = entry ? asMetricsMap(entry.metrics) : {};

  const metrics: MetricsMap = {};
  for (const m of config.metrics) {
    const existing = currentMetrics[m.key];
    const prev = previousMetrics[m.key];
    metrics[m.key] = {
      thisWeek: existing?.thisWeek ?? "",
      lastWeek: existing?.lastWeek ?? prev?.thisWeek ?? "",
      target: existing?.target ?? prev?.target ?? "",
    };
  }

  const focusAnswers: FocusAnswersMap = {};
  const existingFocus = entry ? asFocusAnswersMap(entry.focusAnswers) : {};
  for (const q of config.focusQuestions) {
    focusAnswers[q.key] = existingFocus[q.key] ?? "";
  }

  const weekEntryData: WeekEntryData = {
    submitted: !!entry,
    updatedAt: entry ? entry.updatedAt.toISOString() : null,
    wins: entry ? asStringArray(entry.wins) : [],
    priorities: entry ? asStringArray(entry.priorities) : [],
    blockers: entry?.blockers ?? "",
    teamUpdates: entry?.teamUpdates ?? "",
    metrics,
    focusAnswers,
    decisions: entry
      ? entry.decisions
          .map((d) => ({
            id: d.id,
            ask: d.ask,
            recommendation: d.recommendation,
            neededBy: toDateKey(d.neededBy),
            resolved: d.resolved,
            resolvedAt: d.resolvedAt ? d.resolvedAt.toISOString() : null,
          }))
          .sort((a, b) => a.neededBy.localeCompare(b.neededBy))
      : [],
  };

  return { person: config, personId: person.id, weekEntryData };
}

export type SaveWeekEntryInput = {
  wins: string[];
  priorities: string[];
  blockers: string;
  teamUpdates: string;
  metrics: MetricsMap;
  focusAnswers: FocusAnswersMap;
  decisions: { id?: string; ask: string; recommendation: string; neededBy: string; resolved?: boolean }[];
};

/** Saves (creates or updates) a person's report for the given week.
 * This is the single write path for a leader's tab -- structured to take
 * the target personSlug explicitly so a future auth check ("does the
 * caller own this slug?") can wrap it without changing callers. */
export async function saveWeekEntry(personSlug: string, weekStart: Date, input: SaveWeekEntryInput) {
  const person = await prisma.person.findUnique({ where: { slug: personSlug } });
  if (!person) throw new Error(`Unknown person: ${personSlug}`);

  const existing = await prisma.weekEntry.findUnique({
    where: { personId_weekStart: { personId: person.id, weekStart } },
    include: { decisions: true },
  });

  const cleanWins = input.wins.map((w) => w.trim()).filter(Boolean);
  const cleanPriorities = input.priorities.map((w) => w.trim()).filter(Boolean);

  const entry = await prisma.weekEntry.upsert({
    where: { personId_weekStart: { personId: person.id, weekStart } },
    create: {
      personId: person.id,
      weekStart,
      wins: cleanWins,
      priorities: cleanPriorities,
      blockers: input.blockers,
      teamUpdates: input.teamUpdates,
      metrics: input.metrics,
      focusAnswers: input.focusAnswers,
    },
    update: {
      wins: cleanWins,
      priorities: cleanPriorities,
      blockers: input.blockers,
      teamUpdates: input.teamUpdates,
      metrics: input.metrics,
      focusAnswers: input.focusAnswers,
    },
  });

  const existingIds = new Set((existing?.decisions ?? []).map((d) => d.id));
  const incomingIds = new Set(input.decisions.filter((d) => d.id).map((d) => d.id as string));

  // Remove decisions the leader deleted from the form.
  const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
  if (toDelete.length) {
    await prisma.decision.deleteMany({ where: { id: { in: toDelete } } });
  }

  for (const d of input.decisions) {
    const ask = d.ask.trim();
    const recommendation = d.recommendation.trim();
    if (!ask) continue;
    const neededBy = new Date(`${d.neededBy}T00:00:00.000Z`);
    if (d.id && existingIds.has(d.id)) {
      await prisma.decision.update({
        where: { id: d.id },
        data: { ask, recommendation, neededBy },
      });
    } else {
      await prisma.decision.create({
        data: {
          personId: person.id,
          weekEntryId: entry.id,
          ask,
          recommendation,
          neededBy,
        },
      });
    }
  }
}

export async function setDecisionResolved(decisionId: string, resolved: boolean) {
  await prisma.decision.update({
    where: { id: decisionId },
    data: { resolved, resolvedAt: resolved ? new Date() : null },
  });
}

export type DecisionRollupItem = {
  id: string;
  ask: string;
  recommendation: string;
  neededBy: string;
  resolved: boolean;
  resolvedAt: string | null;
  personName: string;
  personSlug: string;
  department: string;
  weekStart: string;
};

/** All decisions across every leader/week, for the Melissa's View rollup.
 * Unresolved decisions persist in the active list until resolved,
 * regardless of which week they were originally raised in. */
export async function getDecisionsRollup(): Promise<DecisionRollupItem[]> {
  const decisions = await prisma.decision.findMany({
    include: { person: true, weekEntry: true },
    orderBy: { neededBy: "asc" },
  });

  return decisions.map((d) => ({
    id: d.id,
    ask: d.ask,
    recommendation: d.recommendation,
    neededBy: toDateKey(d.neededBy),
    resolved: d.resolved,
    resolvedAt: d.resolvedAt ? d.resolvedAt.toISOString() : null,
    personName: d.person.name,
    personSlug: d.person.slug,
    department: d.person.department,
    weekStart: toDateKey(d.weekEntry.weekStart),
  }));
}

export type ExecutiveSummaryItem = {
  personName: string;
  personSlug: string;
  department: string;
  submitted: boolean;
  topWin: string | null;
};

/** One line per department for the current week's Executive Summary --
 * each leader's top (first-listed) win, pulled live from their tab. */
export async function getExecutiveSummary(weekStart: Date): Promise<ExecutiveSummaryItem[]> {
  const { PEOPLE_BY_ORDER } = await import("@/lib/config");
  const people = await prisma.person.findMany();
  const peopleBySlug = new Map(people.map((p) => [p.slug, p]));

  const entries = await prisma.weekEntry.findMany({
    where: { weekStart, personId: { in: people.map((p) => p.id) } },
  });
  const entryByPersonId = new Map(entries.map((e) => [e.personId, e]));

  return PEOPLE_BY_ORDER.map((config) => {
    const person = peopleBySlug.get(config.slug);
    const entry = person ? entryByPersonId.get(person.id) : undefined;
    const wins = entry ? asStringArray(entry.wins) : [];
    return {
      personName: config.name,
      personSlug: config.slug,
      department: config.department,
      submitted: !!entry,
      topWin: wins[0] ?? null,
    };
  });
}

export type TabSummary = {
  personName: string;
  personSlug: string;
  title: string;
  department: string;
  submitted: boolean;
  winsCount: number;
  prioritiesCount: number;
  blockersPreview: string | null;
  openDecisionsCount: number;
};

/** Per-department snapshot for the Melissa's View nav cards -- reflects
 * whichever week is currently selected. */
export async function getTabSummaries(weekStart: Date): Promise<TabSummary[]> {
  const { PEOPLE_BY_ORDER } = await import("@/lib/config");
  const people = await prisma.person.findMany();
  const peopleBySlug = new Map(people.map((p) => [p.slug, p]));

  const entries = await prisma.weekEntry.findMany({
    where: { weekStart, personId: { in: people.map((p) => p.id) } },
    include: { decisions: true },
  });
  const entryByPersonId = new Map(entries.map((e) => [e.personId, e]));

  return PEOPLE_BY_ORDER.map((config) => {
    const person = peopleBySlug.get(config.slug);
    const entry = person ? entryByPersonId.get(person.id) : undefined;
    const wins = entry ? asStringArray(entry.wins) : [];
    const priorities = entry ? asStringArray(entry.priorities) : [];
    const blockers = entry?.blockers?.trim() ?? "";
    const openDecisions = entry ? entry.decisions.filter((d) => !d.resolved).length : 0;

    return {
      personName: config.name,
      personSlug: config.slug,
      title: config.title,
      department: config.department,
      submitted: !!entry,
      winsCount: wins.length,
      prioritiesCount: priorities.length,
      blockersPreview: blockers ? blockers.slice(0, 140) : null,
      openDecisionsCount: openDecisions,
    };
  });
}

export { getWeekStart };
