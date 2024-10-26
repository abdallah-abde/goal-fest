import prisma from "@/lib/db";

import LeagueTeamForm from "@/components/forms/LeagueTeamForm";

export default async function EditLeagueTeamPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const countries = await prisma.country.findMany();

  const leagueTeam = await prisma.leagueTeam.findUnique({
    where: { id: parseInt(id) },
  });

  if (!leagueTeam) throw new Error("Something went wrong");

  return <LeagueTeamForm leagueTeam={leagueTeam} countries={countries} />;
}
