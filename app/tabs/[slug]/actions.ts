"use server";

import { revalidatePath } from "next/cache";
import { saveWeekEntry, SaveWeekEntryInput } from "@/lib/data";
import { parseWeekKey } from "@/lib/weeks";

/**
 * Saves one leader's weekly report. `personSlug` is passed explicitly
 * (rather than inferred from "whichever tab is open") so a future
 * passcode/PIN auth layer can wrap this with an ownership check --
 * e.g. `if (!callerOwnsSlug(personSlug)) throw new Error("forbidden")` --
 * without touching the data model or the caller.
 */
export async function saveWeekEntryAction(personSlug: string, weekKeyStr: string, input: SaveWeekEntryInput) {
  const weekStart = parseWeekKey(weekKeyStr);
  await saveWeekEntry(personSlug, weekStart, input);
  revalidatePath(`/tabs/${personSlug}`);
  revalidatePath("/");
}
