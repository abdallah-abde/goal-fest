import prisma from "@/lib/db";
import { calculateTeamStats } from "@/lib/calculateTeamStats";

import EditionGroupList from "@/components/EditionGroupList";

const TournamentEditionPage = async ({
  params,
}: {
  params: { editionId: string };
}) => {
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

  return <EditionGroupList groupsWithTeams={groupsWithTeams} />;
};

export default TournamentEditionPage;
