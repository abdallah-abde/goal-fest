-- AlterTable
ALTER TABLE "Group" ADD COLUMN "round" TEXT;

-- CreateTable
CREATE TABLE "Country" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "flagUrl" TEXT
);

-- CreateTable
CREATE TABLE "_CountryToTournamentEdition" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CountryToTournamentEdition_A_fkey" FOREIGN KEY ("A") REFERENCES "Country" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CountryToTournamentEdition_B_fkey" FOREIGN KEY ("B") REFERENCES "TournamentEdition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TournamentEdition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "logoUrl" TEXT,
    "tournamentId" INTEGER NOT NULL,
    "winnerId" INTEGER,
    CONSTRAINT "TournamentEdition_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TournamentEdition_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TournamentEdition" ("id", "logoUrl", "tournamentId", "year") SELECT "id", "logoUrl", "tournamentId", "year" FROM "TournamentEdition";
DROP TABLE "TournamentEdition";
ALTER TABLE "new_TournamentEdition" RENAME TO "TournamentEdition";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_CountryToTournamentEdition_AB_unique" ON "_CountryToTournamentEdition"("A", "B");

-- CreateIndex
CREATE INDEX "_CountryToTournamentEdition_B_index" ON "_CountryToTournamentEdition"("B");
