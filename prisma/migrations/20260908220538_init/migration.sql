-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "WeekEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personId" TEXT NOT NULL,
    "weekStart" DATETIME NOT NULL,
    "wins" JSONB NOT NULL,
    "priorities" JSONB NOT NULL,
    "blockers" TEXT NOT NULL DEFAULT '',
    "teamUpdates" TEXT NOT NULL DEFAULT '',
    "metrics" JSONB NOT NULL,
    "focusAnswers" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WeekEntry_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personId" TEXT NOT NULL,
    "weekEntryId" TEXT NOT NULL,
    "ask" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL DEFAULT '',
    "neededBy" DATETIME NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Decision_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Decision_weekEntryId_fkey" FOREIGN KEY ("weekEntryId") REFERENCES "WeekEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_slug_key" ON "Person"("slug");

-- CreateIndex
CREATE INDEX "WeekEntry_weekStart_idx" ON "WeekEntry"("weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "WeekEntry_personId_weekStart_key" ON "WeekEntry"("personId", "weekStart");

-- CreateIndex
CREATE INDEX "Decision_resolved_neededBy_idx" ON "Decision"("resolved", "neededBy");
