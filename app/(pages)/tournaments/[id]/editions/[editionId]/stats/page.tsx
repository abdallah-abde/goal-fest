import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

import { TotalCleanSheetsProps, TotalGoalsProps } from "@/types/totalStats";

import PageHeader from "@/components/PageHeader";
import TeamsStats from "@/components/lists/cards/stats/TeamsStats";

import {
  getTeamsCleanSheets,
  getTeamsGoalsAgainst,
  getTeamsGoalsScored,
} from "@/lib/data/queries";

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

      <TeamsStats
        teamsGoalsScored={teamsGoalsScored}
        teamsGoalsAgainst={teamsGoalsAgainst}
        teamsCleanSheets={teamsCleanSheets}
      />
    </>
  );
}
