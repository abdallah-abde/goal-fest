import prisma from "@/lib/db";

import LeaguesTitleHolders from "@/components/lists/LeaguesTitleHolders";

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

  const [season, winners] = await Promise.all([
    prisma.season.findUnique({
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
    >`SELECT winnerId, Team.name as teamName, Team.flagUrl, year from Season, Team where Season.slug = ${slug} and winnerId = Team.id and currentStage = 'Finished' order by year desc`,
  ]);

  if (!season) throw new Error("Something went wrong");

  return <LeaguesTitleHolders season={season} winners={winners} />;
}
