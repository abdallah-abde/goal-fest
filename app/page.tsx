import { FC } from "react";
import { TeamWithStats } from "@/typings";
import prisma from "@/lib/db";
import { calculateTeamStats } from "@/lib/calculateTeamStats";

import GroupTable from "@/components/GroupTable";

const HomePage: FC = async () => {
  const teams = await prisma.team.findMany({
    include: { matchesHome: true, matchesAway: true },
  });

  const teamsWithStats: TeamWithStats[] = await Promise.all(
    teams.map(async (team) => ({
      ...team,
      stats: await calculateTeamStats(team.id),
    }))
  );

  return <GroupTable teamsWithStats={teamsWithStats} />;
};

export default HomePage;
