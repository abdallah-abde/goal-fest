/*
  Warnings:

  - You are about to drop the column `round` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN "round" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "tournamentEditionId" INTEGER NOT NULL,
    CONSTRAINT "Group_tournamentEditionId_fkey" FOREIGN KEY ("tournamentEditionId") REFERENCES "TournamentEdition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Group" ("id", "name", "tournamentEditionId") SELECT "id", "name", "tournamentEditionId" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
