import prisma from "@/lib/db";

import TournamentsHistory from "@/components/lists/TournamentsHistory";
import { TournamentStages } from "@/types/enums";

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
      currentStage: TournamentStages.Finished,
    },
    include: {
      tournament: true,
      winner: true,
      titleHolder: true,
      hostingCountries: true,
    },
  });

  return (
    <TournamentsHistory
      type="tournaments"
      tournamentOrLeague={edition.tournament}
      editionsOrSeasons={editions}
    />
  );
}
