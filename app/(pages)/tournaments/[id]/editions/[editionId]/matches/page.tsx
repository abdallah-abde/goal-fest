import prisma from "@/lib/db";

import MatchesCards from "@/components/lists/cards/matches/MatchesCards";
import { getAllMatchesRounds } from "@/lib/getAllMatchesRounds";

export default async function MatchesPage({
  params,
  searchParams,
}: {
  params: { editionId: string; id: string };
  searchParams: {
    teamId?: string;
    groupId?: string;
    round?: string;
  };
}) {
  const teamId = searchParams?.teamId || "all";
  const groupId = searchParams?.groupId || "all";
  const round = searchParams?.round || "all";

  const teamCondition = isNaN(Number(teamId))
    ? {}
    : {
        OR: [{ homeTeamId: +teamId }, { awayTeamId: +teamId }],
      };
  const groupCondition = isNaN(Number(groupId)) ? {} : { groupId: +groupId };
  const roundCondition = round === "all" ? {} : { round };

  const [tournamentEdition, matches, knockoutMatches, rounds] =
    await Promise.all([
      prisma.tournamentEdition.findUnique({
        where: { id: +params.editionId },
        include: {
          tournament: true,
          teams: true,
          groups: true,
        },
      }),
      prisma.match.findMany({
        where: {
          tournamentEditionId: +params.editionId,
          tournamentEdition: {
            tournamentId: +params.id,
          },
          OR: [
            { ...teamCondition },
            { ...groupCondition },
            { ...roundCondition },
          ],
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
          OR: [{ ...teamCondition }, { ...roundCondition }],
        },
        include: {
          homeTeam: true,
          awayTeam: true,
          tournamentEdition: true,
        },
      }),
      getAllMatchesRounds(+params.editionId),
    ]);

  return (
    <MatchesCards
      tournamentEdition={tournamentEdition}
      matches={matches}
      knockoutMatches={knockoutMatches}
      rounds={rounds}
    />
  );
}
