import prisma from "@/lib/db";

import {
  calculateTeamStatsByGroup,
  calculateTeamStatsBySlug,
} from "@/lib/calculateTeamStats";

import GroupsTable from "@/components/lists/tables/GroupsTables";
import StandingsTables from "@/components/lists/tables/StandingsTables";

export default async function GroupsPage({
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

  const tournamentEdition = await prisma.tournamentEdition.findUnique({
    where: { slug },
    include: {
      tournament: true,
      teams: true,
      groups: true,
    },
  });

  if (!tournamentEdition) throw new Error("Something went wrong");

  let standings;

  if (
    !tournamentEdition.groups ||
    tournamentEdition.groups.length === 0 ||
    tournamentEdition.groups.length === 1
  ) {
    standings = await Promise.all(
      tournamentEdition.teams.map(async (team) => ({
        ...team,
        stats: await calculateTeamStatsBySlug(team.id, slug, "tournaments"),
      }))
    );

    return (
      <StandingsTables
        editionOrSeason={tournamentEdition}
        standings={standings}
        type="tournaments"
      />
    );
  } else {
    const groups = await prisma.group.findMany({
      where: {
        tournamentEdition: {
          slug,
        },
        ...(groupId !== "all" && !isNaN(Number(groupId)) && { id: +groupId }),
      },

      select: {
        id: true,
        name: true,
        tournamentEditionId: true,
        teams: true,
      },
    });

    const standings = await Promise.all(
      groups.map(async (group) => ({
        ...group,
        teams: await Promise.all(
          group.teams.map(async (team) => ({
            ...team,
            stats: await calculateTeamStatsByGroup(
              team.id,
              group.id,
              "tournaments"
            ),
          }))
        ),
      }))
    );

    return (
      <GroupsTable
        editionOrSeason={tournamentEdition}
        groupsWithTeams={standings}
        type="tournaments"
      />
    );
  }
}
