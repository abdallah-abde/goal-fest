import prisma from "@/lib/db";
import { calculateTeamStats } from "@/lib/calculateTeamStats";

import GroupsTable from "@/components/lists/GroupsTables";

export default async function GroupsPage({
  params,
}: {
  params: { editionId: string };
}) {
  const groups = await prisma.group.findMany({
    where: {
      tournamentEditionId: +params.editionId,
    },

    select: {
      id: true,
      name: true,
      tournamentEditionId: true,
      teams: true,
    },
  });

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

  // await new Promise((resolve) => {
  //   setTimeout(() => {}, 300);
  // });

  return <GroupsTable groupsWithTeams={groupsWithTeams} />;
}
