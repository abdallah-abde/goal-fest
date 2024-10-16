import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

import { TotalCleanSheetsProps, TotalGoalsProps } from "@/types/totalStats";

import TournamentsInfoCards from "@/components/lists/cards/edition-info-cards/TournamentsInfoCards";

import {
  getTournamentTeamsGoalsAgainst,
  getTournamentTeamsGoalsScored,
  getTournamentTeamsCleanSheets,
} from "@/lib/data/queries";

export default async function TournamentsInfoPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const [
    tournamentEdition,
    teamsGoalsScored,
    teamsGoalsAgainst,
    teamsCleanSheets,
  ] = await Promise.all([
    prisma.tournamentEdition.findUnique({
      where: {
        slug,
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
      getTournamentTeamsGoalsScored(slug, 5)
    )}`,
    await prisma.$queryRaw<TotalGoalsProps[]>`${Prisma.raw(
      getTournamentTeamsGoalsAgainst(slug, 5)
    )}`,
    await prisma.$queryRaw<TotalCleanSheetsProps[]>`${Prisma.raw(
      getTournamentTeamsCleanSheets(slug, 5)
    )}`,
  ]);

  if (!tournamentEdition) throw new Error("Something went wrong");

  return (
    <TournamentsInfoCards
      tournamentEdition={tournamentEdition}
      teamsGoalsScored={teamsGoalsScored}
      teamsGoalsAgainst={teamsGoalsAgainst}
      teamsCleanSheets={teamsCleanSheets}
    />
  );
}
