import prisma from "@/lib/db";

import MatchesCards from "@/components/lists/cards/matches/MatchesCards";
import {
  getAllMatchesRounds,
  checkRoundExisted,
} from "@/lib/getAllMatchesRounds";
import { getStartAndEndDates } from "@/lib/getFormattedDate";

export default async function MatchesPage({
  params,
  searchParams,
}: {
  params: { editionId: string; id: string };
  searchParams: {
    teamId: string;
    groupId: string;
    round: string | undefined;
    date: string;
  };
}) {
  const teamId = searchParams?.teamId || "all";
  const groupId = searchParams?.groupId || "all";
  let round = searchParams?.round || undefined;
  const date = searchParams?.date || "";

  round = await checkRoundExisted(+params.editionId, searchParams?.round);

  const isAllTeams = !teamId || teamId === "all";
  const isAllGroups = !groupId || groupId === "all";

  const { startDate, endDate } = getStartAndEndDates(date);

  const groupMatchConditions: any = {
    ...(groupId && !isAllGroups && { groupId: +groupId }), // Filter by group if specific group selected
    ...(round && { round }), // Filter by round if provided
    ...(date && { date: { gte: startDate, lte: endDate } }),
  };

  if (!isAllTeams) {
    groupMatchConditions.OR = [
      { homeTeamId: +teamId },
      { awayTeamId: +teamId },
    ];
  }

  const knockoutMatchConditions: any = {
    ...(round && { round }), // Filter by round if provided
    ...(date && { date: { gte: startDate, lte: endDate } }),
  };

  if (!isAllTeams) {
    knockoutMatchConditions.OR = [
      { homeTeamId: +teamId },
      { awayTeamId: +teamId },
    ];
  }

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
      isAllGroups || groupId
        ? prisma.match.findMany({
            where: {
              tournamentEditionId: +params.editionId,
              tournamentEdition: {
                tournamentId: +params.id,
              },
              ...groupMatchConditions,
            },
            include: {
              homeTeam: true,
              awayTeam: true,
              tournamentEdition: { include: { tournament: true } },
              group: true,
            },
          })
        : [],
      isAllGroups
        ? prisma.knockoutMatch.findMany({
            where: {
              tournamentEditionId: +params.editionId,
              tournamentEdition: {
                tournamentId: +params.id,
              },
              ...knockoutMatchConditions,
            },
            include: {
              homeTeam: true,
              awayTeam: true,
              tournamentEdition: { include: { tournament: true } },
            },
          })
        : [],
      getAllMatchesRounds(+params.editionId),
    ]);

  if (!tournamentEdition) throw new Error("Something went wrong");

  return (
    <MatchesCards
      tournamentEdition={tournamentEdition}
      matches={matches}
      knockoutMatches={knockoutMatches}
      rounds={rounds}
    />
  );
}
