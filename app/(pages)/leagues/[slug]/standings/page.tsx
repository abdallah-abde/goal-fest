import prisma from "@/lib/db";

import {
  calculateLeagueGroupTeamStats,
  calculateLeagueTeamStats,
} from "@/lib/calculateTeamStats";

import LeagueStandingsTables from "@/components/lists/tables/LeagueStandingsTables";
import LeagueGroupsTables from "@/components/lists/tables/LeagueGroupsTables";

export default async function LeaguesStandingsPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: {
    groupId: string;
  };
}) {
  const { slug } = params;

  const groupId = searchParams?.groupId || "all";

  const leagueSeason = await prisma.leagueSeason.findUnique({
    where: { slug },
    include: {
      league: true,
      teams: true,
      groups: true,
    },
  });

  if (!leagueSeason) throw new Error("Something went wrong");

  let standings;

  if (
    !leagueSeason.groups ||
    leagueSeason.groups.length === 0 ||
    leagueSeason.groups.length === 1
  ) {
    standings = await Promise.all(
      leagueSeason.teams.map(async (team) => ({
        ...team,
        stats: await calculateLeagueTeamStats(team.id, slug),
      }))
    );

    return (
      <LeagueStandingsTables
        leagueSeason={leagueSeason}
        standings={standings}
      />
    );
  } else {
    const groups = await prisma.leagueGroup.findMany({
      where: {
        season: {
          slug,
        },
        ...(groupId !== "all" && !isNaN(Number(groupId)) && { id: +groupId }),
      },

      select: {
        id: true,
        name: true,
        seasonId: true,
        teams: true,
      },
    });

    standings = await Promise.all(
      groups.map(async (group) => ({
        ...group,
        teams: await Promise.all(
          group.teams.map(async (team) => ({
            ...team,
            stats: await calculateLeagueGroupTeamStats(team.id, group.id),
          }))
        ),
      }))
    );

    return (
      <LeagueGroupsTables season={leagueSeason} groupsWithTeams={standings} />
    );
  }
}
