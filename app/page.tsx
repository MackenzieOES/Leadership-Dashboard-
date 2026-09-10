import { parseWeekKey, weekKey } from "@/lib/weeks";
import { getDecisionsRollup, getExecutiveSummary, getTabSummaries } from "@/lib/data";
import { WeekPicker } from "@/components/WeekPicker";
import { DecisionsRollup } from "@/components/DecisionsRollup";
import { ExecutiveSummary } from "@/components/ExecutiveSummary";
import { TabSummaryGrid } from "@/components/TabSummaryGrid";

export default async function MelissaViewPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week } = await searchParams;
  const weekStart = parseWeekKey(week);
  const weekQuerySuffix = `?week=${weekKey(weekStart)}`;

  const [decisions, execSummary, tabSummaries] = await Promise.all([
    getDecisionsRollup(),
    getExecutiveSummary(weekStart),
    getTabSummaries(weekStart),
  ]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Melissa&rsquo;s View</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Read-only company overview — OES Global Inc.
          </p>
        </div>
        <WeekPicker basePath="/" weekStart={weekStart} />
      </div>

      <DecisionsRollup decisions={decisions} />
      <ExecutiveSummary items={execSummary} weekQuerySuffix={weekQuerySuffix} />
      <TabSummaryGrid summaries={tabSummaries} weekQuerySuffix={weekQuerySuffix} />
    </div>
  );
}
