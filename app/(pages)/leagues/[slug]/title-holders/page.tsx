import prisma from "@/lib/db";

import TournamentsTitleHolders from "@/components/lists/TournamentsTitleHolders";

interface WinnerProps {
  winnerId: number;
  teamName: string;
  flagUrl: string;
  year: number;
}

export default async function LeaguesTitleHoldersPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const [leagueSeason, leagueWinners] = await Promise.all([
    prisma.leagueSeason.findUnique({
      where: {
        slug,
      },
      include: {
        teams: true,
        league: true,
        winner: true,
        titleHolder: true,
      },
    }),
    prisma.$queryRaw<
      WinnerProps[]
    >`SELECT winnerId, LeagueTeam.name as teamName, LeagueTeam.flagUrl, year from LeagueSeason, LeagueTeam where LeagueSeason.slug = ${slug} and winnerId = LeagueTeam.id and currentStage = 'Finished' order by year desc`,
  ]);

  if (!leagueSeason) throw new Error("Something went wrong");

  return (
    <TournamentsTitleHolders
      type="leagues"
      editionOrSeason={leagueSeason}
      winners={leagueWinners}
    />
  );
}
