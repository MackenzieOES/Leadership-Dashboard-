"use server";

import { revalidatePath } from "next/cache";
import { setDecisionResolved } from "@/lib/data";

// Shared across Melissa's View and each person's tab. Per the spec, marking
// a decision resolved is the one interaction Melissa's otherwise read-only
// view supports. No ownership check yet -- see saveWeekEntry in
// app/tabs/[slug]/actions.ts for the same forward-compatible note.
export async function resolveDecisionAction(formData: FormData) {
  const id = String(formData.get("decisionId") ?? "");
  const resolved = formData.get("resolved") === "true";
  if (!id) return;
  await setDecisionResolved(id, resolved);
  revalidatePath("/");
  revalidatePath("/tabs", "layout");
}
