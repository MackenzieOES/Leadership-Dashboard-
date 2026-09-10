# OES Global Leadership Dashboard

A weekly leadership reporting dashboard for OES Global Inc. (Hydration Depot,
Traffic Cones For Less, SD2K Valet, Absorbents For Less), replacing the
weekly Word-document leadership report.

- **Melissa's View** (`/`) — a read-only rollup: an always-current
  "Decisions Needed" queue pulled live from all 7 departments, a weekly
  Executive Summary, and a scannable card per department.
- **Seven department tabs** (`/tabs/<slug>`) — one per leader, each with
  the same 7-part weekly structure (Wins, Priorities, Blockers, Decisions
  Needed, Key Metrics, Team Updates, Focus Questions).
- **Week history** — every week's data is stored permanently, keyed by its
  Monday date. Use the week picker (or `?week=YYYY-MM-DD`) to look back.
  Only the current week is editable; past weeks render as a read-only
  historical record.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS, with Prisma + PostgreSQL
for storage. Deployed on Vercel.

## Deploying to Vercel

1. **Create a Postgres database.** In the Vercel dashboard, open (or create)
   the project, go to the **Storage** tab, and add a Postgres database
   (Vercel's own storage, or Neon/Supabase both work). This automatically
   sets a `DATABASE_URL`-style env var on the project — if it's named
   something else (e.g. `POSTGRES_URL_NON_POOLING`), add an env var literally
   named `DATABASE_URL` with that same value, since that's what
   `prisma/schema.prisma` reads.
2. **Import the repo.** "Add New Project" → import
   `MackenzieOES/Leadership-Dashboard-`. Vercel auto-detects Next.js; no
   build settings need to change.
3. **Deploy.** The build runs `prisma migrate deploy && next build` (see
   `package.json`), which applies the schema to your new database
   automatically on every deploy — safe to run repeatedly, it skips
   migrations that are already applied.
4. **Seed the 7 leader records**, once, after the first successful deploy:
   run `DATABASE_URL="<your production connection string>" npm run seed`
   from your machine (or via `vercel env pull` to grab the value first).
   Without this step the app runs fine but every tab shows no name/title —
   `Person` rows won't exist yet.

That's it — no other environment variables are required for this initial
build (see "Auth" below for what a future passcode layer would add).

## Local development

```bash
npm install
# create a local Postgres database and point DATABASE_URL at it in .env, e.g.:
#   DATABASE_URL="postgresql://postgres:password@localhost:5432/leadership_dashboard"
npx prisma migrate deploy   # apply the schema
npm run seed                # seed the 7 leader records
npm run dev                 # http://localhost:3000
```

Any reachable Postgres works for local dev — a local install, Docker, or
even pointing at the same hosted database Vercel uses (simplest, but shares
data with production).

## Project layout

- `lib/config.ts` — the 7 leaders, their Key Metrics, and their standing
  Focus Questions. This is the single source of truth for what each tab
  asks; metric/question keys are referenced inside stored JSON, so treat
  existing keys as stable once in use.
- `lib/weeks.ts` — Monday-based week math (current week, prev/next, url keys).
- `lib/data.ts` — all reads/writes. Every function takes the target
  person's `slug` explicitly (see "Auth, fast-follow" below).
- `prisma/schema.prisma` — `Person`, `WeekEntry` (one row per person per
  week, never overwritten), and `Decision` (its own table, since a
  decision stays in the active rollup until resolved regardless of how
  many weeks pass).
- `app/page.tsx` — Melissa's View. `app/tabs/[slug]/page.tsx` — a
  department tab. `app/tabs/[slug]/actions.ts` and `app/actions.ts` — the
  server actions that write data.

## Auth: not yet built, designed for it

Per the initial build scope, there's no login — every tab is openly
editable by anyone with the link. It's architected so a passcode/PIN layer
can be added later without a data-model change:

- Every read/write is scoped by the leader's stable `slug` (e.g.
  `jill-spencer`), not by "whichever tab happens to be open" in the UI.
- `saveWeekEntry(personSlug, ...)` and `setDecisionResolved(...)` are the
  only write paths. Gating edits later is a matter of checking "does the
  caller own this slug?" at the top of each, or in the server actions that
  call them (`app/tabs/[slug]/actions.ts`, `app/actions.ts`).
- Melissa's View renders no edit controls at all (except marking a
  decision resolved, which the spec calls out as something she does
  directly) — flipping on real read-only enforcement later doesn't
  require any UI rework.

## Branding

The current visual theme (`app/globals.css`) is a **placeholder** —
neutral grays with a generic navy accent — not OES Global's real brand.
Swap in the real logo, color hex codes, and font once provided; the theme
is centralized in that one file's CSS variables.

## Known non-goals for this build (by design)

- No Slack/email reminders for the weekly submission deadline.
- No integrations with QuickBooks/CRM/inventory systems — every field is
  manually entered.
- No custom domain configured — the live URL is whatever Vercel assigns
  the project (`*.vercel.app`) unless a domain is added in Vercel's
  project settings.
