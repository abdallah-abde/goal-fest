import prisma from "@/lib/db";
import MatchesCards from "@/components/lists/MatchesCards";

export default async function MatchesPage({
  params,
}: {
  params: { editionId: string; id: string };
}) {
  const [matches, knockoutMatches] = await Promise.all([
    prisma.match.findMany({
      where: {
        tournamentEditionId: +params.editionId,
        tournamentEdition: {
          tournamentId: +params.id,
        },
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
        tournamentEdition: {
          tournamentId: +params.id,
        },
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
