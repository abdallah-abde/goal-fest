-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TournamentEdition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "yearAsString" TEXT,
    "logoUrl" TEXT,
    "tournamentId" INTEGER NOT NULL,
    "winnerId" INTEGER,
    "titleHolderId" INTEGER,
    CONSTRAINT "TournamentEdition_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TournamentEdition_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TournamentEdition_titleHolderId_fkey" FOREIGN KEY ("titleHolderId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TournamentEdition" ("id", "logoUrl", "tournamentId", "winnerId", "year") SELECT "id", "logoUrl", "tournamentId", "winnerId", "year" FROM "TournamentEdition";
DROP TABLE "TournamentEdition";
ALTER TABLE "new_TournamentEdition" RENAME TO "TournamentEdition";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
