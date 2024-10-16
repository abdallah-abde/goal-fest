import prisma from "@/lib/db";

import { calculateTeamStats } from "@/lib/calculateTeamStats";

import GroupsTable from "@/components/lists/tables/GroupsTables";

export default async function GroupsPage({
  params,
  searchParams,
}: {
  params: { editionId: string; id: string };
  searchParams: {
    groupId: string;
  };
}) {
  const groupId = searchParams?.groupId || "all";

  const [tournamentEdition, groups] = await Promise.all([
    prisma.tournamentEdition.findUnique({
      where: { id: +params.editionId },
      include: {
        tournament: true,
        groups: true,
      },
    }),
    prisma.group.findMany({
      where: {
        tournamentEditionId: +params.editionId,
        tournamentEdition: {
          tournamentId: +params.id,
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
