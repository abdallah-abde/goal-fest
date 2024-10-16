import prisma from "@/lib/db";

import TournamentsTitleHolders from "@/components/lists/TournamentsTitleHolders";

interface WinnerProps {
  winnerId: number;
  teamName: string;
  flagUrl: string;
  year: number;
}

export default async function TitleHoldersPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const [tournamentEdition, tournamentWinners] = await Promise.all([
    prisma.tournamentEdition.findUnique({
      where: {
        slug,
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
    >`SELECT winnerId, Team.name as teamName, Team.flagUrl, year from TournamentEdition, Team where TournamentEdition.slug = ${slug} and winnerId = Team.id and currentStage = 'Finished' order by year desc`,
  ]);

  if (!tournamentEdition) throw new Error("Something went wrong");

  return (
    <TournamentsTitleHolders
      tournamentEdition={tournamentEdition}
      tournamentWinners={tournamentWinners}
    />
  );
}
