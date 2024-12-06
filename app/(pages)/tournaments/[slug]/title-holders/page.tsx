import prisma from "@/lib/db";

import LeaguesTitleHolders from "@/components/lists/LeaguesTitleHolders";

interface WinnerProps {
  winnerId: number;
  teamName: string;
  flagUrl: string;
  year: number;
}

export default async function TournamentsTitleHoldersPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const [edition, winners] = await Promise.all([
    prisma.tournamentEdition.findUnique({
      where: {
        slug,
      },
      include: {
        tournament: true,
        teams: true,
        winner: true,
        titleHolder: true,
        hostingCountries: true,
      },
    }),
    prisma.$queryRaw<
      WinnerProps[]
    >`SELECT winnerId, Team.name as teamName, Team.flagUrl, year from TournamentEdition, Team where TournamentEdition.slug = ${slug} and winnerId = Team.id and currentStage = 'Finished' order by year desc`,
  ]);

  if (!edition) throw new Error("Something went wrong");

  return (
    <LeaguesTitleHolders
      type="tournaments"
      editionOrSeason={edition}
      winners={winners}
    />
  );
}
