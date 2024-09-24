import prisma from "@/lib/db";

import MatchesCards from "@/components/lists/cards/matches/MatchesCards";

export default async function MatchesPage({
  params,
}: {
  params: { editionId: string; id: string };
}) {
  const [tournamentEdition, matches, knockoutMatches] = await Promise.all([
    prisma.tournamentEdition.findUnique({
      where: { id: +params.editionId },
      include: {
        tournament: true,
      },
    }),
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

  return (
    <MatchesCards
      tournamentEdition={tournamentEdition}
      matches={matches}
      knockoutMatches={knockoutMatches}
    />
  );
}
