import prisma from "@/lib/db";

import History from "@/components/lists/History";

export default async function HistoryPage({
  params,
}: {
  params: { editionId: string; id: string };
}) {
  const [tournamentEdition, matches] = await Promise.all([
    prisma.tournamentEdition.findUnique({
      where: { id: +params.editionId },
      include: { tournament: true },
    }),
    prisma.knockoutMatch.findMany({
      where: {
        round: "Final",
        tournamentEdition: {
          tournamentId: +params.id,
          currentStage: "Finished",
        },
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        tournamentEdition: {
          include: {
            hostingCountries: true,
            winner: true,
            tournament: true,
          },
        },
      },
      orderBy: {
        tournamentEdition: {
          year: "desc",
        },
      },
    }),
  ]);

  if (!tournamentEdition) throw new Error("Something went wrong");

  return <History tournamentEdition={tournamentEdition} matches={matches} />;
}
