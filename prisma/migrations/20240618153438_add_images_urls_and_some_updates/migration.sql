-- AlterTable
ALTER TABLE "Team" ADD COLUMN "flagUrl" TEXT;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN "logoUrl" TEXT;

-- AlterTable
ALTER TABLE "TournamentEdition" ADD COLUMN "logoUrl" TEXT;

-- CreateTable
CREATE TABLE "_TeamToTournamentEdition" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TeamToTournamentEdition_A_fkey" FOREIGN KEY ("A") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TeamToTournamentEdition_B_fkey" FOREIGN KEY ("B") REFERENCES "TournamentEdition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_KnockoutMatch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "homeTeamId" INTEGER,
    "awayTeamId" INTEGER,
    "homeGoals" INTEGER,
    "awayGoals" INTEGER,
    "homeExtraTimeGoals" INTEGER,
    "awayExtraTimeGoals" INTEGER,
    "homePenaltyGoals" INTEGER,
    "awayPenaltyGoals" INTEGER,
    "date" DATETIME,
    "tournamentEditionId" INTEGER NOT NULL,
    "round" TEXT,
    CONSTRAINT "KnockoutMatch_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "KnockoutMatch_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "KnockoutMatch_tournamentEditionId_fkey" FOREIGN KEY ("tournamentEditionId") REFERENCES "TournamentEdition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_KnockoutMatch" ("awayGoals", "awayTeamId", "date", "homeGoals", "homeTeamId", "id", "tournamentEditionId") SELECT "awayGoals", "awayTeamId", "date", "homeGoals", "homeTeamId", "id", "tournamentEditionId" FROM "KnockoutMatch";
DROP TABLE "KnockoutMatch";
ALTER TABLE "new_KnockoutMatch" RENAME TO "KnockoutMatch";
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "homeTeamId" INTEGER NOT NULL,
    "awayTeamId" INTEGER NOT NULL,
    "homeGoals" INTEGER,
    "awayGoals" INTEGER,
    "date" DATETIME,
    "groupId" INTEGER NOT NULL,
    "tournamentEditionId" INTEGER NOT NULL,
    CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_tournamentEditionId_fkey" FOREIGN KEY ("tournamentEditionId") REFERENCES "TournamentEdition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("awayGoals", "awayTeamId", "date", "groupId", "homeGoals", "homeTeamId", "id", "tournamentEditionId") SELECT "awayGoals", "awayTeamId", "date", "groupId", "homeGoals", "homeTeamId", "id", "tournamentEditionId" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_TeamToTournamentEdition_AB_unique" ON "_TeamToTournamentEdition"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamToTournamentEdition_B_index" ON "_TeamToTournamentEdition"("B");
