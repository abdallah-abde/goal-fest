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
      await prisma.$queryRaw<TotalGoalsProps[]>`${Prisma.raw(
        getTeamsGoalsScored(slug, undefined, "leagues")
      )}`,
      await prisma.$queryRaw<TotalGoalsProps[]>`${Prisma.raw(
        getTeamsGoalsAgainst(slug, undefined, "leagues")
      )}`,
      await prisma.$queryRaw<TotalCleanSheetsProps[]>`${Prisma.raw(
        getTeamsCleanSheets(slug, undefined, "leagues")
      )}`,
    ]);

  if (!leagueSeason) throw new Error("Something went wrong");

  return (
    <>
      <PageHeader
        label={`${leagueSeason.league.name} ${leagueSeason.year} Statistics`}
      />

      <TeamsStats
        teamsGoalsScored={teamsGoalsScored}
        teamsGoalsAgainst={teamsGoalsAgainst}
        teamsCleanSheets={teamsCleanSheets}
      />
    </>
  );
}
