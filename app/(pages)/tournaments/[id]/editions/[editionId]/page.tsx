import { FC } from "react";
import prisma from "@/lib/db";
import { calculateTeamStats } from "@/lib/calculateTeamStats";

import EditionGroupList from "@/components/EditionGroupList";
import Loading from "@/app/loading";

interface Props {
  params: { editionId: string };
}

const TournamentEditionPage: FC<Props> = async ({ params }) => {
  const groups = await prisma.group.findMany({
    where: {
      tournamentEditionId: +params.editionId,
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
          stats: await calculateTeamStats(team.id, group.id),
        }))
      ),
    }))
  );

  return <EditionGroupList groupsWithTeams={groupsWithTeams} />;
};

export default TournamentEditionPage;
