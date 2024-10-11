import prisma from "@/lib/db";

import SeasonForm from "@/components/forms/SeasonForm";

export default async function EditSeasonPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const leagues = await prisma.league.findMany();
  const teams = await prisma.leagueTeam.findMany();

  const leagueSeason = await prisma.leagueSeason.findUnique({
    where: { id: parseInt(id) },
    include: {
      league: true,
      teams: true,
    },
  });

  if (!leagueSeason) throw new Error("Something went wrong");

  return (
    <SeasonForm leagueSeason={leagueSeason} leagues={leagues} teams={teams} />
  );
}
