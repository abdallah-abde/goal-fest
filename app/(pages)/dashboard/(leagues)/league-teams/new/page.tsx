import prisma from "@/lib/db";

import LeagueTeamForm from "@/components/forms/LeagueTeamForm";

export default async function AddTeamPage() {
  const countries = await prisma.country.findMany();

  return <LeagueTeamForm countries={countries} />;
}
