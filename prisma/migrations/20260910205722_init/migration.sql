-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeekEntry" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "wins" JSONB NOT NULL,
    "priorities" JSONB NOT NULL,
    "blockers" TEXT NOT NULL DEFAULT '',
    "teamUpdates" TEXT NOT NULL DEFAULT '',
    "metrics" JSONB NOT NULL,
    "focusAnswers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeekEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "weekEntryId" TEXT NOT NULL,
    "ask" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL DEFAULT '',
    "neededBy" TIMESTAMP(3) NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_slug_key" ON "Person"("slug");

-- CreateIndex
CREATE INDEX "WeekEntry_weekStart_idx" ON "WeekEntry"("weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "WeekEntry_personId_weekStart_key" ON "WeekEntry"("personId", "weekStart");

-- CreateIndex
CREATE INDEX "Decision_resolved_neededBy_idx" ON "Decision"("resolved", "neededBy");

-- AddForeignKey
ALTER TABLE "WeekEntry" ADD CONSTRAINT "WeekEntry_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_weekEntryId_fkey" FOREIGN KEY ("weekEntryId") REFERENCES "WeekEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
