import prisma from "@/lib/db";

import LeagueKnockoutMatchForm from "@/components/forms/LeagueKnockoutMatchForm";

export default async function EditLeagueKnockoutMatchPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const leagues = await prisma.league.findMany();

  const match = await prisma.leagueKnockoutMatch.findUnique({
    where: { id: +id },
    include: {
      season: {
        include: { league: { include: { country: true } } },
      },
    },
  });

  if (!match) throw new Error("Something went wrong");

  return <LeagueKnockoutMatchForm leagues={leagues} match={match} />;
}
