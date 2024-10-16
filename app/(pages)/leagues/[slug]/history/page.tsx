import prisma from "@/lib/db";

import LeaguesHistory from "@/components/lists/LeaguesHistory";

export default async function LeaguesHistoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const leagueSeason = await prisma.leagueSeason.findFirst({
    where: { slug },
    select: { league: true },
  });

  const league = leagueSeason?.league;

  const seasons = await prisma.leagueSeason.findMany({
    where: {
      league: {
        id: league?.id,
      },
      currentStage: "Finished",
    },
    include: { league: true, winner: true, titleHolder: true },
  });

  if (!league || !leagueSeason) throw new Error("Something went wrong");

  return <LeaguesHistory league={league} leagueSeasons={seasons} />;
}
