import prisma from "@/lib/db";

import { calculateTeamStats } from "@/lib/calculateTeamStats";

import GroupsTable from "@/components/lists/tables/GroupsTables";

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

  const [tournamentEdition, groups] = await Promise.all([
    prisma.tournamentEdition.findUnique({
      where: { slug },
      include: {
        tournament: true,
        groups: true,
      },
    }),
    prisma.group.findMany({
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
    }),
  ]);

  if (!tournamentEdition) throw new Error("Something went wrong");

  const groupsWithTeams = await Promise.all(
    groups.map(async (group) => ({
      ...group,
      teams: await Promise.all(
        group.teams.map(async (team) => ({
          ...team,
          stats: await calculateTeamStats(team.id, group.id),
        }))
      ),
    }))
  );

  return (
    <GroupsTable
      tournamentEdition={tournamentEdition}
      groupsWithTeams={groupsWithTeams}
    />
  );
}
