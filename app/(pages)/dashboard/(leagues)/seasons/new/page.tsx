import prisma from "@/lib/db";

import SeasonForm from "@/components/forms/SeasonForm";

export default async function AddSeasonPage() {
  const leagues = await prisma.league.findMany();
  const teams = await prisma.leagueTeam.findMany();

  return <SeasonForm leagues={leagues} teams={teams} />;
}
