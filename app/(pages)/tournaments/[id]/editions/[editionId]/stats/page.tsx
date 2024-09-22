import TotalCleanSheetsCard from "@/components/lists/cards/TotalCleanSheetsCards";
import TotalGoalsCard from "@/components/lists/cards/TotalGoalsCard";
import PageHeader from "@/components/PageHeader";
import {
  getTeamsCleanSheets,
  getTeamsGoalsAgainst,
  getTeamsGoalsScored,
} from "@/lib/data/queries";

import prisma from "@/lib/db";
import { TotalCleanSheetsProps, TotalGoalsProps } from "@/types/totalStats";
import { Prisma } from "@prisma/client";

export default async function StatsPage({
  params,
}: {
  params: { editionId: string; id: string };
}) {
  const [
    tournamentEdition,
    teamsGoalsScored,
    teamsGoalsAgainst,
    teamsCleanSheets,
  ] = await Promise.all([
    prisma.tournamentEdition.findUnique({
      where: {
        id: +params.editionId,
        tournamentId: +params.id,
      },
      include: {
        teams: true,
        tournament: true,
        winner: true,
        titleHolder: true,
        hostingCountries: true,
      },
    }),
    await prisma.$queryRaw<TotalGoalsProps[]>`${Prisma.raw(
      getTeamsGoalsScored(+params.editionId)
    )}`,
    await prisma.$queryRaw<TotalGoalsProps[]>`${Prisma.raw(
      getTeamsGoalsAgainst(+params.editionId)
    )}`,
    await prisma.$queryRaw<TotalCleanSheetsProps[]>`${Prisma.raw(
      getTeamsCleanSheets(+params.editionId)
    )}`,
  ]);

  if (!tournamentEdition) throw new Error("Something went wrong");

  return (
    <>
      <PageHeader
        label={`${tournamentEdition.tournament.name} ${tournamentEdition.yearAsString} Statistics`}
      />

      {(teamsGoalsScored.length > 0 ||
        teamsGoalsAgainst.length > 0 ||
        teamsCleanSheets.length > 0) && (
        <div className='flex flex-wrap gap-2 justify-between'>
          {teamsGoalsScored && (
            <TotalGoalsCard
              label='Most goals scored'
              teamsGoals={teamsGoalsScored}
            />
          )}
          {teamsGoalsAgainst && (
            <TotalGoalsCard
              label='Most goals conceded'
              teamsGoals={teamsGoalsAgainst}
            />
          )}
          {teamsCleanSheets && (
            <TotalCleanSheetsCard
              label='Most clean sheets'
              teamsCleanSheets={teamsCleanSheets}
            />
          )}
        </div>
      )}
    </>
  );
}
