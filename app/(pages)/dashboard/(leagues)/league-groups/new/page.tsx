import prisma from "@/lib/db";

import LeagueGroupForm from "@/components/forms/LeagueGroupForm";

export default async function AddLeagueGroupPage() {
  const leagues = await prisma.league.findMany({
    include: { country: true },
  });

  return <LeagueGroupForm leagues={leagues} />;
}
