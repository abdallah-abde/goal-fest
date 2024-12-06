import prisma from "@/lib/db";

import LeaguesHistory from "@/components/lists/LeaguesHistory";

import { LeagueStages } from "@/types/enums";

export default async function LeaguesHistoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const season = await prisma.season.findFirst({
    where: { slug },
    select: { league: true },
  });

  if (!season) throw new Error("Something went wrong");

  const league = season.league;

  const seasons = await prisma.season.findMany({
    where: {
      league: {
        id: league.id,
      },
      currentStage: LeagueStages.Finished,
    },
    include: {
      league: { include: { country: true } },
      winner: true,
      titleHolder: true,
      hostingCountries: true,
    },
  });

  return <LeaguesHistory league={league} seasons={seasons} />;
}
