import prisma from "@/lib/db";

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
  const [season, teamsGoalsScored, teamsGoalsAgainst, teamsCleanSheets] =
    await Promise.all([
      prisma.season.findUnique({
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
      await getTeamsGoalsScored(slug, undefined),
      await getTeamsGoalsAgainst(slug, undefined),
      await getTeamsCleanSheets(slug, undefined),
    ]);

  if (!season) throw new Error("Something went wrong");

  return (
    <>
      <PageHeader label={`${season.league.name} ${season.year} Statistics`} />

      <TeamsStats
        teamsGoalsScored={teamsGoalsScored}
        teamsGoalsAgainst={teamsGoalsAgainst}
        teamsCleanSheets={teamsCleanSheets}
      />
    </>
  );
}
