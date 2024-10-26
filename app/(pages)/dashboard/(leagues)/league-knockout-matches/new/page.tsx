import prisma from "@/lib/db";

import LeagueKnockoutMatchForm from "@/components/forms/LeagueKnockoutMatchForm";

export default async function AddLeagueKnockoutMatchPage() {
  const leagues = await prisma.league.findMany();

  return <LeagueKnockoutMatchForm leagues={leagues} />;
}
