import prisma from "@/lib/db";
import MatchesCards from "@/components/lists/MatchesCards";

export default async function AllMatchesPage({
  params,
}: {
  params: { editionId: string };
}) {
  const [matches, knockoutMatches] = await Promise.all([
    prisma.match.findMany({
      where: {
        tournamentEditionId: +params.editionId,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        tournamentEdition: true,
        group: true,
      },
    }),
    prisma.knockoutMatch.findMany({
      where: {
        tournamentEditionId: +params.editionId,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        tournamentEdition: true,
      },
    }),
  ]);

  return <MatchesCards matches={matches} knockoutMatches={knockoutMatches} />;
}
