import prisma from "@/lib/db";

import LeagueMatchForm from "@/components/forms/LeagueMatchForm";

export default async function AddLeagueMatchPage() {
  const leagues = await prisma.league.findMany();

  return <LeagueMatchForm leagues={leagues} />;
}
