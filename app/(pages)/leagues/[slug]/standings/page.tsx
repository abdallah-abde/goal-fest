import prisma from "@/lib/db";

import {
  calculateTeamStatsByGroup,
  calculateTeamStatsBySlug,
} from "@/lib/calculateTeamStats";

import GroupsTables from "@/components/lists/tables/GroupsTables";
import StandingsTables from "@/components/lists/tables/StandingsTables";

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
        stats: await calculateTeamStatsBySlug(team.id, slug, "leagues"),
      }))
    );

    return (
      <StandingsTables
        editionOrSeason={leagueSeason}
        standings={standings}
        type="leagues"
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
            stats: await calculateTeamStatsByGroup(
              team.id,
              group.id,
              "leagues"
            ),
          }))
        ),
      }))
    );

    return (
      <GroupsTables
        editionOrSeason={leagueSeason}
        groupsWithTeams={standings}
        type="leagues"
      />
    );
  }
}
