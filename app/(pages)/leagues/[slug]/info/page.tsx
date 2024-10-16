import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

import {
  LeagueTotalCleanSheetsProps,
  LeagueTotalGoalsProps,
} from "@/types/totalStats";

import LeaguesInfoCards from "@/components/lists/cards/edition-info-cards/LeaguesInfoCards";

import {
  getLeagueTeamsGoalsScored,
  getLeagueTeamsGoalsAgainst,
  getLeagueTeamsCleanSheets,
} from "@/lib/data/queries";

export default async function LeaguesInfoPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const [leagueSeason, teamsGoalsScored, teamsGoalsAgainst, teamsCleanSheets] =
    await Promise.all([
      prisma.leagueSeason.findFirst({
        where: {
          slug,
        },
        include: {
          league: {
            include: {
              country: true,
            },
          },
          teams: true,
          winner: true,
          titleHolder: true,
          matches: {
            include: {
              homeTeam: true,
              awayTeam: true,
              season: true,
            },
          },
        },
      }),
      await prisma.$queryRaw<LeagueTotalGoalsProps[]>`${Prisma.raw(
        getLeagueTeamsGoalsScored(slug, 5)
      )}`,
      await prisma.$queryRaw<LeagueTotalGoalsProps[]>`${Prisma.raw(
        getLeagueTeamsGoalsAgainst(slug, 5)
      )}`,
      await prisma.$queryRaw<LeagueTotalCleanSheetsProps[]>`${Prisma.raw(
        getLeagueTeamsCleanSheets(slug, 5)
      )}`,
    ]);

  if (!leagueSeason) throw new Error("Something went wrong");

  return (
    <LeaguesInfoCards
      leagueSeason={leagueSeason}
      teamsGoalsScored={teamsGoalsScored}
      teamsGoalsAgainst={teamsGoalsAgainst}
      teamsCleanSheets={teamsCleanSheets}
    />
  );
}
