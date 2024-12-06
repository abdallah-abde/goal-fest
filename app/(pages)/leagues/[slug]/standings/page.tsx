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

  const season = await prisma.season.findUnique({
    where: { slug },
    include: {
      league: true,
      teams: true,
      groups: true,
    },
  });

  if (!season) throw new Error("Something went wrong");

  let standings;

  if (
    !season.groups ||
    season.groups.length === 0 ||
    season.groups.length === 1
  ) {
    standings = await Promise.all(
      season.teams.map(async (team) => ({
        ...team,
        stats: await calculateTeamStatsBySlug(team.id, slug),
      }))
    );

    return <StandingsTables season={season} standings={standings} />;
  } else {
    const groups = await prisma.group.findMany({
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
            stats: await calculateTeamStatsByGroup(team.id, group.id),
          }))
        ),
      }))
    );

    return <GroupsTables season={season} groupsWithTeams={standings} />;
  }
}
