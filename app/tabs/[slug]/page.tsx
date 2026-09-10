import { notFound } from "next/navigation";
import { parseWeekKey, weekKey, isCurrentWeek } from "@/lib/weeks";
import { getWeekData } from "@/lib/data";
import { WeekPicker } from "@/components/WeekPicker";
import { TabEditor } from "@/components/TabEditor";
import { TabReadOnly } from "@/components/TabReadOnly";

export default async function PersonTabPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ week?: string }>;
}) {
  const { slug } = await params;
  const { week } = await searchParams;
  const weekStart = parseWeekKey(week);

  const result = await getWeekData(slug, weekStart);
  if (!result) notFound();
  const { person, weekEntryData } = result;

  const editable = isCurrentWeek(weekStart);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">{person.name}</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            {person.title} · {person.department}
          </p>
        </div>
        <WeekPicker basePath={`/tabs/${slug}`} weekStart={weekStart} />
      </div>

      {editable ? (
        <>
          {!weekEntryData.submitted && (
            <div className="mb-4 rounded-md border border-[var(--color-border)] bg-[var(--color-accent-tint)] px-4 py-2.5 text-sm font-medium text-[var(--color-accent-dark)]">
              Not yet submitted this week — fill out and save below.
            </div>
          )}
          <TabEditor
            personSlug={slug}
            weekKeyStr={weekKey(weekStart)}
            config={person}
            initialData={weekEntryData}
          />
        </>
      ) : (
        <>
          <div className="mb-4 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-muted)]">
            Viewing a historical record — read only. Only the current week can be edited.
          </div>
          <TabReadOnly config={person} data={weekEntryData} />
        </>
      )}
    </div>
  );
}
