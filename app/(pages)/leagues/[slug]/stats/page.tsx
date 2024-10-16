import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

import {
  LeagueTotalCleanSheetsProps,
  LeagueTotalGoalsProps,
} from "@/types/totalStats";

import PageHeader from "@/components/PageHeader";
import LeagueTeamsStats from "@/components/lists/cards/stats/LeagueTeamsStats";

import {
  getLeagueTeamsCleanSheets,
  getLeagueTeamsGoalsAgainst,
  getLeagueTeamsGoalsScored,
} from "@/lib/data/queries";

export default async function LeaguesStatsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const [leagueSeason, teamsGoalsScored, teamsGoalsAgainst, teamsCleanSheets] =
    await Promise.all([
      prisma.leagueSeason.findUnique({
        where: {
          slug,
        },
        include: {
          teams: true,
          league: true,
          winner: true,
          titleHolder: true,
        },
      }),
      await prisma.$queryRaw<LeagueTotalGoalsProps[]>`${Prisma.raw(
        getLeagueTeamsGoalsScored(slug)
      )}`,
      await prisma.$queryRaw<LeagueTotalGoalsProps[]>`${Prisma.raw(
        getLeagueTeamsGoalsAgainst(slug)
      )}`,
      await prisma.$queryRaw<LeagueTotalCleanSheetsProps[]>`${Prisma.raw(
        getLeagueTeamsCleanSheets(slug)
      )}`,
    ]);

  if (!leagueSeason) throw new Error("Something went wrong");

  return (
    <>
      <PageHeader
        label={`${leagueSeason.league.name} ${leagueSeason.year} Statistics`}
      />

      <LeagueTeamsStats
        teamsGoalsScored={teamsGoalsScored}
        teamsGoalsAgainst={teamsGoalsAgainst}
        teamsCleanSheets={teamsCleanSheets}
      />
    </>
  );
}
