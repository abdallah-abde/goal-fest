import prisma from "@/lib/db";

import LeagueMatchForm from "@/components/forms/LeagueMatchForm";

export default async function EditLeagueMatchPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const leagues = await prisma.league.findMany();

  const leagueMatch = await prisma.leagueMatch.findUnique({
    where: { id: +id },
    include: {
      homeTeam: true,
      awayTeam: true,
      group: true,
      season: {
        include: { league: true },
      },
    },
  });

  if (!leagueMatch) throw new Error("Something went wrong");

  return <LeagueMatchForm leagues={leagues} leagueMatch={leagueMatch} />;
}
