import prisma from "@/lib/db";

import MatchesCards from "@/components/lists/cards/matches/MatchesCards";
import {
  getAllMatchesRounds,
  checkRoundExisted,
} from "@/lib/getAllMatchesRounds";

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

  const startDate = date && new Date(`${date}T00:00:00.000Z`);
  const endDate = date && new Date(`${date}T23:59:59.999Z`);

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
              tournamentEdition: true,
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
              tournamentEdition: true,
            },
          })
        : [],
      getAllMatchesRounds(+params.editionId),
    ]);

  const dd = new Date();
  console.log(dd);
  console.log(dd.toLocaleString());
  console.log(dd.toLocaleDateString());

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
