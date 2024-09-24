import prisma from "@/lib/db";
import EditionInfo from "@/components/lists/cards/EditionInfo";
import {
  getTeamsGoalsAgainst,
  getTeamsGoalsScored,
  getTeamsCleanSheets,
} from "@/lib/data/queries";
import { TotalCleanSheetsProps, TotalGoalsProps } from "@/types/totalStats";
import { Prisma } from "@prisma/client";

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
        teams: true,
        tournament: true,
        winner: true,
        titleHolder: true,
        hostingCountries: true,
        matches: true,
        knockoutMatches: true,
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

  return (
    <EditionInfo
      tournamentEdition={tournamentEdition}
      teamsGoalsScored={teamsGoalsScored}
      teamsGoalsAgainst={teamsGoalsAgainst}
      teamsCleanSheets={teamsCleanSheets}
    />
  );
}
