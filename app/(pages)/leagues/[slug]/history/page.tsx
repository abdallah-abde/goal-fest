import prisma from "@/lib/db";

import TournamentsHistory from "@/components/lists/TournamentsHistory";

import {TournamentStages} from '@/types/enums'

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

  if (!leagueSeason) throw new Error("Something went wrong");

  const league = leagueSeason.league;

  const seasons = await prisma.leagueSeason.findMany({
    where: {
      league: {
        id: league.id,
      },
      currentStage: TournamentStages.Finished,
    },
    include: {
      league: { include: { country: true } },
      winner: true,
      titleHolder: true,
    },
  });

  return (
    <TournamentsHistory
      type="leagues"
      tournamentOrLeague={league}
      editionsOrSeasons={seasons}
    />
  );
}
