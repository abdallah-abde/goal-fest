import prisma from "@/lib/db";

import TitleHolders from "@/components/lists/TitleHolders";

interface WinnerProps {
  winnerId: number;
  teamName: string;
  flagUrl: string;
  year: number;
}

export default async function TitleHoldersPage({
  params,
}: {
  params: { editionId: string; id: string };
}) {
  const [tournamentEdition, tournamentWinners] = await Promise.all([
    prisma.tournamentEdition.findUnique({
      where: {
        id: +params.editionId,
        tournamentId: +params.id,
      },
      include: {
        teams: true,
        tournament: true,
        winner: true,
        titleHolder: true,
        hostingCountries: true,
      },
    }),
    prisma.$queryRaw<
      WinnerProps[]
    >`SELECT winnerId, Team.name as teamName, Team.flagUrl, year from TournamentEdition, Team where TournamentEdition.tournamentId = ${+params.id} and winnerId = Team.id and currentStage = 'Finished' order by year desc`,
  ]);

  if (!tournamentEdition) throw new Error("Something went wrong");

  return (
    <TitleHolders
      tournamentEdition={tournamentEdition}
      tournamentWinners={tournamentWinners}
    />
  );
}
