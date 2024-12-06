import prisma from "@/lib/db";

import LeaguesHistory from "@/components/lists/LeaguesHistory";
import { LeagueStages } from "@/types/enums";

export default async function TournamentsHistoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const edition = await prisma.tournamentEdition.findUnique({
    where: { slug },
    include: { tournament: true },
  });

  if (!edition) throw new Error("Something went wrong");

  const editions = await prisma.tournamentEdition.findMany({
    where: {
      tournament: {
        id: edition.tournament.id,
      },
      currentStage: LeagueStages.Finished,
    },
    include: {
      tournament: true,
      winner: true,
      titleHolder: true,
      hostingCountries: true,
    },
  });

  return (
    <LeaguesHistory
      type="tournaments"
      tournamentOrLeague={edition.tournament}
      editionsOrSeasons={editions}
    />
  );
}
