import { FC } from "react";
import prisma from "@/lib/db";
import { calculateTeamStats } from "@/lib/calculateTeamStats";

import GroupTable from "@/components/GroupTable";

interface Props {
  params: { id: string };
}

const TournamentPage: FC<Props> = async ({ params }) => {
  const groups = await prisma.group.findMany({
    where: {
      tournamentId: +params.id,
    },
    include: {
      teams: true,
    },
  });

  const groupsWithTeams = await Promise.all(
    groups.map(async (group) => ({
      ...group,
      teams: await Promise.all(
        group.teams.map(async (team) => ({
          ...team,
          stats: await calculateTeamStats(team.id),
        }))
      ),
    }))
  );

  return <GroupTable groupsWithTeams={groupsWithTeams} />;
};

export default TournamentPage;
