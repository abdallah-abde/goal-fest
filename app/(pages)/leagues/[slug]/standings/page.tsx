import prisma from "@/lib/db";

import { calculateLeagueTeamStats } from "@/lib/calculateTeamStats";

import LeagueStandingsTables from "@/components/lists/tables/LeagueStandingsTables";

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

  const leagueSeason = await prisma.leagueSeason.findUnique({
    where: { slug },
    include: {
      league: true,
      teams: true,
    },
  });

  if (!leagueSeason) throw new Error("Something went wrong");

  const standings = await Promise.all(
    leagueSeason.teams.map(async (team) => ({
      ...team,
      stats: await calculateLeagueTeamStats(team.id, slug),
    }))
  );

  return (
    <LeagueStandingsTables leagueSeason={leagueSeason} standings={standings} />
  );
}
