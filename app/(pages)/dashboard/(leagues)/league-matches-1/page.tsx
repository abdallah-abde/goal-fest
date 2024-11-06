import prisma from "@/lib/db";

import LeagueMatchForm1 from "@/components/forms/LeagueMatchForm1";

export default async function AddLeagueMatchPage() {
  const leagues = await prisma.league.findMany();

  return <LeagueMatchForm1 leagues={leagues} />;
}
