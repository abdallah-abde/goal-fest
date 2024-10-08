import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

import { TotalCleanSheetsProps, TotalGoalsProps } from "@/types/totalStats";

import EditionInfo from "@/components/lists/cards/edition-info-cards/EditionInfoCards";

import {
  getTeamsGoalsAgainst,
  getTeamsGoalsScored,
  getTeamsCleanSheets,
} from "@/lib/data/queries";

export default async function EditionPage({
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
        tournament: true,
        teams: true,
        winner: true,
        titleHolder: true,
        hostingCountries: true,
        matches: {
          include: {
            group: true,
            homeTeam: true,
            awayTeam: true,
            tournamentEdition: true,
          },
        },
        knockoutMatches: {
          include: {
            awayTeam: true,
            homeTeam: true,
            tournamentEdition: true,
          },
        },
      },
    }),
    await prisma.$queryRaw<TotalGoalsProps[]>`${Prisma.raw(
      getTeamsGoalsScored(+params.editionId, 5)
    )}`,
    await prisma.$queryRaw<TotalGoalsProps[]>`${Prisma.raw(
      getTeamsGoalsAgainst(+params.editionId, 5)
    )}`,
    await prisma.$queryRaw<TotalCleanSheetsProps[]>`${Prisma.raw(
      getTeamsCleanSheets(+params.editionId, 5)
    )}`,
  ]);

  if (!tournamentEdition) throw new Error("Something went wrong");

  return (
    <EditionInfo
      tournamentEdition={tournamentEdition}
      teamsGoalsScored={teamsGoalsScored}
      teamsGoalsAgainst={teamsGoalsAgainst}
      teamsCleanSheets={teamsCleanSheets}
    />
  );
}
